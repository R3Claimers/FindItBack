const foundItemRepository = require("../repositories/foundItemRepository");

class FoundItemService {
  /**
   * Create a new found item post
   */
  async createFoundItem(userId, itemData) {
    try {
      const item = await foundItemRepository.create({
        ...itemData,
        userId,
      });

      // Populate user data
      return await foundItemRepository.findById(item._id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get found item by ID
   */
  async getFoundItemById(id) {
    try {
      const item = await foundItemRepository.findById(id);

      if (!item) {
        throw new Error("Found item not found");
      }

      return item;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all found items with filters and pagination
   */
  async getAllFoundItems(filters, page, limit) {
    try {
      return await foundItemRepository.findAll(filters, page, limit);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get found items posted by a specific user
   */
  async getUserFoundItems(userId, page, limit) {
    try {
      return await foundItemRepository.findByUserId(userId, page, limit);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a found item
   */
  async updateFoundItem(id, userId, updateData) {
    try {
      const item = await foundItemRepository.update(id, userId, updateData);

      if (!item) {
        throw new Error(
          "Found item not found or you are not authorized to update it"
        );
      }

      return item;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a found item
   */
  async deleteFoundItem(id, userId) {
    try {
      const item = await foundItemRepository.delete(id, userId);

      if (!item) {
        throw new Error(
          "Found item not found or you are not authorized to delete it"
        );
      }

      return { message: "Found item deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark found item as returned
   */
  async markAsReturned(id, userId) {
    try {
      const item = await foundItemRepository.update(id, userId, {
        isReturned: true,
        status: "claimed",
      });

      if (!item) {
        throw new Error(
          "Found item not found or you are not authorized to update it"
        );
      }

      return item;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update found item status
   */
  async updateStatus(id, userId, status) {
    try {
      const item = await foundItemRepository.update(id, userId, {
        status,
        isReturned: status === "claimed",
      });

      if (!item) {
        throw new Error(
          "Found item not found or you are not authorized to update it"
        );
      }

      return item;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search found items
   */
  async searchFoundItems(searchTerm, page, limit) {
    try {
      if (!searchTerm || searchTerm.trim() === "") {
        throw new Error("Search term is required");
      }

      return await foundItemRepository.search(searchTerm, page, limit);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get recent found items
   */
  async getRecentFoundItems(limit = 10) {
    try {
      return await foundItemRepository.findAll({ isReturned: false }, 1, limit);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FoundItemService();
