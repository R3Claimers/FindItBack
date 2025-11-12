const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      // index: true removed - unique already creates an index
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // This already creates an index
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-()]+$/, "Please provide a valid phone number"],
    },
    profilePic: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
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

// Indexes are automatically created by unique: true on uid and email fields
// No need for manual index definitions

// Method to get public profile
userSchema.methods.getPublicProfile = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    profilePic: this.profilePic,
    bio: this.bio,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
