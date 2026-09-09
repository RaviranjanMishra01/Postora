const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Report = require("../models/Report");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { escapeRegex } = require("../middleware/validate");

// In-memory system settings state for admin/superadmin
let systemSettings = {
  maintenanceMode: false,
  siteName: "Postora",
  allowUserRegistrations: true,
  requireEmailVerification: true,
  maxFeaturedPosts: 5,
};

// In-memory audit log stream for superadmin
let auditLogs = [
  { _id: "1", actor: "System", action: "PLATFORM_INIT", target: "System Core", timestamp: new Date(Date.now() - 3600000 * 24), status: "SUCCESS" },
  { _id: "2", actor: "SuperAdmin", action: "SECURITY_VERIFICATION", target: "Role Matrix", timestamp: new Date(Date.now() - 3600000 * 12), status: "SUCCESS" },
];

const logAudit = (actor, action, target, status = "SUCCESS") => {
  auditLogs.unshift({
    _id: Date.now().toString(),
    actor: actor?.name || actor?.username || "Admin",
    action,
    target,
    timestamp: new Date(),
    status,
  });
  if (auditLogs.length > 50) auditLogs.pop();
};

// @desc Admin Overview Dashboard Metrics
// @route GET /api/v1/admin/stats
const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalPosts = await Post.countDocuments();
  const publishedPosts = await Post.countDocuments({ status: "published" });
  const draftPosts = await Post.countDocuments({ status: "draft" });
  const totalComments = await Comment.countDocuments();
  const pendingReports = await Report.countDocuments({ status: "pending" });

  const viewsAggregation = await Post.aggregate([{ $group: { _id: null, totalViews: { $sum: "$views" } } }]);
  const likesAggregation = await Post.aggregate([{ $group: { _id: null, totalLikes: { $sum: "$likesCount" } } }]);

  const totalViews = viewsAggregation[0]?.totalViews || 0;
  const totalLikes = likesAggregation[0]?.totalLikes || 0;

  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("name username email role createdAt avatar");
  const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(5).populate("author", "name username").select("title status views createdAt");

  res.status(200).json(
    new ApiResponse(
      200,
      {
        stats: {
          totalUsers,
          totalPosts,
          publishedPosts,
          draftPosts,
          totalComments,
          pendingReports,
          totalViews,
          totalLikes,
        },
        recentUsers,
        recentPosts,
        systemSettings,
      },
      "Admin stats fetched"
    )
  );
});

// @desc Get Users List for Admin
// @route GET /api/v1/admin/users
const getUsers = asyncHandler(async (req, res) => {
  const { search, role, status, page = 1, limit = 20 } = req.query;
  const query = {};

  if (role) query.role = role;
  if (status) query.status = status;
  if (search && typeof search === "string") {
    const safeSearch = escapeRegex(search.trim().slice(0, 100));
    query.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { username: { $regex: safeSearch, $options: "i" } },
      { email: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const startIndex = (page - 1) * limit;
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(Number(limit))
    .select("-password");

  res.status(200).json(
    new ApiResponse(
      200,
      { users, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } },
      "Users fetched"
    )
  );
});

// @desc Change User Role
// @route PUT /api/v1/admin/users/:id/role
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["user", "author", "admin", "superadmin"].includes(role)) {
    throw new ApiError(400, "Invalid role specified");
  }

  const targetUser = await User.findById(req.params.id);
  if (!targetUser) throw new ApiError(404, "Target user not found");

  // Safeguard: Regular admins cannot modify a superadmin account
  if (targetUser.role === "superadmin" && req.user.role !== "superadmin") {
    throw new ApiError(403, "Admins cannot modify Super Admin accounts");
  }

  // Safeguard: Regular admins cannot promote anyone to superadmin
  if (role === "superadmin" && req.user.role !== "superadmin") {
    throw new ApiError(403, "Only Super Admin can promote users to Super Admin role");
  }

  targetUser.role = role;
  await targetUser.save();

  logAudit(req.user, "ROLE_UPDATE", `${targetUser.username} -> ${role}`);

  res.status(200).json(new ApiResponse(200, { user: targetUser }, "User role updated successfully"));
});

// @desc Toggle User Account Status (active / suspended)
// @route PUT /api/v1/admin/users/:id/status
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  // Safeguard: Regular admins cannot suspend a superadmin
  if (user.role === "superadmin" && req.user.role !== "superadmin") {
    throw new ApiError(403, "Admins cannot suspend Super Admin accounts");
  }

  user.status = user.status === "suspended" ? "active" : "suspended";
  await user.save();

  logAudit(req.user, "STATUS_TOGGLE", `${user.username} -> ${user.status}`);

  res.status(200).json(new ApiResponse(200, { user }, `User account ${user.status}`));
});

// @desc Delete User by Admin
// @route DELETE /api/v1/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.role === "superadmin" && req.user.role !== "superadmin") {
    throw new ApiError(403, "Admins cannot delete Super Admin accounts");
  }

  await User.findByIdAndDelete(req.params.id);
  logAudit(req.user, "DELETE_USER", user.username);

  res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
});

