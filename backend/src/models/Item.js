const mongoose = require("mongoose");

const CATEGORIES = [
  "Electronics",
  "Documents",
  "Keys",
  "Bags",
  "Wallets",
  "Jewelry",
  "Clothing",
  "Pets",
  "Other",
];

// Factory pattern: generates type-specific schemas while keeping separate collections for data isolation
const createItemSchema = (itemType) => {
  const dateField = itemType === "lost" ? "dateLost" : "dateFound";
  const defaultStatus = itemType === "lost" ? "open" : "available";
  const statusEnum =
    itemType === "lost" ? ["open", "found"] : ["available", "claimed"];

  const schemaDefinition = {
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
        values: CATEGORIES,
        message: "{VALUE} is not a valid category",
      },
      index: true,
    },
    [dateField]: {
      type: Date,
      required: [true, "Date is required"],
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
        validator: (v) => v.length <= 5,
        message: "Maximum 5 images allowed",
      },
    },
    status: {
      type: String,
      enum: statusEnum,
      default: defaultStatus,
      index: true,
    },
  };

  if (itemType === "found") {
    schemaDefinition.isReturned = {
      type: Boolean,
      default: false,
    };
  }

  const schema = new mongoose.Schema(schemaDefinition, { timestamps: true });

  schema.index({ category: 1, location: 1, [dateField]: -1 });
  schema.index({ userId: 1, status: 1 });
  schema.index({ status: 1, createdAt: -1 });
  schema.index({ title: "text", description: "text", location: "text" });

  schema.virtual("date").get(function () {
    return this[dateField];
  });

  schema.set("toJSON", { virtuals: true });
  schema.set("toObject", { virtuals: true });

  return schema;
};

const LostItem = mongoose.model("LostItem", createItemSchema("lost"));
const FoundItem = mongoose.model("FoundItem", createItemSchema("found"));

module.exports = { LostItem, FoundItem, CATEGORIES };
