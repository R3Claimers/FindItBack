import axios from "axios";
import { auth } from "../config/firebase.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If sending FormData, let the browser set the Content-Type with boundary
    if (config.data instanceof FormData) {
      if (config.headers && config.headers["Content-Type"]) {
        delete config.headers["Content-Type"];
      }
    } else {
      // Default to JSON for plain objects
      config.headers = {
        ...(config.headers || {}),
        "Content-Type": config.headers?.["Content-Type"] || "application/json",
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
// Simple retry/backoff for 429 Too Many Requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config || {};
    const status = error.response?.status;

    // Attach status to error for callers
    const message = error.response?.data?.message || "An error occurred";
    const enrichedError = Object.assign(new Error(message), { status });

    if (status === 429 && !config.__isRetryRequest) {
      config.__isRetryRequest = true;
      // Basic backoff: wait 800ms then retry once
      await new Promise((res) => setTimeout(res, 800));
      try {
        return await api(config);
      } catch (e) {
        return Promise.reject(enrichedError);
      }
    }

    if (error.request && !error.response) {
      return Promise.reject(
        Object.assign(
          new Error("No response from server. Please check your connection."),
          { status: 0 }
        )
      );
    }

    return Promise.reject(enrichedError);
  }
);

export default api;