// @desc Get All Posts for Admin Management
// @route GET /api/v1/admin/posts
const getAdminPosts = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (search && typeof search === "string") {
    query.title = { $regex: escapeRegex(search.trim().slice(0, 100)), $options: "i" };
  }

  const startIndex = (page - 1) * limit;
  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .populate("author", "name username email")
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(Number(limit));

  res.status(200).json(
    new ApiResponse(
      200,
      { posts, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } },
      "Admin posts list fetched"
    )
  );
});

// @desc Toggle Featured Post State
// @route PUT /api/v1/admin/posts/:id/feature
const toggleFeaturedPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, "Post not found");

  post.isFeatured = !post.isFeatured;
  await post.save();

  logAudit(req.user, "TOGGLE_FEATURED", post.title);

  res.status(200).json(new ApiResponse(200, { post }, `Post featured state: ${post.isFeatured}`));
});

// @desc Delete Post by Admin
// @route DELETE /api/v1/admin/posts/:id
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, "Post not found");

  await Post.findByIdAndDelete(req.params.id);
  logAudit(req.user, "DELETE_POST", post.title);

  res.status(200).json(new ApiResponse(200, {}, "Post deleted successfully"));
});

// @desc Get SuperAdmin Audit Logs
// @route GET /api/v1/admin/audit-logs
const getAuditLogs = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { auditLogs }, "Audit logs fetched"));
});

// @desc Get / Update System Settings (SuperAdmin)
// @route GET/PUT /api/v1/admin/settings
const getSettings = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { systemSettings }, "System settings fetched"));
});

const updateSettings = asyncHandler(async (req, res) => {
  systemSettings = { ...systemSettings, ...req.body };
  logAudit(req.user, "UPDATE_SETTINGS", JSON.stringify(req.body));
  res.status(200).json(new ApiResponse(200, { systemSettings }, "System settings updated successfully"));
});

// @desc Create Admin (SuperAdmin only)
// @route POST /api/v1/admin/create-admin
const createAdmin = asyncHandler(async (req, res) => {
  const { name, username, email, password, permissions } = req.body;

  if (!name || !username || !email || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim().toLowerCase();

  const existingEmail = await User.findOne({ email: cleanEmail });
  if (existingEmail) throw new ApiError(400, "Email is already registered");

  const existingUsername = await User.findOne({ username: cleanUsername });
  if (existingUsername) throw new ApiError(400, "Username is already taken");

  const ALLOWED_PERMISSIONS = [
    "MANAGE_USERS",
    "MANAGE_POSTS",
    "MANAGE_COMMENTS",
    "MANAGE_REPORTS",
    "MANAGE_CATEGORIES",
    "MANAGE_TAGS",
    "VIEW_ANALYTICS",
    "MANAGE_SUPPORT",
    "MANAGE_NEWSLETTER",
  ];

  let validPermissions = ALLOWED_PERMISSIONS;
  if (Array.isArray(permissions)) {
    validPermissions = permissions.filter((p) => ALLOWED_PERMISSIONS.includes(p));
  }

  const newAdmin = await User.create({
    name: name.trim(),
    username: cleanUsername,
    email: cleanEmail,
    password,
    role: "admin",
    permissions: validPermissions,
    isEmailVerified: true,
  });

  logAudit(req.user, "CREATE_ADMIN", `Admin: ${newAdmin.username}`);

  res.status(201).json(new ApiResponse(201, { user: newAdmin }, "Admin account created successfully"));
});

// @desc Update Admin Permissions (SuperAdmin only)
// @route PUT /api/v1/admin/users/:id/permissions
const updateAdminPermissions = asyncHandler(async (req, res) => {
  const { permissions } = req.body;
  if (!Array.isArray(permissions)) {
    throw new ApiError(400, "Permissions must be an array");
  }

  const targetUser = await User.findById(req.params.id);
  if (!targetUser) throw new ApiError(404, "User not found");

  if (targetUser.role !== "admin") {
    throw new ApiError(400, "Permissions can only be updated for Admin accounts");
  }

  const ALLOWED_PERMISSIONS = [
    "MANAGE_USERS",
    "MANAGE_POSTS",
    "MANAGE_COMMENTS",
    "MANAGE_REPORTS",
    "MANAGE_CATEGORIES",
    "MANAGE_TAGS",
    "VIEW_ANALYTICS",
    "MANAGE_SUPPORT",
    "MANAGE_NEWSLETTER",
  ];

  const validPermissions = permissions.filter((p) => ALLOWED_PERMISSIONS.includes(p));
  targetUser.permissions = validPermissions;
  await targetUser.save();

  logAudit(req.user, "UPDATE_PERMISSIONS", `${targetUser.username}: ${validPermissions.join(",")}`);

  res.status(200).json(new ApiResponse(200, { user: targetUser }, "Admin permissions updated successfully"));
});

module.exports = {
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
};
