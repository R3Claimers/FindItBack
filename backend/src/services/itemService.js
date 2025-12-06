const lostItemRepository = require("../repositories/lostItemRepository");
const foundItemRepository = require("../repositories/foundItemRepository");

class ItemService {
  _getDateField(itemType) {
    return itemType === "lost" ? "dateLost" : "dateFound";
  }

  _getRepo(itemType) {
    return itemType === "lost" ? lostItemRepository : foundItemRepository;
  }

  async createItem(itemType, userId, itemData) {
    const dateField = this._getDateField(itemType);

    const data = {
      ...itemData,
      userId,
      [dateField]: itemData.dateLost || itemData.dateFound || itemData.date,
    };

    const repo = this._getRepo(itemType);
    const item = await repo.create(data);
    return await repo.findById(item._id);
  }

  async getItemById(itemType, id) {
    const repo = this._getRepo(itemType);
    const item = await repo.findById(id);

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  }

  async getAllItems(itemType, filters, page, limit) {
    const repo = this._getRepo(itemType);
    return await repo.findAll(filters, page, limit);
  }

  async getUserItems(itemType, userId, page, limit) {
    const repo = this._getRepo(itemType);
    return await repo.findByUserId(userId, page, limit);
  }

  async updateItem(itemType, id, userId, updateData) {
    const dateField = this._getDateField(itemType);

    if (updateData.dateLost || updateData.dateFound || updateData.date) {
      updateData[dateField] =
        updateData.dateLost || updateData.dateFound || updateData.date;
    }

    const repo = this._getRepo(itemType);
    const item = await repo.update(id, userId, updateData);

    if (!item) {
      throw new Error("Item not found or you are not authorized to update it");
    }

    return item;
  }

  async deleteItem(itemType, id, userId) {
    const repo = this._getRepo(itemType);
    const item = await repo.delete(id, userId);

    if (!item) {
      throw new Error("Item not found or you are not authorized to delete it");
    }

    return { message: "Item deleted successfully" };
  }

  async markAsResolved(itemType, id, userId) {
    const resolvedStatus = itemType === "lost" ? "found" : "claimed";
    const updateData = { status: resolvedStatus };

    if (itemType === "found") {
      updateData.isReturned = true;
    }

    const repo = this._getRepo(itemType);
    const item = await repo.update(id, userId, updateData);

    if (!item) {
      throw new Error("Item not found or you are not authorized to update it");
    }

    return item;
  }

  async updateStatus(itemType, id, userId, status) {
    const repo = this._getRepo(itemType);
    const item = await repo.update(id, userId, { status });

    if (!item) {
      throw new Error("Item not found or you are not authorized to update it");
    }

    return item;
  }

  async searchItems(itemType, searchTerm, page, limit) {
    if (!searchTerm || searchTerm.trim() === "") {
      throw new Error("Search term is required");
    }

    const repo = this._getRepo(itemType);
    return await repo.search(searchTerm.trim(), page, limit);
  }

  async getActiveItems(itemType) {
    const repo = this._getRepo(itemType);
    return await repo.findActiveItems();
  }
}

module.exports = new ItemService();
