const express = require("express");
const router = express.Router();
const lostItemController = require("../controllers/lostItemController");
const authenticateUser = require("../middlewares/auth");
const {
  lostItemValidation,
  validateId,
  validatePagination,
} = require("../middlewares/validation");
const { uploadMultiple, handleUploadError } = require("../config/cloudinary");

// All routes require authentication
router.use(authenticateUser);

// Search must come before :id route
router.get("/search", validatePagination, lostItemController.searchLostItems);

// My items route
router.get("/my-items", validatePagination, lostItemController.getMyLostItems);

// CRUD operations
router.post(
  "/",
  handleUploadError(uploadMultiple),
  lostItemValidation.create,
  lostItemController.createLostItem
);
router.get("/", validatePagination, lostItemController.getAllLostItems);
router.get("/:id", validateId, lostItemController.getLostItemById);
router.put(
  "/:id",
  handleUploadError(uploadMultiple),
  validateId,
  lostItemValidation.update,
  lostItemController.updateLostItem
);
router.delete("/:id", validateId, lostItemController.deleteLostItem);

// Mark as resolved
router.patch("/:id/resolve", validateId, lostItemController.markAsResolved);

module.exports = router;
