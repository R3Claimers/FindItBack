import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Tag,
  User,
  Mail,
  Phone,
  Edit,
  Trash2,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { itemService } from "../services/itemService.jsx";
import ImageGallery from "../components/ImageGallery.jsx";
import Comments from "../components/Comments.jsx";
import toast from "react-hot-toast";

const LostItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    fetchItemDetail();
  }, [id]);

  const fetchItemDetail = async () => {
    try {
      setLoading(true);
      const response = await itemService.getLostItemById(id);
      setItem(response.data);
    } catch (error) {
      console.error("Error fetching item:", error);
      toast.error("Failed to load item details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      setDeleting(true);
      await itemService.deleteLostItem(id);
      toast.success("Item deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    } finally {
      setDeleting(false);
    }
  };

  const handleResolve = async () => {
    if (!window.confirm("Mark this item as resolved/found?")) return;

    try {
      setResolving(true);
      await itemService.resolveLostItem(id);
      toast.success("Item marked as resolved!");
      fetchItemDetail(); // Refresh data
    } catch (error) {
      console.error("Error resolving item:", error);
      toast.error("Failed to resolve item");
    } finally {
      setResolving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryBadgeClass = (category) => {
    const badges = {
      Electronics: "badge-electronics",
      Documents: "badge-documents",
      Keys: "badge-keys",
      Bags: "badge-bags",
      Wallets: "badge-wallets",
      Jewelry: "badge-jewelry",
      Clothing: "badge-clothing",
      Pets: "badge-pets",
      Other: "badge-other",
    };
    return badges[category] || badges.Other;
  };

  const isOwner = currentUser && item?.userId?._id === currentUser.uid;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Item Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-smooth"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="card">
              <ImageGallery
                images={item.images || (item.imageUrl ? [item.imageUrl] : [])}
                altText={item.title}
              />
            </div>

            {/* Item Details */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`badge ${getCategoryBadgeClass(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                    <span
                      className={`badge ${
                        item.status === "resolved"
                          ? "badge-success"
                          : "badge-primary"
                      }`}
                    >
                      {item.status === "resolved" ? "Resolved" : "Open"}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {item.title}
                  </h1>
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-border">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">
                      {item.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date Lost</p>
                    <p className="font-medium text-foreground">
                      {formatDate(item.dateLost)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Actions */}
            {isOwner && item.status !== "resolved" && (
              <div className="card space-y-3">
                <h3 className="font-semibold text-foreground mb-3">
                  Manage Item
                </h3>
                <button
                  onClick={handleResolve}
                  disabled={resolving}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resolving ? (
                    <div className="spinner-small mr-2"></div>
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Mark as Found
                </button>
                <button
                  onClick={() => navigate(`/lost/${id}/edit`)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-smooth"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Item
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? (
                    <div className="spinner-small mr-2"></div>
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete Item
                </button>
              </div>
            )}

            {/* Contact Information */}
            <div className="card">
              <h3 className="font-semibold text-foreground mb-4">Posted By</h3>
              <div className="flex items-center space-x-3 mb-4">
                {item.userId?.profilePic ? (
                  <img
                    src={item.userId.profilePic}
                    alt={item.userId.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold">
                    {item.userId?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground">
                    {item.userId?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Posted {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>

              {!isOwner && item.status !== "resolved" && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    Found this item? Contact the owner:
                  </p>
                  {item.userId?.email && (
                    <a
                      href={`mailto:${item.userId.email}`}
                      className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-smooth"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{item.userId.email}</span>
                    </a>
                  )}
                  {item.userId?.phone && (
                    <a
                      href={`tel:${item.userId.phone}`}
                      className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-smooth"
                    >
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{item.userId.phone}</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Report/Flag (for non-owners) */}
            {!isOwner && (
              <div className="card">
                <button className="w-full text-sm text-muted-foreground hover:text-destructive transition-smooth">
                  <AlertCircle className="inline-block mr-2 h-4 w-4" />
                  Report this post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <Comments itemId={id} itemType="LostItem" />
        </div>
      </div>
    </div>
  );
};

export default LostItemDetail;
