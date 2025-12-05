const express = require("express");
const authenticateUser = require("../middlewares/auth");
const { validateId, validatePagination } = require("../middlewares/validation");
const { uploadMultiple, handleUploadError } = require("../config/cloudinary");
const { itemValidation } = require("../middlewares/validation");

// Factory pattern: generates type-specific routes while maintaining separate API endpoints
const createItemRoutes = (itemType) => {
  const router = express.Router();
  const {
    lostItemController,
    foundItemController,
  } = require("../controllers/itemController");

  const controller =
    itemType === "lost" ? lostItemController : foundItemController;
  const validationRules = itemValidation[itemType];

  router.use(authenticateUser);

  router.get("/search", validatePagination, controller.searchItems);
  router.get("/my-items", validatePagination, controller.getMyItems);

  router.post(
    "/",
    handleUploadError(uploadMultiple),
    validationRules.create,
    controller.createItem
  );

  router.get("/", validatePagination, controller.getAllItems);
  router.get("/:id", validateId, controller.getItemById);

  router.put(
    "/:id",
    handleUploadError(uploadMultiple),
    validateId,
    validationRules.update,
    controller.updateItem
  );

  router.delete("/:id", validateId, controller.deleteItem);

  if (itemType === "lost") {
    router.patch("/:id/resolve", validateId, controller.markAsResolved);
  } else {
    router.patch("/:id/return", validateId, controller.markAsResolved);
  }

  router.patch("/:id/status", validateId, controller.updateStatus);

  return router;
};

module.exports = { createItemRoutes };
