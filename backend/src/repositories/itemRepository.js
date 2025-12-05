const { LostItem, FoundItem } = require("../models/Item");

class ItemRepository {
  _getModel(itemType) {
    return itemType === "lost" ? LostItem : FoundItem;
  }

  _getDateField(itemType) {
    return itemType === "lost" ? "dateLost" : "dateFound";
  }

  _getActiveStatus(itemType) {
    return itemType === "lost" ? "open" : "available";
  }

  async create(itemType, itemData) {
    const Model = this._getModel(itemType);
    const item = new Model(itemData);
    return await item.save();
  }

  async findById(itemType, id) {
    const Model = this._getModel(itemType);
    return await Model.findById(id).populate(
      "userId",
      "name email phone profilePic"
    );
  }

  async findAll(itemType, filters = {}, page = 1, limit = 10) {
    const Model = this._getModel(itemType);
    const query = this._buildQuery(itemType, filters);
    const skip = (page - 1) * limit;

    const items = await Model.find(query)
      .populate("userId", "name email phone profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Model.countDocuments(query);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findByUserId(itemType, userId, page = 1, limit = 10) {
    const Model = this._getModel(itemType);
    const skip = (page - 1) * limit;
    const query = { userId };

    const items = await Model.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Model.countDocuments(query);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async update(itemType, id, userId, updateData) {
    const Model = this._getModel(itemType);
    return await Model.findOneAndUpdate(
      { _id: id, userId },
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate("userId", "name email phone profilePic");
  }

  async delete(itemType, id, userId) {
    const Model = this._getModel(itemType);
    return await Model.findOneAndDelete({ _id: id, userId });
  }

  async search(itemType, searchTerm, page = 1, limit = 10) {
    const Model = this._getModel(itemType);
    const activeStatus = this._getActiveStatus(itemType);
    const skip = (page - 1) * limit;

    const items = await Model.find(
      { $text: { $search: searchTerm }, status: activeStatus },
      { score: { $meta: "textScore" } }
    )
      .populate("userId", "name email phone profilePic")
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limit);

    const total = await Model.countDocuments({
      $text: { $search: searchTerm },
      status: activeStatus,
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findActiveItems(itemType) {
    const Model = this._getModel(itemType);
    const activeStatus = this._getActiveStatus(itemType);
    return await Model.find({ status: activeStatus }).populate(
      "userId",
      "name email phone profilePic"
    );
  }

  _buildQuery(itemType, filters) {
    const query = {};
    const dateField = this._getDateField(itemType);
    const activeStatus = this._getActiveStatus(itemType);

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.location) {
      query.location = new RegExp(filters.location, "i");
    }

    if (filters.status) {
      query.status = filters.status;
    } else {
      query.status = activeStatus;
    }

    if (filters.dateFrom || filters.dateTo) {
      query[dateField] = {};
      if (filters.dateFrom) {
        query[dateField].$gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        query[dateField].$lte = new Date(filters.dateTo);
      }
    }

    return query;
  }
}

module.exports = new ItemRepository();
