import api from "./api.jsx";

export const lostItemService = {
  // Create lost item
  createLostItem: async (itemData) => {
    const response = await api.post("/lost-items", itemData);
    return response.data;
  },

  // Get all lost items
  getAllLostItems: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/lost-items?${params}`);
    return response.data;
  },

  // Get lost item by ID
  getLostItemById: async (id) => {
    const response = await api.get(`/lost-items/${id}`);
    return response.data;
  },

  // Get user's lost items
  getMyLostItems: async (page = 1, limit = 10) => {
    const response = await api.get(
      `/lost-items/my-items?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Update lost item
  updateLostItem: async (id, itemData) => {
    const response = await api.put(`/lost-items/${id}`, itemData);
    return response.data;
  },

  // Delete lost item
  deleteLostItem: async (id) => {
    const response = await api.delete(`/lost-items/${id}`);
    return response.data;
  },

  // Mark as resolved
  markAsResolved: async (id) => {
    const response = await api.patch(`/lost-items/${id}/resolve`);
    return response.data;
  },

  // Search lost items
  searchLostItems: async (query, page = 1, limit = 10) => {
    const response = await api.get(
      `/lost-items/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );
    return response.data;
  },
};
