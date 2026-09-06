const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Helper to send cookie token response
const sendTokenResponse = (user, statusCode, res, message = "Success") => {
  const token = user.generateAuthToken();

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  };

  user.password = undefined;

  res.status(statusCode).cookie("token", token, options).json(
    new ApiResponse(statusCode, { user, token }, message)
  );
};

// @desc Register User
// @route POST /api/v1/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(400, "Email address is already registered");
  }

  const existingUsername = await User.findOne({ username: username.toLowerCase() });
  if (existingUsername) {
    throw new ApiError(400, "Username is already taken");
  }

  const user = await User.create({
    name,
    username: username.toLowerCase(),
    email,
    password,
    isEmailVerified: true, // Auto-verify for streamlined dev/testing
  });

  sendTokenResponse(user, 201, res, "Registration successful!");
});

// @desc Login User
// @route POST /api/v1/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.status === "suspended") {
    throw new ApiError(403, "Your account has been suspended by an administrator");
  }

  sendTokenResponse(user, 200, res, "Login successful!");
});

// @desc Logout User / Clear Cookie
// @route POST /api/v1/auth/logout
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});

// @desc Get Current Logged In User
// @route GET /api/v1/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(new ApiResponse(200, { user }, "Fetched current user session"));
});

// @desc Forgot Password
// @route POST /api/v1/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "There is no user registered with that email address");
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) requested a password reset. Please click on the link to reset your password:\n\n${resetUrl}`;

  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    text: message,
    html: `<p>${message}</p>`,
  });

  res.status(200).json(new ApiResponse(200, {}, "Password reset token sent to email"));
});

// @desc Reset Password
// @route PUT /api/v1/auth/reset-password/:resettoken
const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, "Password reset successful!");
});

// @desc Change Password
// @route PUT /api/v1/auth/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, "Password updated successfully");
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
};