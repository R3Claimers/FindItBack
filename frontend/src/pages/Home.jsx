import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, Package } from "lucide-react";
import { lostItemService } from "../services/lostItemService.jsx";
import { foundItemService } from "../services/foundItemService.jsx";
import ItemCard from "../components/ItemCard.jsx";
import toast from "react-hot-toast";

const Home = () => {
  const [recentLostItems, setRecentLostItems] = useState([]);
  const [recentFoundItems, setRecentFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLostLeftFade, setShowLostLeftFade] = useState(false);
  const [showLostRightFade, setShowLostRightFade] = useState(true);
  const [showFoundLeftFade, setShowFoundLeftFade] = useState(false);
  const [showFoundRightFade, setShowFoundRightFade] = useState(true);

  const lostScrollRef = useRef(null);
  const foundScrollRef = useRef(null);

  useEffect(() => {
    fetchRecentItems();
  }, []);

  const fetchRecentItems = async () => {
    try {
      setLoading(true);
      const [lostResponse, foundResponse] = await Promise.all([
        lostItemService.getAllLostItems({ page: 1, limit: 12 }),
        foundItemService.getAllFoundItems({ page: 1, limit: 12 }),
      ]);

      setRecentLostItems(lostResponse.data || []);
      setRecentFoundItems(foundResponse.data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      // Don't show error toast for rate limiting
      if (!error.message?.includes("429")) {
        toast.error("Failed to load items");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (scrollContainer, setShowLeft, setShowRight) => {
    if (!scrollContainer) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
    const isAtStart = scrollLeft <= 10;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;

    setShowLeft(!isAtStart);
    setShowRight(!isAtEnd);
  };

  useEffect(() => {
    // Check initial scroll positions after items load
    if (lostScrollRef.current) {
      handleScroll(
        lostScrollRef.current,
        setShowLostLeftFade,
        setShowLostRightFade
      );
    }
    if (foundScrollRef.current) {
      handleScroll(
        foundScrollRef.current,
        setShowFoundLeftFade,
        setShowFoundRightFade
      );
    }
  }, [recentLostItems, recentFoundItems]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Animated Gradient */}
      <div className="relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-teal-500 to-cyan-600">
          {/* Animated Flare 1 */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-flare-1"></div>
          {/* Animated Flare 2 */}
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-cyan-300/30 rounded-full blur-3xl animate-flare-2"></div>
          {/* Animated Flare 3 */}
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-teal-400/25 rounded-full blur-3xl animate-flare-3"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in text-white drop-shadow-lg">
              Find What You've Lost
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/95 drop-shadow-md">
              A community-driven platform to reunite people with their lost
              belongings
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/post"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-cyan-600 font-semibold rounded-xl hover:bg-white/90 transition-all transform hover:scale-105 shadow-xl"
              >
                <Package className="mr-2 h-5 w-5" />
                Post an Item
              </Link>
              <Link
                to="/search"
                state={{ focusSearch: true }}
                className="inline-flex items-center justify-center px-8 py-4 bg-cyan-600/30 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-cyan-600/40 transition-all transform hover:scale-105 shadow-xl border-2 border-white/30"
              >
                <SearchIcon className="mr-2 h-5 w-5" />
                Search Items
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-16 md:h-24"
            preserveAspectRatio="none"
          >
            <path
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              className="fill-background"
            ></path>
          </svg>
        </div>
      </div>

      {/* Recent Items Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Lost Items */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Recent Lost Items
            </h2>
            <Link
              to="/search"
              className="text-primary hover:text-primary/80 transition-smooth text-sm font-medium"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : recentLostItems.length > 0 ? (
            <div className="relative -mx-4">
              {/* Left fade gradient - hidden on mobile */}
              {showLostLeftFade && (
                <div className="hidden md:block absolute left-0 top-0 bottom-4 w-32 bg-gradient-to-r from-background via-background/50 to-transparent z-10 pointer-events-none transition-opacity duration-300" />
              )}

              {/* Right fade gradient - hidden on mobile */}
              {showLostRightFade && (
                <div className="hidden md:block absolute right-0 top-0 bottom-4 w-32 bg-gradient-to-l from-background via-background/50 to-transparent z-10 pointer-events-none transition-opacity duration-300" />
              )}

              <div
                ref={lostScrollRef}
                onScroll={(e) =>
                  handleScroll(
                    e.target,
                    setShowLostLeftFade,
                    setShowLostRightFade
                  )
                }
                className="overflow-x-auto pb-4 px-4 scrollbar-hide"
              >
                <div className="flex gap-6" style={{ minWidth: "min-content" }}>
                  {recentLostItems.map((item) => (
                    <div key={item._id} className="flex-none w-80">
                      <ItemCard item={item} type="lost" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 card">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No lost items posted yet</p>
            </div>
          )}
        </div>

        {/* Found Items */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Recent Found Items
            </h2>
            <Link
              to="/search"
              className="text-primary hover:text-primary/80 transition-smooth text-sm font-medium"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : recentFoundItems.length > 0 ? (
            <div className="relative -mx-4">
              {/* Left fade gradient - hidden on mobile */}
              {showFoundLeftFade && (
                <div className="hidden md:block absolute left-0 top-0 bottom-4 w-32 bg-gradient-to-r from-background via-background/50 to-transparent z-10 pointer-events-none transition-opacity duration-300" />
              )}

              {/* Right fade gradient - hidden on mobile */}
              {showFoundRightFade && (
                <div className="hidden md:block absolute right-0 top-0 bottom-4 w-32 bg-gradient-to-l from-background via-background/50 to-transparent z-10 pointer-events-none transition-opacity duration-300" />
              )}

              <div
                ref={foundScrollRef}
                onScroll={(e) =>
                  handleScroll(
                    e.target,
                    setShowFoundLeftFade,
                    setShowFoundRightFade
                  )
                }
                className="overflow-x-auto pb-4 px-4 scrollbar-hide"
              >
                <div className="flex gap-6" style={{ minWidth: "min-content" }}>
                  {recentFoundItems.map((item) => (
                    <div key={item._id} className="flex-none w-80">
                      <ItemCard item={item} type="found" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 card">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No found items posted yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
