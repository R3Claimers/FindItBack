import api from "./api";

const reportService = {
  // Create a report
  createReport: async (itemType, itemId, reportData) => {
    try {
      const response = await api.post("/reports", {
        itemType,
        itemId,
        ...reportData,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get reports by item (for admins)
  getReportsByItem: async (itemType, itemId) => {
    try {
      const response = await api.get(`/reports/${itemType}/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all reports (for admins)
  getAllReports: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/reports?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update report status (for admins)
  updateReportStatus: async (reportId, statusData) => {
    try {
      const response = await api.patch(
        `/reports/${reportId}/status`,
        statusData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete report (for admins)
  deleteReport: async (reportId) => {
    try {
      const response = await api.delete(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default reportService;
