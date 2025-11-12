import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { commentService } from "../services/commentService.jsx";
import ConfirmModal from "./ConfirmModal.jsx";
import {
  MessageCircle,
  Send,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { formatRelativeTime, getInitials } from "../utils/helpers.js";
import toast from "react-hot-toast";

const Comments = ({ itemId, itemType }) => {
  const { currentUser, userProfile } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [itemId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentService.getComments(itemId);
      setComments(response.data || []);

      // Debug logging
      console.log("Current User UID:", currentUser?.uid);
      if (response.data && response.data.length > 0) {
        console.log(
          "Sample Comment User ID:",
          response.data[0].userId?._id || response.data[0].userId
        );
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      setSubmitting(true);
      const response = await commentService.addComment(
        itemId,
        itemType,
        newComment.trim()
      );
      setComments([response.data, ...comments]);
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;

    try {
      await commentService.deleteComment(commentToDelete);
      setComments(comments.filter((c) => c._id !== commentToDelete));
      toast.success("Comment deleted!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    } finally {
      setCommentToDelete(null);
    }
  };

  const openDeleteModal = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const response = await commentService.updateComment(
        commentId,
        editContent.trim()
      );
      setComments(
        comments.map((c) =>
          c._id === commentId ? { ...c, content: editContent.trim() } : c
        )
      );
      setEditingCommentId(null);
      setEditContent("");
      toast.success("Comment updated!");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold text-foreground">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 sm:px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm sm:text-base"
            maxLength={500}
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 flex-shrink-0"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {newComment.length}/500 characters
        </p>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="spinner"></div>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-smooth"
            >
              {/* User Avatar */}
              <div className="flex-shrink-0">
                {comment.userId?.profilePic ? (
                  <img
                    src={comment.userId.profilePic}
                    alt={comment.userId.name}
                    className="h-10 w-10 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                    {getInitials(comment.userId?.name || "User")}
                  </div>
                )}
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <p className="font-semibold text-foreground">
                      {comment.userId?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(comment.createdAt)}
                    </p>
                  </div>
                  {(comment.userId?._id === userProfile?._id ||
                    comment.userId === userProfile?._id) && (
                    <div className="flex gap-1">
                      {editingCommentId === comment._id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(comment._id)}
                            className="p-1 text-green-600 hover:bg-green-600/10 rounded transition-smooth"
                            title="Save changes"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 text-muted-foreground hover:bg-muted rounded transition-smooth"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(comment)}
                            className="p-1 text-primary hover:bg-primary/10 rounded transition-smooth"
                            title="Edit comment"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(comment._id)}
                            className="p-1 text-destructive hover:bg-destructive/10 rounded transition-smooth"
                            title="Delete comment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {editingCommentId === comment._id ? (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      maxLength={500}
                      autoFocus
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {editContent.length}/500 characters
                    </p>
                  </div>
                ) : (
                  <p className="text-foreground break-words">
                    {comment.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCommentToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
};

export default Comments;
