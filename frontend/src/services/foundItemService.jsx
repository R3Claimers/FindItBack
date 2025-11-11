import api from "./api.jsx";

export const foundItemService = {
  // Create found item
  createFoundItem: async (itemData) => {
    const response = await api.post("/found-items", itemData);
    return response.data;
  },

  // Get all found items
  getAllFoundItems: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/found-items?${params}`);
    return response.data;
  },

  // Get found item by ID
  getFoundItemById: async (id) => {
    const response = await api.get(`/found-items/${id}`);
    return response.data;
  },

  // Get user's found items
  getMyFoundItems: async (page = 1, limit = 10) => {
    const response = await api.get(
      `/found-items/my-items?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Update found item
  updateFoundItem: async (id, itemData) => {
    const response = await api.put(`/found-items/${id}`, itemData);
    return response.data;
  },

  // Delete found item
  deleteFoundItem: async (id) => {
    const response = await api.delete(`/found-items/${id}`);
    return response.data;
  },

  // Mark as returned
  markAsReturned: async (id) => {
    const response = await api.patch(`/found-items/${id}/return`);
    return response.data;
  },

  // Search found items
  searchFoundItems: async (query, page = 1, limit = 10) => {
    const response = await api.get(
      `/found-items/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );
    return response.data;
  },
};
