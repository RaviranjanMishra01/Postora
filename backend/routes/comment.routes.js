const express = require("express");
const router = express.Router();
const {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  likeComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");
const { commentLimiter } = require("../middleware/rateLimiter");

router.get("/post/:postId", getPostComments);
router.post("/", protect, commentLimiter, createComment);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);
router.post("/:id/like", protect, likeComment);

module.exports = router;
