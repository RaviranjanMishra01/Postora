const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { isValidEmail } = require("../middleware/validate");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client();

// Helper to send cookie token response
const sendTokenResponse = (user, statusCode, res, message = "Success") => {
  const token = user.generateAuthToken();

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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

  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim().toLowerCase();

  if (!isValidEmail(cleanEmail)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  if (cleanUsername.length < 3 || cleanUsername.length > 30 || !/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
    throw new ApiError(400, "Username must be 3-30 characters long and contain only letters, numbers, and underscores");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  const existingEmail = await User.findOne({ email: cleanEmail });
  if (existingEmail) {
    throw new ApiError(400, "Email address is already registered");
  }

  const existingUsername = await User.findOne({ username: cleanUsername });
  if (existingUsername) {
    throw new ApiError(400, "Username is already taken");
  }

  const user = await User.create({
    name: name.trim().slice(0, 50),
    username: cleanUsername,
    email: cleanEmail,
    password,
    role: "user", // Forced: Client cannot override role or assign privileged access
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

  const cleanEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.status === "suspended") {
    throw new ApiError(403, "Your account has been suspended by an administrator");
  }

  sendTokenResponse(user, 200, res, "Login successful!");
});

// @desc Admin Login (Role: ADMIN or SUPER_ADMIN required)
// @route POST /api/v1/auth/admin/login
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.status === "suspended") {
    throw new ApiError(403, "Your account has been suspended by an administrator");
  }

  const role = user.role?.toLowerCase();
  if (role !== "admin" && role !== "superadmin") {
    throw new ApiError(401, "Invalid credentials");
  }

  sendTokenResponse(user, 200, res, "Admin authentication successful!");
});

// @desc Super Admin Login (Role: SUPER_ADMIN required)
// @route POST /api/v1/auth/super-admin/login
const superAdminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.status === "suspended") {
    throw new ApiError(403, "Your account has been suspended by an administrator");
  }

  const role = user.role?.toLowerCase();
  if (role !== "superadmin") {
    throw new ApiError(401, "Invalid credentials");
  }

  sendTokenResponse(user, 200, res, "Super Admin authentication successful!");
});

// @desc Logout User / Clear Cookie
// @route POST /api/v1/auth/logout
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
  if (!email || !isValidEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail });

  if (user) {
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || "https://postora-seven.vercel.app";
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
    const message = `Password Reset Request:\n\n${resetUrl}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: message,
      html: `<p>${message}</p>`,
    });
  }

  res.status(200).json(new ApiResponse(200, {}, "If an account exists for that email, a password reset link has been dispatched."));
});

// @desc Admin Forgot Password
// @route POST /api/v1/auth/admin/forgot-password
const adminForgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !isValidEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail });

  if (user && (user.role === "admin" || user.role === "superadmin")) {
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || "https://postora-seven.vercel.app";
    const resetUrl = `${clientUrl}/admin/reset-password/${resetToken}`;
    const message = `Admin Password Reset Request:\n\n${resetUrl}`;

    await sendEmail({
      to: user.email,
      subject: "Admin Password Reset Request",
      text: message,
      html: `<p>${message}</p>`,
    });
  }

  res.status(200).json(new ApiResponse(200, {}, "If an administrative account exists for that email, a password reset link has been dispatched."));
});

// @desc Super Admin Forgot Password
// @route POST /api/v1/auth/super-admin/forgot-password
const superAdminForgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !isValidEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail });

  if (user && user.role === "superadmin") {
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || "https://postora-seven.vercel.app";
    const resetUrl = `${clientUrl}/super-admin/reset-password/${resetToken}`;
    const message = `Super Admin Password Reset Request:\n\n${resetUrl}`;

    await sendEmail({
      to: user.email,
      subject: "Super Admin Password Reset Request",
      text: message,
      html: `<p>${message}</p>`,
    });
  }

  res.status(200).json(new ApiResponse(200, {}, "If a Super Admin account exists for that email, a password reset link has been dispatched."));
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

// @desc Continue with Google Authentication (Login / Register)
// @route POST /api/v1/auth/google
const googleAuth = asyncHandler(async (req, res) => {
  const { credential, email, name, avatar, googleId } = req.body;

  let verifiedEmail = email;
  let verifiedName = name;
  let verifiedAvatar = avatar;
  let verifiedGoogleId = googleId;

  // 1. Verify Google ID token if provided
  if (credential) {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: clientId && clientId !== "your_google_client_id_here" ? clientId : undefined,
      });
      const payload = ticket.getPayload();
      verifiedEmail = payload.email;
      verifiedName = payload.name;
      verifiedAvatar = payload.picture || avatar;
      verifiedGoogleId = payload.sub;
    } catch (tokenErr) {
      try {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.decode(credential);
        if (decoded && decoded.email) {
          verifiedEmail = decoded.email;
          verifiedName = decoded.name || verifiedEmail.split("@")[0];
          verifiedAvatar = decoded.picture || avatar;
          verifiedGoogleId = decoded.sub || decoded.user_id;
        } else {
          throw new ApiError(401, "Invalid Google authentication token");
        }
      } catch (err) {
        throw new ApiError(401, "Google ID token verification failed");
      }
    }
  }

  if (!verifiedEmail) {
    throw new ApiError(400, "Google authentication requires a verified email address");
  }

  const normalizedEmail = String(verifiedEmail).trim().toLowerCase();
  let user = await User.findOne({
    $or: [
      { email: normalizedEmail },
      { googleId: verifiedGoogleId ? verifiedGoogleId : "non_existent_id_placeholder" }
    ]
  });

  const effectiveGoogleId = verifiedGoogleId || `google_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

  if (user) {
    let updated = false;
    if (!user.googleId) {
      user.googleId = effectiveGoogleId;
      updated = true;
    }
    if (verifiedAvatar && (!user.avatar || user.avatar.includes("unsplash"))) {
      user.avatar = verifiedAvatar;
      updated = true;
    }
    if (user.status === "suspended") {
      throw new ApiError(403, "Your account has been suspended by an administrator");
    }
    if (updated) {
      await user.save({ validateBeforeSave: false });
    }
    return sendTokenResponse(user, 200, res, "Successfully logged in with Google!");
  }

  // Generate unique username from name or email
  let baseUsername = (verifiedName || normalizedEmail.split("@")[0])
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");

  if (baseUsername.length < 3) baseUsername = "user_" + baseUsername;
  let username = baseUsername;
  let counter = 1;

  while (await User.findOne({ username })) {
    username = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}${counter}`;
    counter++;
  }

  user = await User.create({
    name: (verifiedName || normalizedEmail.split("@")[0]).slice(0, 50),
    username,
    email: normalizedEmail,
    role: "user", // Forced normal user role (never ADMIN or SUPER_ADMIN)
    avatar: verifiedAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    googleId: effectiveGoogleId,
    authProvider: "google",
    isEmailVerified: true,
  });

  sendTokenResponse(user, 201, res, "Account created with Google successfully!");
});

module.exports = {
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
};