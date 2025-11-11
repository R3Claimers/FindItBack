const express = require("express");
const router = express.Router();
const foundItemController = require("../controllers/foundItemController");
const authenticateUser = require("../middlewares/auth");
const {
  foundItemValidation,
  validateId,
  validatePagination,
} = require("../middlewares/validation");
const { uploadMultiple, handleUploadError } = require("../config/cloudinary");

// All routes require authentication
router.use(authenticateUser);

// Search must come before :id route
router.get("/search", validatePagination, foundItemController.searchFoundItems);

// My items route
router.get(
  "/my-items",
  validatePagination,
  foundItemController.getMyFoundItems
);

// CRUD operations
router.post(
  "/",
  handleUploadError(uploadMultiple),
  foundItemValidation.create,
  foundItemController.createFoundItem
);
router.get("/", validatePagination, foundItemController.getAllFoundItems);
router.get("/:id", validateId, foundItemController.getFoundItemById);
router.put(
  "/:id",
  handleUploadError(uploadMultiple),
  validateId,
  foundItemValidation.update,
  foundItemController.updateFoundItem
);
router.delete("/:id", validateId, foundItemController.deleteFoundItem);

// Mark as returned
router.patch("/:id/return", validateId, foundItemController.markAsReturned);

// Update status
router.patch("/:id/status", validateId, foundItemController.updateStatus);

module.exports = router;
