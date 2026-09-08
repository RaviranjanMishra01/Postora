const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  restorePost,
  duplicatePost,
  getRelatedPosts,
} = require("../controllers/postController");
const { protect } = require("../middleware/authmiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getPosts);
router.get("/:slug", getPostBySlug);
router.get("/:id/related", getRelatedPosts);

// Allow all authenticated users (user, author, admin, superadmin) to create and manage their posts
router.post("/", protect, authorize("user", "author", "admin", "superadmin"), upload.single("featuredImage"), createPost);
router.put("/:id", protect, authorize("user", "author", "admin", "superadmin"), upload.single("featuredImage"), updatePost);
router.delete("/:id", protect, authorize("user", "author", "admin", "superadmin"), deletePost);
router.put("/:id/restore", protect, authorize("user", "author", "admin", "superadmin"), restorePost);
router.post("/:id/duplicate", protect, authorize("user", "author", "admin", "superadmin"), duplicatePost);

module.exports = router;
