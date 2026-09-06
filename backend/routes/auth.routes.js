const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.post("/forgot-password", authLimiter, forgotPassword);
router.put("/reset-password/:resettoken", resetPassword);
router.put("/change-password", protect, changePassword);

module.exports = router;
