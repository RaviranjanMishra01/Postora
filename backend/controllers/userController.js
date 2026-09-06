const User = require("../models/User");
const Post = require("../models/Post");
const Follow = require("../models/Follow");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// @desc Get current user profile
// @route GET /api/v1/users/profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(new ApiResponse(200, { user }, "User profile fetched successfully"));
});

// @desc Update profile info
// @route PUT /api/v1/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, website, location, socialLinks } = req.body;

  const fieldsToUpdate = {};
  if (name) fieldsToUpdate.name = name;
  if (bio !== undefined) fieldsToUpdate.bio = bio;
  if (website !== undefined) fieldsToUpdate.website = website;
  if (location !== undefined) fieldsToUpdate.location = location;
  if (socialLinks) fieldsToUpdate.socialLinks = socialLinks;

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(new ApiResponse(200, { user }, "Profile updated successfully"));
});

// @desc Change Avatar
// @route PUT /api/v1/users/avatar
const changeAvatar = asyncHandler(async (req, res) => {
  let avatarUrl = req.body.avatar;
  if (req.file) {
    avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  if (!avatarUrl) {
    throw new ApiError(400, "Please provide an image file or avatar URL");
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: avatarUrl },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, { user }, "Avatar updated successfully"));
});

// @desc Change Email
// @route PUT /api/v1/users/change-email
const changeEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const existing = await User.findOne({ email });
  if (existing && existing._id.toString() !== req.user.id) {
    throw new ApiError(400, "Email is already registered");
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { email, isEmailVerified: true },
    { new: true, runValidators: true }
  );

  res.status(200).json(new ApiResponse(200, { user }, "Email updated successfully"));
});

// @desc Change Username
// @route PUT /api/v1/users/change-username
const changeUsername = asyncHandler(async (req, res) => {
  const { username } = req.body;
  if (!username) throw new ApiError(400, "Username is required");

  const lowerUsername = username.toLowerCase();
  const existing = await User.findOne({ username: lowerUsername });
  if (existing && existing._id.toString() !== req.user.id) {
    throw new ApiError(400, "Username is already taken");
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { username: lowerUsername },
    { new: true, runValidators: true }
  );

  res.status(200).json(new ApiResponse(200, { user }, "Username updated successfully"));
});

// @desc Delete account
// @route DELETE /api/v1/users/delete-account
const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.cookie("token", "none", { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.status(200).json(new ApiResponse(200, {}, "Account deleted successfully"));
});

// @desc Get public author profile by username
// @route GET /api/v1/users/author/:username
const getPublicAuthorProfile = asyncHandler(async (req, res) => {
  const author = await User.findOne({ username: req.params.username.toLowerCase() }).select("-password");

  if (!author) {
    throw new ApiError(404, "Author not found");
  }

  const posts = await Post.find({ author: author._id, status: "published" })
    .populate("category", "name slug")
    .populate("tags", "name slug")
    .sort({ publishedAt: -1 });

  let isFollowing = false;
  if (req.user) {
    const followRecord = await Follow.findOne({ follower: req.user.id, following: author._id });
    isFollowing = !!followRecord;
  }

  res.status(200).json(
    new ApiResponse(200, { author, posts, isFollowing }, "Author profile fetched successfully")
  );
});

module.exports = {
  getProfile,
  updateProfile,
  changeAvatar,
  changeEmail,
  changeUsername,
  deleteAccount,
  getPublicAuthorProfile,
};
