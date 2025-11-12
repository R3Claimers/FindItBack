import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lostItemService } from "../services/lostItemService.jsx";
import { foundItemService } from "../services/foundItemService.jsx";
import { Upload, X, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const EditPost = () => {
  const { type, id } = useParams(); // type: 'lost' or 'found'
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    contactInfo: "",
    images: [], // Existing image URLs
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Categories must match backend enum exactly
  const categories = [
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

  useEffect(() => {
    fetchPostDetails();
  }, [id, type]);

  // If a successful edit just happened, prevent navigating back to this form
  useEffect(() => {
    const key = `edited:${type}:${id}`;
    if (sessionStorage.getItem(key)) {
      // Redirect to detail page and replace history so back won't return here
      navigate(`/${type === "lost" ? "lost" : "found"}/${id}`, {
        replace: true,
      });
    }
  }, [id, type, navigate]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const service = type === "lost" ? lostItemService : foundItemService;
      const response = await service[
        type === "lost" ? "getLostItemById" : "getFoundItemById"
      ](id);

      const item = response.data;
      setFormData({
        title: item.title || "",
        description: item.description || "",
        category: item.category || "",
        location: item.location || "",
        // Use correct date field from backend
        date:
          type === "lost"
            ? item.dateLost
              ? new Date(item.dateLost).toISOString().split("T")[0]
              : ""
            : item.dateFound
            ? new Date(item.dateFound).toISOString().split("T")[0]
            : "",
        contactInfo: item.contactInfo || "",
        images: item.images || [],
      });
      setExistingImages(item.images || []);
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load post details");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;

    if (totalImages > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    // Validate file sizes
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("Each image must be less than 5MB");
      return;
    }

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
    setNewImages([...newImages, ...files]);
  };

  const removeExistingImage = (index) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
  };

  const removeNewImage = (index) => {
    const updatedImages = newImages.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setNewImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only require images for Found items
    if (type === "found" && existingImages.length + newImages.length === 0) {
      toast.error("Please add at least one image for found items");
      return;
    }

    try {
      setSubmitting(true);

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("location", formData.location);
      // Map correct date field name expected by backend
      if (type === "lost") {
        submitData.append("dateLost", formData.date);
      } else {
        submitData.append("dateFound", formData.date);
      }
      submitData.append("contactInfo", formData.contactInfo);

      // Add existing images that weren't removed
      existingImages.forEach((img) => {
        // Append with the exact field name backend expects; repeating same key is fine
        submitData.append("existingImages", img);
      });

      // Add new images
      newImages.forEach((file) => {
        submitData.append("images", file);
      });

      const service = type === "lost" ? lostItemService : foundItemService;
      await service[type === "lost" ? "updateLostItem" : "updateFoundItem"](
        id,
        submitData
      );

      toast.success("Post updated successfully!");
      // Mark this post as edited to guard against back navigation showing stale form
      try {
        sessionStorage.setItem(`edited:${type}:${id}`, "1");
      } catch {}
      // Replace history so Back doesn't return to edit form
      navigate(`/${type === "lost" ? "lost" : "found"}/${id}`, {
        replace: true,
      });
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error(error.response?.data?.message || "Failed to update post");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-smooth"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="card">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Edit {type === "lost" ? "Lost" : "Found"} Item
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="e.g., Black Leather Wallet"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Provide detailed description..."
                required
              />
            </div>

            {/* Category & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="e.g., Main Library"
                  required
                />
              </div>
            </div>

            {/* Date & Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Contact Info
                </label>
                <input
                  type="text"
                  value={formData.contactInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, contactInfo: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="Phone or email (optional)"
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Images (Max 5){" "}
                {type === "found" ? (
                  "*"
                ) : (
                  <span className="text-xs text-muted-foreground">
                    (Optional)
                  </span>
                )}
              </label>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Current Images ({existingImages.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {existingImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-smooth"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    New Images ({newImages.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-smooth"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {existingImages.length + newImages.length < 5 && (
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-muted text-foreground border-2 border-dashed border-input rounded-lg cursor-pointer hover:bg-muted/80 transition-smooth">
                  <Upload className="h-5 w-5" />
                  <span>
                    {existingImages.length + newImages.length === 0
                      ? "Upload Images"
                      : "Add More Images"}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50 flex-1"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Post"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
