const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads/items");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-userId-originalname
    const uniqueSuffix = `${Date.now()}-${req.user?._id || "unknown"}`;
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${uniqueSuffix}-${nameWithoutExt}${ext}`);
  },
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, JPG, PNG, GIF, and WEBP are allowed."
      ),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
});

// Middleware for single image upload
const uploadSingle = upload.single("image");

// Middleware for multiple images upload (max 5)
const uploadMultiple = upload.array("images", 5);

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: "error",
        message: "File size too large. Maximum size is 5MB per file.",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        status: "error",
        message: "Too many files. Maximum 5 images allowed.",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        status: "error",
        message: "Unexpected field in upload.",
      });
    }
  }

  if (err) {
    return res.status(400).json({
      status: "error",
      message: err.message || "Error uploading file.",
    });
  }

  next();
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  handleUploadError,
};
