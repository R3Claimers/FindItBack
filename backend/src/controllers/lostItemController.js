const lostItemService = require("../services/lostItemService");

class LostItemController {
  /**
   * Create a new lost item post
   * POST /api/v1/lost-items
   */
  async createLostItem(req, res, next) {
    try {
      // Extract Cloudinary image URLs from uploaded files
      const images = req.files ? req.files.map((file) => file.path) : [];

      // Add images to request body
      const itemData = {
        ...req.body,
        images,
      };

      const item = await lostItemService.createLostItem(req.user._id, itemData);

      res.status(201).json({
        status: "success",
        message: "Lost item posted successfully",
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all lost items with filters
   * GET /api/v1/lost-items
   */
  async getAllLostItems(req, res, next) {
    try {
      const {
        category,
        location,
        status,
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

      const result = await lostItemService.getAllLostItems(
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
   * Get lost item by ID
   * GET /api/v1/lost-items/:id
   */
  async getLostItemById(req, res, next) {
    try {
      const item = await lostItemService.getLostItemById(req.params.id);

      res.status(200).json({
        status: "success",
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user's lost items
   * GET /api/v1/lost-items/my-items
   */
  async getMyLostItems(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await lostItemService.getUserLostItems(
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
   * Update a lost item
   * PUT /api/v1/lost-items/:id
   */
  async updateLostItem(req, res, next) {
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

      const item = await lostItemService.updateLostItem(
        req.params.id,
        req.user._id,
        itemData
      );

      res.status(200).json({
        status: "success",
        message: "Lost item updated successfully",
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a lost item
   * DELETE /api/v1/lost-items/:id
   */
  async deleteLostItem(req, res, next) {
    try {
      await lostItemService.deleteLostItem(req.params.id, req.user._id);

      res.status(200).json({
        status: "success",
        message: "Lost item deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark lost item as resolved
   * PATCH /api/v1/lost-items/:id/resolve
   */
  async markAsResolved(req, res, next) {
    try {
      const item = await lostItemService.markAsResolved(
        req.params.id,
        req.user._id
      );

      res.status(200).json({
        status: "success",
        message: "Lost item marked as resolved",
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update lost item status
   * PATCH /api/v1/lost-items/:id/status
   */
  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;

      if (!status || !["open", "resolved"].includes(status)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid status. Must be 'open' or 'resolved'",
        });
      }

      const item = await lostItemService.updateStatus(
        req.params.id,
        req.user._id,
        status
      );

      res.status(200).json({
        status: "success",
        message: `Lost item status updated to ${status}`,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search lost items
   * GET /api/v1/lost-items/search
   */
  async searchLostItems(req, res, next) {
    try {
      const { q, page = 1, limit = 10 } = req.query;

      const result = await lostItemService.searchLostItems(
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

module.exports = new LostItemController();
