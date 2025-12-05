import React, { useState } from "react";
import { X, Hand } from "lucide-react";

const ClaimModal = ({ isOpen, onClose, onSubmit, itemTitle }) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please provide a message describing why this item is yours");
      return;
    }
    if (message.trim().length < 10) {
      setError("Message must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await onSubmit(message);
      setMessage("");
      onClose();
    } catch (error) {
      setError(error.message || "Failed to submit claim");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setMessage("");
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-smooth"
          disabled={isSubmitting}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Hand className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Claim This Item
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {itemTitle}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Describe why this item belongs to you{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setError("");
                }}
                placeholder="Provide details that prove this item is yours (e.g., unique identifiers, specific marks, contents, etc.)"
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
                disabled={isSubmitting}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  Be specific to help the finder verify your claim
                </span>
                <span className="text-xs text-muted-foreground">
                  {message.length}/500
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            {/* Info */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                By submitting this claim, you confirm that this item belongs to
                you. The finder will review your claim and may contact you for
                verification.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-smooth"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner-small"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Hand className="h-4 w-4" />
                  Submit Claim
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimModal;
