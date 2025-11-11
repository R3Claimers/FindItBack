import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLoading } from "../context/LoadingContext.jsx";
import {
  PlusCircle,
  Upload,
  X,
  MapPin,
  Calendar,
  Tag,
  FileText,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { itemService } from "../services/itemService.jsx";

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

const PostItem = () => {
  const { currentUser } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [postType, setPostType] = useState(""); // "lost" or "found"
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    location: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 5 images
    if (images.length + files.length > 5) {
      toast.error("You can upload maximum 5 images");
      return;
    }

    // Validate file size (max 5MB per image)
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    // Create preview URLs
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!postType) {
      toast.error("Please select whether the item is lost or found");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (formData.title.length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (formData.description.length < 10) {
      toast.error("Description must be at least 10 characters");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (!formData.date) {
      toast.error(
        `Please select the date ${postType === "lost" ? "lost" : "found"}`
      );
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Please enter the location");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);
    showLoading("Uploading images and posting item...");

    try {
      // Create FormData object for file upload
      const formDataObj = new FormData();

      // Append all form fields
      formDataObj.append("title", formData.title.trim());
      formDataObj.append("description", formData.description.trim());
      formDataObj.append("category", formData.category);
      formDataObj.append(
        postType === "lost" ? "dateLost" : "dateFound",
        formData.date
      );
      formDataObj.append("location", formData.location.trim());

      // Append all images
      images.forEach((image) => {
        formDataObj.append("images", image);
      });

      let response;
      if (postType === "lost") {
        response = await itemService.createLostItem(formDataObj);
      } else {
        response = await itemService.createFoundItem(formDataObj);
      }

      toast.success(
        `${postType === "lost" ? "Lost" : "Found"} item posted successfully!`
      );

      // Navigate to the item detail page
      if (postType === "lost") {
        navigate(`/lost/${response.data._id}`);
      } else {
        navigate(`/found/${response.data._id}`);
      }
    } catch (error) {
      console.error("Post item error:", error);
      const errorMessage = error.message || "Failed to post item";
      toast.error(errorMessage);
    } finally {
      hideLoading();
      setLoading(false);
    }
  };

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <PlusCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Post an Item
          </h1>
          <p className="text-muted-foreground">
            Help reunite lost items with their owners or report found items
          </p>
        </div>

        {/* Post Type Selection */}
        {!postType && (
          <div className="card max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
              What would you like to report?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setPostType("lost")}
                className="p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-smooth group"
              >
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-destructive/20 transition-smooth">
                    <svg
                      className="h-8 w-8 text-destructive"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    I Lost Something
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Report an item you've lost and need help finding
                  </p>
                </div>
              </button>

              <button
                onClick={() => setPostType("found")}
                className="p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-smooth group"
              >
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-smooth">
                    <svg
                      className="h-8 w-8 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    I Found Something
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Report an item you've found to help return it
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Post Form */}
        {postType && (
          <form onSubmit={handleSubmit} className="card">
            {/* Type Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    postType === "lost"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {postType === "lost" ? "Lost Item" : "Found Item"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPostType("");
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    date: "",
                    location: "",
                  });
                  setImages([]);
                  imagePreviews.forEach((url) => URL.revokeObjectURL(url));
                  setImagePreviews([]);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
              >
                Change Type
              </button>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  <span className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>
                      Title <span className="text-red-500">*</span>
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Black leather wallet, iPhone 13 Pro"
                  className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth placeholder:text-muted-foreground"
                  maxLength={100}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed description including color, brand, unique features, etc."
                  rows={5}
                  className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth placeholder:text-muted-foreground resize-none"
                  maxLength={1000}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    <span className="flex items-center space-x-2">
                      <Tag className="h-4 w-4" />
                      <span>
                        Category <span className="text-red-500">*</span>
                      </span>
                    </span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                    required
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    <span className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Date {postType === "lost" ? "Lost" : "Found"}{" "}
                        <span className="text-red-500">*</span>
                      </span>
                    </span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  <span className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      Location <span className="text-red-500">*</span>
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Central Park, Main Street Bus Stop, University Library"
                  className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth placeholder:text-muted-foreground"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <span className="flex items-center space-x-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>
                      Images <span className="text-red-500">*</span> (Maximum 5)
                    </span>
                  </span>
                </label>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="w-full h-32 bg-muted rounded-lg border border-border overflow-hidden flex items-center justify-center">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-smooth hover:bg-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {images.length < 5 && (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-smooth">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground mb-1">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, JPEG up to 5MB each
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => navigate("/home")}
                  className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-smooth font-medium text-foreground"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 gradient-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth font-medium disabled:opacity-50 disabled:cursor-not-allowed relative flex items-center space-x-2"
                >
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm rounded-lg">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  )}
                  <PlusCircle className="h-5 w-5" />
                  <span>Post Item</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PostItem;
