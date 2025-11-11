const foundItemService = require("../services/foundItemService");

class FoundItemController {
  /**
   * Create a new found item post
   * POST /api/v1/found-items
   */
  async createFoundItem(req, res, next) {
    try {
      // Extract Cloudinary image URLs from uploaded files
      const images = req.files ? req.files.map((file) => file.path) : [];

      // Add images to request body
      const itemData = {
        ...req.body,
        images,
      };

      const item = await foundItemService.createFoundItem(
        req.user._id,
        itemData
      );

      res.status(201).json({
        status: "success",
        message: "Found item posted successfully",
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all found items with filters
   * GET /api/v1/found-items
   */
  async getAllFoundItems(req, res, next) {
    try {
      const {
        category,
        location,
        isReturned,
        dateFrom,
        dateTo,
        page = 1,
        limit = 10,
      } = req.query;

      const filters = {
        category,
        location,
        isReturned:
          isReturned === "true"
            ? true
            : isReturned === "false"
            ? false
            : undefined,
        dateFrom,
        dateTo,
      };

      const result = await foundItemService.getAllFoundItems(
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
  }

  /**
   * Get found item by ID
   * GET /api/v1/found-items/:id
   */
  async getFoundItemById(req, res, next) {
    try {
      const item = await foundItemService.getFoundItemById(req.params.id);

      res.status(200).json({
        status: "success",
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user's found items
   * GET /api/v1/found-items/my-items
   */
  async getMyFoundItems(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await foundItemService.getUserFoundItems(
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
  }

  /**
   * Update a found item
   * PUT /api/v1/found-items/:id
   */
  async updateFoundItem(req, res, next) {
    try {
      // Extract new images from uploaded files (if any)
      const newImages = req.files ? req.files.map((file) => file.path) : [];

      // Get existing images to keep (if provided)
      let existingImages = [];
      if (req.body.existingImages) {
        existingImages = Array.isArray(req.body.existingImages)
          ? req.body.existingImages
          : [req.body.existingImages];
      }

      // Combine existing and new images
      const images = [...existingImages, ...newImages];

      const itemData = {
        ...req.body,
        images,
      };

      const item = await foundItemService.updateFoundItem(
        req.params.id,
        req.user._id,
        itemData
      );

      res.status(200).json({
        status: "success",
        message: "Found item updated successfully",
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a found item
   * DELETE /api/v1/found-items/:id
   */
  async deleteFoundItem(req, res, next) {
    try {
      await foundItemService.deleteFoundItem(req.params.id, req.user._id);

      res.status(200).json({
        status: "success",
        message: "Found item deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark found item as returned
   * PATCH /api/v1/found-items/:id/return
   */
  async markAsReturned(req, res, next) {
    try {
      const item = await foundItemService.markAsReturned(
        req.params.id,
        req.user._id
      );

      res.status(200).json({
        status: "success",
        message: "Found item marked as returned",
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update found item status
   * PATCH /api/v1/found-items/:id/status
   */
  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;

      if (!status || !["available", "claimed"].includes(status)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid status. Must be 'available' or 'claimed'",
        });
      }

      const item = await foundItemService.updateStatus(
        req.params.id,
        req.user._id,
        status
      );

      res.status(200).json({
        status: "success",
        message: `Found item status updated to ${status}`,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search found items
   * GET /api/v1/found-items/search
   */
  async searchFoundItems(req, res, next) {
    try {
      const { q, page = 1, limit = 10 } = req.query;

      const result = await foundItemService.searchFoundItems(
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
  }
}

module.exports = new FoundItemController();
