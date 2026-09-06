const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Report = require("../models/Report");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

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
      },
      "Admin stats fetched"
    )
  );
});

// @desc Get Users List for Admin
// @route GET /api/v1/admin/users
const getUsers = asyncHandler(async (req, res) => {
  const { search, role, status, page = 1, limit = 10 } = req.query;
  const query = {};

  if (role) query.role = role;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
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

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
  res.status(200).json(new ApiResponse(200, { user }, "User role updated successfully"));
});

// @desc Toggle User Account Status (active / suspended)
// @route PUT /api/v1/admin/users/:id/status
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  user.status = user.status === "suspended" ? "active" : "suspended";
  await user.save();

  res.status(200).json(new ApiResponse(200, { user }, `User account ${user.status}`));
});

// @desc Delete User by Admin
// @route DELETE /api/v1/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
});

// @desc Get All Posts for Admin Management
// @route GET /api/v1/admin/posts
const getAdminPosts = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (search) {
    query.title = { $regex: search, $options: "i" };
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

  res.status(200).json(new ApiResponse(200, { post }, `Post featured state: ${post.isFeatured}`));
});

module.exports = {
  getStats,
  getUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getAdminPosts,
  toggleFeaturedPost,
};
