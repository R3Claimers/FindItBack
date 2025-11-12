const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Electronics",
          "Documents",
          "Keys",
          "Bags",
          "Wallets",
          "Jewelry",
          "Clothing",
          "Pets",
          "Other",
        ],
        message: "{VALUE} is not a valid category",
      },
      index: true,
    },
    dateLost: {
      type: Date,
      required: [true, "Date lost is required"],
      index: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      index: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 5;
        },
        message: "Maximum 5 images allowed",
      },
    },
    status: {
      type: String,
      enum: ["open", "found"],
      default: "open",
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
lostItemSchema.index({ category: 1, location: 1, dateLost: -1 });
lostItemSchema.index({ userId: 1, status: 1 });
lostItemSchema.index({ status: 1, createdAt: -1 });

// Text index for search
lostItemSchema.index({ title: "text", description: "text", location: "text" });

// Method to check if item is still open
lostItemSchema.methods.isOpen = function () {
  return this.status === "open";
};

// Static method to find recent items
lostItemSchema.statics.findRecent = function (limit = 10) {
  return this.find({ status: "open" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("userId", "name email phone profilePic");
};

module.exports = mongoose.model("LostItem", lostItemSchema);
