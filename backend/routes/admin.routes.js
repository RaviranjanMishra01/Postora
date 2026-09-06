const express = require("express");
const router = express.Router();
const {
  getStats,
  getUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getAdminPosts,
  toggleFeaturedPost,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// All admin routes require admin or superadmin role
router.use(protect, authorize("admin", "superadmin"));

router.get("/stats", getStats);
router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/status", toggleUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/posts", getAdminPosts);
router.put("/posts/:id/feature", toggleFeaturedPost);

module.exports = router;
