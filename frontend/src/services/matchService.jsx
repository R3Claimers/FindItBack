import api from "./api.jsx";

export const matchService = {
  // Get matches for a lost item
  getMatchesForLostItem: async (id, minScore = 40) => {
    const response = await api.get(`/matches/lost/${id}?minScore=${minScore}`);
    return response.data;
  },

  // Get matches for a found item
  getMatchesForFoundItem: async (id, minScore = 40) => {
    const response = await api.get(`/matches/found/${id}?minScore=${minScore}`);
    return response.data;
  },

  // Get all matches
  getAllMatches: async (minScore = 40, limit = 50) => {
    const response = await api.get(
      `/matches?minScore=${minScore}&limit=${limit}`
    );
    return response.data;
  },

  // Get matches for user's lost items
  getMyLostItemMatches: async (minScore = 40) => {
    const response = await api.get(
      `/matches/my-lost-items?minScore=${minScore}`
    );
    return response.data;
  },

  // Get matches for user's found items
  getMyFoundItemMatches: async (minScore = 40) => {
    const response = await api.get(
      `/matches/my-found-items?minScore=${minScore}`
    );
    return response.data;
  },
};
