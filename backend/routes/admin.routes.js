const express = require("express");
const router = express.Router();
const {
  getStats,
  getUsers,
  createAdmin,
  updateUserRole,
  updateAdminPermissions,
  toggleUserStatus,
  deleteUser,
  getAdminPosts,
  toggleFeaturedPost,
  deletePost,
  getAuditLogs,
  getSettings,
  updateSettings,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authmiddleware");

// All admin routes require protect and admin/superadmin authorization
router.use(protect, authorize("admin", "superadmin"));

router.get("/stats", getStats);
router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/status", toggleUserStatus);
router.delete("/users/:id", deleteUser);

router.get("/posts", getAdminPosts);
router.put("/posts/:id/feature", toggleFeaturedPost);
router.delete("/posts/:id", deletePost);

// SuperAdmin specific endpoints
router.post("/create-admin", authorize("superadmin"), createAdmin);
router.put("/users/:id/permissions", authorize("superadmin"), updateAdminPermissions);
router.get("/audit-logs", authorize("superadmin"), getAuditLogs);
router.get("/settings", getSettings);
router.put("/settings", authorize("superadmin"), updateSettings);

module.exports = router;
