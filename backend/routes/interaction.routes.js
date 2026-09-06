const express = require("express");
const router = express.Router();
const {
  toggleLike,
  toggleBookmark,
  getInteractionStatus,
  getSavedPosts,
} = require("../controllers/interactionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/like/:postId", protect, toggleLike);
router.post("/bookmark/:postId", protect, toggleBookmark);
router.get("/status/:postId", protect, getInteractionStatus);
router.get("/bookmarks", protect, getSavedPosts);

module.exports = router;
