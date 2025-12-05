import React, { useState, useEffect } from "react";
import {
  Users,
  Check,
  X,
  Clock,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react";
import claimService from "../services/claimService";
import toast from "react-hot-toast";

const ClaimsSection = ({ itemId, onClaimApproved }) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedClaim, setExpandedClaim] = useState(null);
  const [processingClaim, setProcessingClaim] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    fetchClaims();
  }, [itemId]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await claimService.getItemClaims(itemId);
      setClaims(response.data);
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClaim = async (claimId) => {
    try {
      setProcessingClaim(claimId);
      await claimService.approveClaim(claimId, responseMessage);
      toast.success("Claim approved successfully");
      setResponseMessage("");
      fetchClaims();
      if (onClaimApproved) onClaimApproved();
    } catch (error) {
      console.error("Error approving claim:", error);
      toast.error(error.message || "Failed to approve claim");
    } finally {
      setProcessingClaim(null);
    }
  };

  const handleRejectClaim = async (claimId) => {
    try {
      setProcessingClaim(claimId);
      await claimService.rejectClaim(claimId, responseMessage);
      toast.success("Claim rejected");
      setResponseMessage("");
      fetchClaims();
    } catch (error) {
      console.error("Error rejecting claim:", error);
      toast.error(error.message || "Failed to reject claim");
    } finally {
      setProcessingClaim(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending:
        "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
      approved:
        "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
      rejected:
        "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
    };
    return badges[status] || badges.pending;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <Check className="h-3 w-3" />;
      case "rejected":
        return <X className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Claims</h3>
        </div>
        <div className="flex justify-center py-4">
          <div className="spinner-small"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Claims</h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {claims.length} {claims.length === 1 ? "claim" : "claims"}
        </span>
      </div>

      {claims.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-4">
          No claims yet
        </p>
      ) : (
        <div className="space-y-3">
          {claims.map((claim) => (
            <div
              key={claim._id}
              className="border border-border rounded-lg overflow-hidden"
            >
              {/* Claim Header */}
              <button
                onClick={() =>
                  setExpandedClaim(
                    expandedClaim === claim._id ? null : claim._id
                  )
                }
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-smooth"
              >
                <div className="flex items-center gap-3">
                  {claim.claimantId?.profilePic ? (
                    <img
                      src={claim.claimantId.profilePic}
                      alt={claim.claimantId.name}
                      className="h-10 w-10 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                      {claim.claimantId?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-medium text-foreground text-sm">
                      {claim.claimantId?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(claim.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${getStatusBadge(
                      claim.status
                    )}`}
                  >
                    {getStatusIcon(claim.status)}
                    {claim.status.charAt(0).toUpperCase() +
                      claim.status.slice(1)}
                  </span>
                  {expandedClaim === claim._id ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {expandedClaim === claim._id && (
                <div className="px-3 pb-3 border-t border-border pt-3 space-y-3">
                  {/* Claim Message */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {claim.message}
                      </p>
                    </div>
                  </div>

                  {/* Claimant Contact Info */}
                  {claim.status === "pending" && (
                    <div className="flex flex-wrap gap-3 text-sm">
                      {claim.claimantId?.email && (
                        <a
                          href={`mailto:${claim.claimantId.email}`}
                          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-smooth"
                        >
                          <Mail className="h-3 w-3" />
                          {claim.claimantId.email}
                        </a>
                      )}
                      {claim.claimantId?.phone && (
                        <a
                          href={`tel:${claim.claimantId.phone}`}
                          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-smooth"
                        >
                          <Phone className="h-3 w-3" />
                          {claim.claimantId.phone}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Response Message for processed claims */}
                  {claim.responseMessage && claim.status !== "pending" && (
                    <div className="bg-muted/30 rounded-lg p-2 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Your response:</span>{" "}
                        {claim.responseMessage}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons for pending claims */}
                  {claim.status === "pending" && (
                    <div className="space-y-3 pt-2">
                      <input
                        type="text"
                        placeholder="Optional response message..."
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveClaim(claim._id)}
                          disabled={processingClaim === claim._id}
                          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30 hover:bg-green-500/20 rounded-lg transition-smooth disabled:opacity-50"
                        >
                          {processingClaim === claim._id ? (
                            <div className="spinner-small"></div>
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectClaim(claim._id)}
                          disabled={processingClaim === claim._id}
                          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded-lg transition-smooth disabled:opacity-50"
                        >
                          {processingClaim === claim._id ? (
                            <div className="spinner-small"></div>
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaimsSection;
