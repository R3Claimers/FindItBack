const Comment = require("../models/Comment");

class CommentController {
  async addComment(req, res, next) {
    try {
      const { itemId, itemType, content } = req.body;

      const comment = await Comment.create({
        itemId,
        itemType,
        userId: req.user._id,
        content,
      });

      await comment.populate("userId", "name email profilePic");

      res.status(201).json({
        status: "success",
        message: "Comment added successfully",
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  async getItemComments(req, res, next) {
    try {
      const { itemId } = req.params;

      const comments = await Comment.find({ itemId })
        .populate("userId", "name email profilePic")
        .sort({ createdAt: -1 });

      res.status(200).json({
        status: "success",
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { id } = req.params;

      const comment = await Comment.findById(id);

      if (!comment) {
        return res.status(404).json({
          status: "error",
          message: "Comment not found",
        });
      }

      if (comment.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "You can only delete your own comments",
        });
      }

      await comment.deleteOne();

      res.status(200).json({
        status: "success",
        message: "Comment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateComment(req, res, next) {
    try {
      const { id } = req.params;
      const { content } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({
          status: "error",
          message: "Comment content is required",
        });
      }

      const comment = await Comment.findById(id);

      if (!comment) {
        return res.status(404).json({
          status: "error",
          message: "Comment not found",
        });
      }

      if (comment.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "You can only update your own comments",
        });
      }

      comment.content = content.trim();
      await comment.save();

      await comment.populate("userId", "name email profilePic");

      res.status(200).json({
        status: "success",
        message: "Comment updated successfully",
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommentController();
