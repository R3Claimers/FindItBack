import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import { formatDate, truncateText } from "../utils/helpers.js";

const ItemCard = ({ item, type = "lost", onAction }) => {
  const isLost = type === "lost";
  const itemPath = isLost ? `/lost/${item._id}` : `/found/${item._id}`;

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
        {/* Image */}
        {item.imageUrl && (
          <Link to={itemPath}>
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-48 object-cover rounded-lg mb-4 hover:opacity-95 transition-smooth"
            />
          </Link>
        )}

        {/* Category and Status */}
        <div className="flex items-center justify-between mb-3">
          <span className={`badge ${getCategoryBadgeClass(item.category)}`}>
            {item.category}
          </span>
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
                {item.userId?.name?.substring(0, 2).toUpperCase()}
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
      </div>
    </div>
  );
};

export default ItemCard;
