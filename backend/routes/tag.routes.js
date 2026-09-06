const express = require("express");
const router = express.Router();
const {
  getTags,
  getPopularTags,
  getTagBySlug,
  createTag,
  deleteTag,
} = require("../controllers/tagController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.get("/", getTags);
router.get("/popular", getPopularTags);
router.get("/:slug", getTagBySlug);
router.post("/", protect, authorize("author", "admin", "superadmin"), createTag);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteTag);

module.exports = router;
