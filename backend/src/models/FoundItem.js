const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema(
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
    dateFound: {
      type: Date,
      required: [true, "Date found is required"],
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
      enum: ["available", "claimed"],
      default: "available",
      index: true,
    },
    isReturned: {
      type: Boolean,
      default: false,
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
foundItemSchema.index({ category: 1, location: 1, dateFound: -1 });
foundItemSchema.index({ userId: 1, isReturned: 1 });
foundItemSchema.index({ isReturned: 1, createdAt: -1 });

// Text index for search
foundItemSchema.index({ title: "text", description: "text", location: "text" });

// Method to check if item is still available
foundItemSchema.methods.isAvailable = function () {
  return !this.isReturned;
};

// Static method to find recent items
foundItemSchema.statics.findRecent = function (limit = 10) {
  return this.find({ isReturned: false })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("userId", "name email phone profilePic");
};

module.exports = mongoose.model("FoundItem", foundItemSchema);
