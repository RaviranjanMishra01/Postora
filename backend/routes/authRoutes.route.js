const express = require("express");

const { register, login, getProfile,} = require("../controllers/authController");
const { loginLimiter, registerLimiter,} = require("../middleware/rateLimiter");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/register", registerLimiter, register);

router.post("/login", loginLimiter, login);

router.get("/profile", authMiddleware, getProfile);



module.exports = router;