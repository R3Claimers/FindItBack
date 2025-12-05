const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoundItem",
      required: [true, "Item ID is required"],
      index: true,
    },
    claimantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Claimant ID is required"],
      index: true,
    },
    message: {
      type: String,
      required: [true, "Claim message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    responseMessage: {
      type: String,
      trim: true,
      maxlength: [500, "Response message cannot exceed 500 characters"],
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
claimSchema.index({ itemId: 1, status: 1 });
claimSchema.index({ claimantId: 1, status: 1 });

// Prevent duplicate pending claims from the same user on the same item
claimSchema.index({ itemId: 1, claimantId: 1 }, { unique: true });

module.exports = mongoose.model("Claim", claimSchema);
