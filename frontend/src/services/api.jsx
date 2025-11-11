import axios from "axios";
import { auth } from "../config/firebase.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || "An error occurred";
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(
        new Error("No response from server. Please check your connection.")
      );
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

export default api;
