const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);
router.post("/", protect, authorize("author", "admin", "superadmin"), upload.single("image"), createCategory);
router.put("/:id", protect, authorize("admin", "superadmin"), upload.single("image"), updateCategory);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteCategory);

module.exports = router;
