const itemService = require("../services/itemService");

// Factory pattern: generates type-specific controllers to avoid code duplication
const createItemController = (itemType) => {
  const typeLabel = itemType === "lost" ? "Lost" : "Found";
  const resolveLabel = itemType === "lost" ? "found" : "returned";

  return {
    async createItem(req, res, next) {
      try {
        const images = req.files ? req.files.map((file) => file.path) : [];
        const itemData = { ...req.body, images };

        const item = await itemService.createItem(
          itemType,
          req.user._id,
          itemData
        );

        res.status(201).json({
          status: "success",
          message: `${typeLabel} item posted successfully`,
          data: item,
        });
      } catch (error) {
        next(error);
      }
    },

    async getAllItems(req, res, next) {
      try {
        const {
          category,
          location,
          status,
          isReturned,
          dateFrom,
          dateTo,
          page = 1,
          limit = 10,
        } = req.query;

        const filters = {
          category,
          location,
          status,
          dateFrom,
          dateTo,
        };

        if (itemType === "found" && isReturned !== undefined) {
          filters.isReturned =
            isReturned === "true"
              ? true
              : isReturned === "false"
              ? false
              : undefined;
        }

        const result = await itemService.getAllItems(
          itemType,
          filters,
          parseInt(page),
          parseInt(limit)
        );

        res.status(200).json({
          status: "success",
          data: result.items,
          pagination: result.pagination,
        });
      } catch (error) {
        next(error);
      }
    },

    async getItemById(req, res, next) {
      try {
        const item = await itemService.getItemById(itemType, req.params.id);

        res.status(200).json({
          status: "success",
          data: item,
        });
      } catch (error) {
        next(error);
      }
    },

    async getMyItems(req, res, next) {
      try {
        const { page = 1, limit = 10 } = req.query;

        const result = await itemService.getUserItems(
          itemType,
          req.user._id,
          parseInt(page),
          parseInt(limit)
        );

        res.status(200).json({
          status: "success",
          data: result.items,
          pagination: result.pagination,
        });
      } catch (error) {
        next(error);
      }
    },

    async updateItem(req, res, next) {
      try {
        const newImages = req.files ? req.files.map((file) => file.path) : [];

        let existingImages = [];
        if (req.body.existingImages) {
          existingImages = Array.isArray(req.body.existingImages)
            ? req.body.existingImages
            : [req.body.existingImages];
        }

        const images = [...existingImages, ...newImages];
        const itemData = { ...req.body, images };

        const item = await itemService.updateItem(
          itemType,
          req.params.id,
          req.user._id,
          itemData
        );

        res.status(200).json({
          status: "success",
          message: `${typeLabel} item updated successfully`,
          data: item,
        });
      } catch (error) {
        next(error);
      }
    },

    async deleteItem(req, res, next) {
      try {
        await itemService.deleteItem(itemType, req.params.id, req.user._id);

        res.status(200).json({
          status: "success",
          message: `${typeLabel} item deleted successfully`,
        });
      } catch (error) {
        next(error);
      }
    },

    async markAsResolved(req, res, next) {
      try {
        const item = await itemService.markAsResolved(
          itemType,
          req.params.id,
          req.user._id
        );

        res.status(200).json({
          status: "success",
          message: `${typeLabel} item marked as ${resolveLabel}`,
          data: item,
        });
      } catch (error) {
        next(error);
      }
    },

    async updateStatus(req, res, next) {
      try {
        const { status } = req.body;
        const validStatuses =
          itemType === "lost" ? ["open", "found"] : ["available", "claimed"];

        if (!status || !validStatuses.includes(status)) {
          return res.status(400).json({
            status: "error",
            message: `Invalid status. Must be one of: ${validStatuses.join(
              ", "
            )}`,
          });
        }

        const item = await itemService.updateStatus(
          itemType,
          req.params.id,
          req.user._id,
          status
        );

        res.status(200).json({
          status: "success",
          message: `${typeLabel} item status updated to ${status}`,
          data: item,
        });
      } catch (error) {
        next(error);
      }
    },

    async searchItems(req, res, next) {
      try {
        const { q, page = 1, limit = 10 } = req.query;

        const result = await itemService.searchItems(
          itemType,
          q,
          parseInt(page),
          parseInt(limit)
        );

        res.status(200).json({
          status: "success",
          data: result.items,
          pagination: result.pagination,
        });
      } catch (error) {
        next(error);
      }
    },
  };
};

const lostItemController = createItemController("lost");
const foundItemController = createItemController("found");

module.exports = {
  createItemController,
  lostItemController,
  foundItemController,
};
