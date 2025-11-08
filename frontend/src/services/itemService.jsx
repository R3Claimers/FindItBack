import axios from "axios";
import { auth } from "../config/firebase.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Get auth token from Firebase
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

// Create axios instance with auth header
const createAuthHeaders = async () => {
  const token = await getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };
};

const createAuthHeadersJson = async () => {
  const token = await getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

class ItemService {
  // ==================== Lost Items ====================

  // Create a lost item
  async createLostItem(itemData) {
    try {
      const response = await axios.post(
        `${API_URL}/lost-items`,
        itemData,
        await createAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get all lost items with pagination
  async getLostItems(page = 1, limit = 10) {
    try {
      const response = await axios.get(
        `${API_URL}/lost-items?page=${page}&limit=${limit}`,
        await createAuthHeadersJson()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get lost item by ID
  async getLostItemById(id) {
    try {
      const response = await axios.get(
        `${API_URL}/lost-items/${id}`,
        await createAuthHeadersJson()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get user's lost items
  async getMyLostItems() {
    try {
      const response = await axios.get(
        `${API_URL}/lost-items/my-items`,
        await createAuthHeadersJson()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update lost item
  async updateLostItem(id, data) {
    try {
      const response = await axios.put(
        `${API_URL}/lost-items/${id}`,
        data,
        await createAuthHeadersJson()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete lost item
  async deleteLostItem(id) {
    try {
      const response = await axios.delete(
        `${API_URL}/lost-items/${id}`,
        await createAuthHeadersJson()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Mark lost item as resolved
  async resolveLostItem(id) {
    try {
      const response = await axios.patch(
        `${API_URL}/lost-items/${id}/resolve`,
        {},
        await createAuthHeadersJson()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Search lost items
  async searchLostItems(query) {
    try {
      const response = await axios.get(
        `${API_URL}/lost-items/search?q=${encodeURIComponent(query)}`,
        await createAuthHeadersJson()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ==================== Found Items ====================

  // Create a found item
  async createFoundItem(itemData) {
    try {
      const response = await axios.post(
        `${API_URL}/found-items`,
        itemData,
        await createAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get all found items with pagination
  async getFoundItems(page = 1, limit = 10) {
    try {
      const response = await axios.get(
        `${API_URL}/found-items?page=${page}&limit=${limit}`,
        await createAuthHeadersJson()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get found item by ID
  async getFoundItemById(id) {
    try {
      const response = await axios.get(
        `${API_URL}/found-items/${id}`,
        await createAuthHeadersJson()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get user's found items
  async getMyFoundItems() {
    try {
      const response = await axios.get(
        `${API_URL}/found-items/my-items`,
        await createAuthHeadersJson()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update found item
  async updateFoundItem(id, data) {
    try {
      const response = await axios.put(
        `${API_URL}/found-items/${id}`,
        data,
        await createAuthHeadersJson()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete found item
  async deleteFoundItem(id) {
    try {
      const response = await axios.delete(
        `${API_URL}/found-items/${id}`,
        await createAuthHeadersJson()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Mark found item as resolved
  async resolveFoundItem(id) {
    try {
      const response = await axios.patch(
        `${API_URL}/found-items/${id}/resolve`,
        {},
        await createAuthHeadersJson()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Search found items
  async searchFoundItems(query) {
    try {
      const response = await axios.get(
        `${API_URL}/found-items/search?q=${encodeURIComponent(query)}`,
        await createAuthHeadersJson()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const itemService = new ItemService();
