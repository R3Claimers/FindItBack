const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authenticateUser = require("../middlewares/auth");

// All routes require authentication
router.use(authenticateUser);

// Add comment
router.post("/", commentController.addComment);

// Get comments for an item
router.get("/:itemId", commentController.getItemComments);

// Update comment
router.put("/:id", commentController.updateComment);

// Delete comment
router.delete("/:id", commentController.deleteComment);

module.exports = router;
