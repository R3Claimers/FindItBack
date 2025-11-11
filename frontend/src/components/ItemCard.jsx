import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Image as ImageIcon } from "lucide-react";
import { formatDate, truncateText } from "../utils/helpers.js";

const ItemCard = ({ item, type = "lost", onAction, hidePostedBy = false }) => {
  const isLost = type === "lost";
  const itemPath = isLost ? `/lost/${item._id}` : `/found/${item._id}`;

  // Get backend URL for images
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
    const serverUrl = baseUrl.replace("/api/v1", "");
    return `${serverUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  // Get images from item (support both old imageUrl and new images array)
  const getItemImages = () => {
    if (item.images && item.images.length > 0) {
      return item.images;
    }
    if (item.imageUrl) {
      return [item.imageUrl];
    }
    return [];
  };

  const itemImages = getItemImages();
  const hasMultipleImages = itemImages.length > 1;

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

  const getStatusBadge = () => {
    if (isLost) {
      return item.status === "resolved" ? (
        <span className="badge badge-success">Resolved</span>
      ) : (
        <span className="badge badge-primary">Open</span>
      );
    } else {
      return item.isReturned ? (
        <span className="badge badge-success">Returned</span>
      ) : (
        <span className="badge badge-primary">Available</span>
      );
    }
  };

  return (
    <div className="card card-hover">
      <div className="flex flex-col h-full">
        {/* Image(s) */}
        {itemImages.length > 0 ? (
          <Link to={itemPath} className="relative group">
            <div className="w-full h-48 bg-muted rounded-lg mb-4 overflow-hidden flex items-center justify-center">
              <img
                src={getImageUrl(itemImages[0])}
                alt={item.title}
                className="max-w-full max-h-full object-contain hover:opacity-95 transition-smooth"
              />
              {/* Lost/Found Badge Overlay */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <span
                  className={`badge backdrop-blur-sm border border-white/20 shadow-md ${
                    isLost
                      ? "bg-orange-500/90 text-white"
                      : "bg-green-500/90 text-white"
                  }`}
                >
                  {isLost ? "Lost" : "Found"}
                </span>
                {hasMultipleImages && (
                  <span className="badge bg-black/70 text-white backdrop-blur-sm border border-white/10 text-xs">
                    {itemImages.length} imgs
                  </span>
                )}
              </div>
            </div>
          </Link>
        ) : (
          <div className="w-full h-48 bg-muted rounded-lg mb-4 flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground opacity-50" />
          </div>
        )}

        {/* Category & Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2 items-center flex-wrap">
            <span className={`badge ${getCategoryBadgeClass(item.category)}`}>
              {item.category}
            </span>
          </div>
          {getStatusBadge()}
        </div>

        {/* Title and Description */}
        <Link to={itemPath}>
          <h3 className="text-xl font-semibold text-card-foreground mb-2 hover:text-primary transition-smooth">
            {item.title}
          </h3>
        </Link>
        <p className="text-muted-foreground mb-4 flex-grow">
          {truncateText(item.description, 120)}
        </p>

        {/* Details */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>
              {isLost ? "Lost on" : "Found on"}{" "}
              {formatDate(isLost ? item.dateLost : item.dateFound)}
            </span>
          </div>
        </div>

        {/* Posted by */}
        {!hidePostedBy && (
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {item.userId?.profilePic ? (
                <img
                  src={item.userId.profilePic}
                  alt={item.userId.name}
                  className="h-8 w-8 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                  {item.userId?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <span className="text-sm text-muted-foreground">
                Posted by{" "}
                <span className="font-medium text-foreground">
                  {item.userId?.name}
                </span>
              </span>
            </div>

            {onAction && (
              <button
                onClick={() => onAction(item)}
                className="text-primary hover:text-primary/80 font-medium text-sm transition-smooth"
              >
                View
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
