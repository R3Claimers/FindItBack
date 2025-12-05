const userService = require("../services/userService");

class UserController {
  async createOrUpdateUser(req, res, next) {
    try {
      const { uid, name, email, phone, profilePic, bio } = req.body;

      const result = await userService.createOrUpdateUser({
        uid,
        name,
        email,
        phone,
        profilePic,
        bio,
      });

      res.status(result.isNew ? 201 : 200).json({
        status: "success",
        message: result.isNew
          ? "User created successfully"
          : "User updated successfully",
        data: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const user = await userService.getUserByUid(req.uid);

      res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);

      res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCurrentUser(req, res, next) {
    try {
      const { name, phone, profilePic, bio } = req.body;

      const user = await userService.updateUser(req.uid, {
        name,
        phone,
        profilePic,
        bio,
      });

      res.status(200).json({
        status: "success",
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCurrentUser(req, res, next) {
    try {
      await userService.deleteUser(req.uid);

      res.status(200).json({
        status: "success",
        message: "Account deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Password changes are handled client-side via Firebase Auth SDK
  async changePassword(req, res, next) {
    try {
      res.status(200).json({
        status: "success",
        message:
          "Password changed successfully. Please use Firebase client SDK for password updates.",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
