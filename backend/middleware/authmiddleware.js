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
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "Invalid or expired authorization token");
  }
});

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `Access denied for role '${req.user.role}'`);
    }
    next();
  };
};

// Permission-based authorization middleware
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }
    if (req.user.role === "superadmin") {
      return next();
    }
    if (req.user.role === "admin") {
      const allowed = req.user.permissions || [];
      if (allowed.includes(permission)) {
        return next();
      }
    }
    throw new ApiError(403, `Permission '${permission}' is required to perform this operation`);
  };
};

module.exports = { protect, authorize, checkPermission };