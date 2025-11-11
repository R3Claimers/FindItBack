import api from "./api.jsx";

export const commentService = {
  // Add a comment
  addComment: async (itemId, itemType, content) => {
    const response = await api.post("/comments", {
      itemId,
      itemType,
      content,
    });
    return response.data;
  },

  // Get comments for an item
  getComments: async (itemId) => {
    const response = await api.get(`/comments/${itemId}`);
    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  // Update a comment
  updateComment: async (commentId, content) => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },
};
