const itemRepository = require("../repositories/itemRepository");

class ItemService {
  _getDateField(itemType) {
    return itemType === "lost" ? "dateLost" : "dateFound";
  }

  async createItem(itemType, userId, itemData) {
    const dateField = this._getDateField(itemType);

    const data = {
      ...itemData,
      userId,
      [dateField]: itemData.dateLost || itemData.dateFound || itemData.date,
    };

    const item = await itemRepository.create(itemType, data);
    return await itemRepository.findById(itemType, item._id);
  }

  async getItemById(itemType, id) {
    const item = await itemRepository.findById(itemType, id);

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  }

  async getAllItems(itemType, filters, page, limit) {
    return await itemRepository.findAll(itemType, filters, page, limit);
  }

  async getUserItems(itemType, userId, page, limit) {
    return await itemRepository.findByUserId(itemType, userId, page, limit);
  }

  async updateItem(itemType, id, userId, updateData) {
    const dateField = this._getDateField(itemType);

    if (updateData.dateLost || updateData.dateFound || updateData.date) {
      updateData[dateField] =
        updateData.dateLost || updateData.dateFound || updateData.date;
    }

    const item = await itemRepository.update(itemType, id, userId, updateData);

    if (!item) {
      throw new Error("Item not found or you are not authorized to update it");
    }

    return item;
  }

  async deleteItem(itemType, id, userId) {
    const item = await itemRepository.delete(itemType, id, userId);

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

    const item = await itemRepository.update(itemType, id, userId, updateData);

    if (!item) {
      throw new Error("Item not found or you are not authorized to update it");
    }

    return item;
  }

  async updateStatus(itemType, id, userId, status) {
    const item = await itemRepository.update(itemType, id, userId, { status });

    if (!item) {
      throw new Error("Item not found or you are not authorized to update it");
    }

    return item;
  }

  async searchItems(itemType, searchTerm, page, limit) {
    if (!searchTerm || searchTerm.trim() === "") {
      throw new Error("Search term is required");
    }

    return await itemRepository.search(
      itemType,
      searchTerm.trim(),
      page,
      limit
    );
  }

  async getActiveItems(itemType) {
    return await itemRepository.findActiveItems(itemType);
  }
}

module.exports = new ItemService();
