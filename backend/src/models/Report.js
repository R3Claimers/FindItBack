const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    itemType: {
      type: String,
      required: true,
      enum: ["LostItem", "FoundItem"],
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "itemType",
      index: true,
    },
    reason: {
      type: String,
      required: true,
      enum: [
        "Spam or misleading",
        "Inappropriate content",
        "Duplicate post",
        "Incorrect information",
        "Suspicious activity",
        "Other",
      ],
    },
    details: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending",
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate reports from same user
reportSchema.index({ reportedBy: 1, itemId: 1 }, { unique: true });

// Index for querying reports by item
reportSchema.index({ itemType: 1, itemId: 1 });

module.exports = mongoose.model("Report", reportSchema);
