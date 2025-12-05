const userRepository = require("../repositories/userRepository");

class UserService {
  async createOrUpdateUser(userData) {
    const existingUser = await userRepository.findByUid(userData.uid);

    if (existingUser) {
      const updatedUser = await userRepository.updateByUid(
        userData.uid,
        userData
      );
      return {
        user: updatedUser,
        isNew: false,
      };
    }

    const existingEmail = await userRepository.findByEmail(userData.email);
    if (existingEmail) {
      const updatedUser = await userRepository.updateByUid(
        existingEmail.uid,
        userData
      );
      return {
        user: updatedUser,
        isNew: false,
      };
    }

    const newUser = await userRepository.create(userData);
    return {
      user: newUser,
      isNew: true,
    };
  }

  async getUserByUid(uid) {
    const user = await userRepository.findByUid(uid);
    if (!user) {
      throw new Error("User not found");
    }
    return user.getPublicProfile();
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user.getPublicProfile();
  }

  async updateUser(uid, updateData) {
    // Prevent updating immutable fields
    delete updateData.uid;
    delete updateData.email;

    const updatedUser = await userRepository.updateByUid(uid, updateData);

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser.getPublicProfile();
  }

  async deleteUser(uid) {
    const deletedUser = await userRepository.deleteByUid(uid);

    if (!deletedUser) {
      throw new Error("User not found");
    }

    return { message: "User deleted successfully" };
  }

  async getAllUsers(page, limit) {
    return await userRepository.findAll(page, limit);
  }
}

module.exports = new UserService();
