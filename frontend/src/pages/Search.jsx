import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Search as SearchIcon,
  Filter,
  Package,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { lostItemService } from "../services/lostItemService.jsx";
import { foundItemService } from "../services/foundItemService.jsx";
import ItemCard from "../components/ItemCard.jsx";
import toast from "react-hot-toast";

const CATEGORIES = [
  "All",
  "Electronics",
  "Documents",
  "Keys",
  "Bags",
  "Wallets",
  "Jewelry",
  "Clothing",
  "Pets",
  "Other",
];

const Search = () => {
  const location = useLocation();
  const searchInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Focus on search input if coming from hero section
  useEffect(() => {
    if (location.state?.focusSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      setLoading(true);
      const [lostResponse, foundResponse] = await Promise.all([
        lostItemService.getAllLostItems({ page: 1, limit: 24 }),
        foundItemService.getAllFoundItems({ page: 1, limit: 24 }),
      ]);

      setLostItems(lostResponse.data || []);
      setFoundItems(foundResponse.data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      // Suppress toast for rate limiting to avoid spam
      if (error.status !== 429) {
        toast.error("Failed to load items");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on search query, category, and date range
  const filterItems = (items) => {
    let filtered = items.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      // Date filtering
      const itemDate = new Date(item.dateLost || item.dateFound);
      const matchesDateFrom = !dateFrom || itemDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || itemDate <= new Date(dateTo);

      return (
        matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo
      );
    });

    // Sort items
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "recent-activity") {
      filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return filtered;
  };

  const getDisplayItems = () => {
    if (activeTab === "all") {
      return [...filterItems(lostItems), ...filterItems(foundItems)];
    } else if (activeTab === "lost") {
      return filterItems(lostItems);
    } else {
      return filterItems(foundItems);
    }
  };

  const displayItems = getDisplayItems();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Browse All Posts
          </h1>
          <p className="text-muted-foreground text-lg">
            Search through all lost and found items
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-3xl mx-auto">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by title, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-card text-foreground border border-input rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          {/* Tab Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === "all"
                  ? "bg-cyan-500 text-white shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <span className="hidden sm:inline">All Items</span>
              <span className="sm:hidden">All</span> (
              {lostItems.length + foundItems.length})
            </button>
            <button
              onClick={() => setActiveTab("lost")}
              className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === "lost"
                  ? "bg-cyan-500 text-white shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Lost ({lostItems.length})
            </button>
            <button
              onClick={() => setActiveTab("found")}
              className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === "found"
                  ? "bg-cyan-500 text-white shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Found ({foundItems.length})
            </button>
          </div>

          {/* Collapsible Filter Controls */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            {/* Filter Header - Always Visible */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="w-full flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 hover:bg-muted/50 transition-all"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-cyan-500" />
                <span className="font-medium text-foreground">Filters</span>
                {!filtersOpen &&
                  (selectedCategory !== "All" ||
                    dateFrom ||
                    dateTo ||
                    sortBy !== "newest") && (
                    <span className="ml-2 px-2 py-0.5 bg-cyan-500 text-white text-xs rounded-full">
                      Active
                    </span>
                  )}
              </div>
              {filtersOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {/* Filter Content - Collapsible */}
            {filtersOpen && (
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-border animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 pt-4">
                  {/* Category Filter */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5">
                      Category
                    </label>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date Range Filters */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5">
                      Date From
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-3 py-2.5 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5">
                      Date To
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-3 py-2.5 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Sort By */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2.5 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="recent-activity">Recent Activity</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {(dateFrom ||
                  dateTo ||
                  selectedCategory !== "All" ||
                  sortBy !== "newest") && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <button
                      onClick={() => {
                        setDateFrom("");
                        setDateTo("");
                        setSelectedCategory("All");
                        setSortBy("newest");
                      }}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 rounded-lg transition-all"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {displayItems.length} item
                {displayItems.length !== 1 ? "s" : ""}
                {searchQuery && ` matching "${searchQuery}"`}
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </p>
            </div>

            {/* Items Grid */}
            {displayItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayItems.map((item) => {
                  const isLost = lostItems.some((i) => i._id === item._id);
                  return (
                    <ItemCard
                      key={item._id}
                      item={item}
                      type={isLost ? "lost" : "found"}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="h-20 w-20 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No items found
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedCategory !== "All"
                    ? "Try adjusting your search or filters"
                    : "No items have been posted yet"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
