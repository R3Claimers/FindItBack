import api from "./api.jsx";

export const authService = {
  // Create or update user profile
  createOrUpdateProfile: async (userData) => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  // Update current user profile
  updateProfile: async (userData) => {
    const response = await api.put("/users/me", userData);
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await api.delete("/users/me");
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post("/users/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
