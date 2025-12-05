const User = require("../models/User");

class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findByUid(uid) {
    return await User.findOne({ uid });
  }

  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async updateByUid(uid, updateData) {
    return await User.findOneAndUpdate(
      { uid },
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
  }

  async deleteByUid(uid) {
    return await User.findOneAndDelete({ uid });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = new UserRepository();
