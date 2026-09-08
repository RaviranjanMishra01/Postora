const express = require("express");
const router = express.Router();
const {
  register,
  login,
  adminLogin,
  superAdminLogin,
  logout,
  getMe,
  forgotPassword,
  adminForgotPassword,
  superAdminForgotPassword,
  resetPassword,
  changePassword,
  googleAuth,
} = require("../controllers/authController");
const { protect } = require("../middleware/authmiddleware");
const { authLimiter, adminAuthLimiter } = require("../middleware/rateLimiter");

// User Auth Routes
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/google", authLimiter, googleAuth);

// Admin Auth Routes
router.post("/admin/login", adminAuthLimiter, adminLogin);
router.post("/admin/forgot-password", adminAuthLimiter, adminForgotPassword);

// Super Admin Auth Routes
router.post("/super-admin/login", adminAuthLimiter, superAdminLogin);
router.post("/super-admin/forgot-password", adminAuthLimiter, superAdminForgotPassword);

// Common Session & Password Recovery
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.post("/forgot-password", authLimiter, forgotPassword);
router.put("/reset-password/:resettoken", resetPassword);
router.put("/change-password", protect, changePassword);

module.exports = router;
