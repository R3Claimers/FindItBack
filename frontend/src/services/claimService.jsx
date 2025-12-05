import api from "./api";

const claimService = {
  createClaim: async (itemId, message) => {
    const response = await api.post("/claims", { itemId, message });
    return response.data;
  },

  getUserClaims: async () => {
    const response = await api.get("/claims/my-claims");
    return response.data;
  },

  getClaimStatus: async (itemId) => {
    const response = await api.get(`/claims/status/${itemId}`);
    return response.data;
  },

  getItemClaims: async (itemId) => {
    const response = await api.get(`/claims/item/${itemId}`);
    return response.data;
  },

  approveClaim: async (claimId, responseMessage = "") => {
    const response = await api.put(`/claims/${claimId}/approve`, {
      responseMessage,
    });
    return response.data;
  },

  rejectClaim: async (claimId, responseMessage = "") => {
    const response = await api.put(`/claims/${claimId}/reject`, {
      responseMessage,
    });
    return response.data;
  },

  withdrawClaim: async (claimId) => {
    const response = await api.delete(`/claims/${claimId}`);
    return response.data;
  },
};

export default claimService;
