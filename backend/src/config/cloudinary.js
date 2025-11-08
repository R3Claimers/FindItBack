const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "finditback/items",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      return `${timestamp}-${randomId}`;
    },
  },
});

// Configure multer with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5, // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Upload middleware
const uploadSingle = upload.single("image");
const uploadMultiple = upload.array("images", 5);

// Error handling wrapper
const handleUploadError = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File size exceeds 5MB limit",
          });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
            success: false,
            message: "Maximum 5 images allowed",
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  };
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

// Delete multiple images from Cloudinary
const deleteMultipleImages = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error("Error deleting multiple images from Cloudinary:", error);
    throw error;
  }
};

// Extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];
    const publicIdWithExt = lastPart.split(".")[0];
    const folderIndex = parts.indexOf("finditback");
    if (folderIndex !== -1) {
      const pathParts = parts.slice(folderIndex, parts.length - 1);
      pathParts.push(publicIdWithExt);
      return pathParts.join("/");
    }
    return publicIdWithExt;
  } catch (error) {
    console.error("Error extracting public_id from URL:", error);
    return null;
  }
};

module.exports = {
  cloudinary,
  uploadSingle,
  uploadMultiple,
  handleUploadError,
  deleteImage,
  deleteMultipleImages,
  getPublicIdFromUrl,
};
