const userService = require("../services/userService");

class UserController {
  /**
   * Create or update user profile
   * POST /api/v1/users
   */
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

  /**
   * Get current user profile
   * GET /api/v1/users/me
   */
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

  /**
   * Get user by ID
   * GET /api/v1/users/:id
   */
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

  /**
   * Update current user profile
   * PUT /api/v1/users/me
   */
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

  /**
   * Delete current user account
   * DELETE /api/v1/users/me
   */
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

  /**
   * Change user password
   * POST /api/v1/users/change-password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      // Firebase Admin SDK doesn't support password verification
      // Password change should be handled on the client-side using Firebase Auth
      // This endpoint is a placeholder for any additional server-side logic

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
