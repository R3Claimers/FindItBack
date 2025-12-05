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
import reportService from "../services/reportService.jsx";
import ImageGallery from "../components/ImageGallery.jsx";
import Comments from "../components/Comments.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import ReportModal from "../components/ReportModal.jsx";
import toast from "react-hot-toast";

const LostItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

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
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await itemService.deleteLostItem(id);
      toast.success("Item deleted successfully");
      navigate("/home");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    } finally {
      setDeleting(false);
    }
  };

  const handleResolve = async () => {
    try {
      setResolving(true);
      await itemService.resolveLostItem(id);
      toast.success("Item marked as found!");
      fetchItemDetail(); // Refresh data
    } catch (error) {
      console.error("Error resolving item:", error);
      toast.error("Failed to resolve item");
    } finally {
      setResolving(false);
    }
  };

  const handleReport = async (reportData) => {
    try {
      await reportService.createReport("LostItem", id, reportData);
      toast.success("Report submitted successfully");
    } catch (error) {
      console.error("Error submitting report:", error);
      if (error.message === "You have already reported this item") {
        toast.error("You have already reported this item");
      } else {
        toast.error("Failed to submit report");
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await itemService.updateLostItemStatus(id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      fetchItemDetail(); // Refresh data
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
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

  const isOwner =
    (userProfile && item?.userId?._id === userProfile?._id) ||
    (userProfile && item?.userId === userProfile?._id);

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
            to="/home"
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
                itemType="lost"
              />
            </div>

            {/* Item Details */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span
                      className={`badge ${getCategoryBadgeClass(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                    <span
                      className={`badge ${
                        item.status === "found"
                          ? "badge-success"
                          : "badge-primary"
                      }`}
                    >
                      {item.status === "found" ? "Found" : "Open"}
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
            {isOwner && (
              <div className="card space-y-3">
                <h3 className="font-semibold text-foreground mb-3">
                  Manage Item
                </h3>

                {/* Status Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updatingStatus}
                    className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="open">Open</option>
                    <option value="found">Found</option>
                  </select>
                </div>

                {item.status !== "found" && (
                  <button
                    onClick={() => setShowResolveModal(true)}
                    disabled={resolving}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30 hover:bg-green-500/20 rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resolving ? (
                      <div className="spinner-small mr-2"></div>
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Mark as Found
                  </button>
                )}
                <button
                  onClick={() => navigate(`/edit/lost/${id}`)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 rounded-lg transition-smooth"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Item
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={deleting}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
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

              {!isOwner && item.status !== "found" && (
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
                <button
                  onClick={() => setShowReportModal(true)}
                  className="w-full text-sm text-orange-500 dark:text-orange-400 hover:text-red-500 dark:hover:text-red-400 transition-smooth font-medium"
                >
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

      {/* Modals */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Lost Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />

      <ConfirmModal
        isOpen={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        onConfirm={handleResolve}
        title="Mark as Found"
        message="Mark this item as found? This will notify that the item has been found."
        confirmText="Mark as Found"
        cancelText="Cancel"
        confirmVariant="primary"
      />

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReport}
        itemType="lost"
      />
    </div>
  );
};

export default LostItemDetail;
