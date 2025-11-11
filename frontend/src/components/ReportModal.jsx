import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";

const ReportModal = ({ isOpen, onClose, onSubmit, itemType }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    "Spam or misleading",
    "Inappropriate content",
    "Duplicate post",
    "Incorrect information",
    "Suspicious activity",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ reason, details });
      // Reset form
      setReason("");
      setDetails("");
      onClose();
    } catch (error) {
      console.error("Report submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-smooth"
          disabled={isSubmitting}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-red-500/10">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Report this {itemType === "lost" ? "Lost" : "Found"} Item
            </h3>
            <p className="text-sm text-muted-foreground">
              Help us maintain a safe community
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Reason Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reason for reporting <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {reportReasons.map((reportReason) => (
                  <label
                    key={reportReason}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-smooth"
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reportReason}
                      checked={reason === reportReason}
                      onChange={(e) => setReason(e.target.value)}
                      className="text-primary focus:ring-primary"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-foreground">
                      {reportReason}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Additional details (optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide more context about why you're reporting this post..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                disabled={isSubmitting}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {details.length}/500 characters
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-smooth"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!reason || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
