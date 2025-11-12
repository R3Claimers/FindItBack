const lostItemRepository = require("../repositories/lostItemRepository");

class LostItemService {
  /**
   * Create a new lost item post
   */
  async createLostItem(userId, itemData) {
    try {
      const item = await lostItemRepository.create({
        ...itemData,
        userId,
      });

      // Populate user data
      return await lostItemRepository.findById(item._id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get lost item by ID
   */
  async getLostItemById(id) {
    try {
      const item = await lostItemRepository.findById(id);

      if (!item) {
        throw new Error("Lost item not found");
      }

      return item;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all lost items with filters and pagination
   */
  async getAllLostItems(filters, page, limit) {
    try {
      return await lostItemRepository.findAll(filters, page, limit);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get lost items posted by a specific user
   */
  async getUserLostItems(userId, page, limit) {
    try {
      return await lostItemRepository.findByUserId(userId, page, limit);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a lost item
   */
  async updateLostItem(id, userId, updateData) {
    try {
      const item = await lostItemRepository.update(id, userId, updateData);

      if (!item) {
        throw new Error(
          "Lost item not found or you are not authorized to update it"
        );
      }

      return item;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a lost item
   */
  async deleteLostItem(id, userId) {
    try {
      const item = await lostItemRepository.delete(id, userId);

      if (!item) {
        throw new Error(
          "Lost item not found or you are not authorized to delete it"
        );
      }

      return { message: "Lost item deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark lost item as resolved
   */
  async markAsResolved(id, userId) {
    try {
      const item = await lostItemRepository.update(id, userId, {
        status: "found",
      });

      if (!item) {
        throw new Error(
          "Lost item not found or you are not authorized to update it"
        );
      }

      return item;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update lost item status
   */
  async updateStatus(id, userId, status) {
    try {
      const item = await lostItemRepository.update(id, userId, {
        status,
      });

      if (!item) {
        throw new Error(
          "Lost item not found or you are not authorized to update it"
        );
      }

      return item;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search lost items
   */
  async searchLostItems(searchTerm, page, limit) {
    try {
      if (!searchTerm || searchTerm.trim() === "") {
        throw new Error("Search term is required");
      }

      return await lostItemRepository.search(searchTerm, page, limit);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get recent lost items
   */
  async getRecentLostItems(limit = 10) {
    try {
      return await lostItemRepository.findAll({ status: "open" }, 1, limit);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new LostItemService();
