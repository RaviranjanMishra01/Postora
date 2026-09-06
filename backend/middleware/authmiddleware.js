const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check HTTP-only cookie first, then Bearer token header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authorized to access this route");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_super_secret_jwt_key_2026"
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    if (user.status === "suspended") {
      throw new ApiError(403, "Your account has been suspended by an administrator");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired authorization token");
  }
});

module.exports = { protect };