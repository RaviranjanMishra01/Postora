const User = require("../models/User");
const Post = require("../models/Post");
const Follow = require("../models/Follow");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { isValidEmail, isValidUrl } = require("../middleware/validate");

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
  if (name) {
    if (name.trim().length > 50) throw new ApiError(400, "Name cannot exceed 50 characters");
    fieldsToUpdate.name = name.trim();
  }
  if (bio !== undefined) {
    if (String(bio).length > 250) throw new ApiError(400, "Bio cannot exceed 250 characters");
    fieldsToUpdate.bio = String(bio).trim();
  }
  if (website !== undefined && website.trim() !== "") {
    if (!isValidUrl(website)) throw new ApiError(400, "Please provide a valid website URL starting with http:// or https://");
    fieldsToUpdate.website = website.trim();
  } else if (website === "") {
    fieldsToUpdate.website = "";
  }

  if (location !== undefined) {
    if (String(location).length > 100) throw new ApiError(400, "Location cannot exceed 100 characters");
    fieldsToUpdate.location = String(location).trim();
  }
  if (socialLinks && typeof socialLinks === "object") {
    fieldsToUpdate.socialLinks = {
      twitter: socialLinks.twitter ? String(socialLinks.twitter).trim() : "",
      github: socialLinks.github ? String(socialLinks.github).trim() : "",
      linkedin: socialLinks.linkedin ? String(socialLinks.linkedin).trim() : "",
      instagram: socialLinks.instagram ? String(socialLinks.instagram).trim() : "",
    };
  }

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
  if (!email || !isValidEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: cleanEmail });
  if (existing && existing._id.toString() !== req.user.id) {
    throw new ApiError(400, "Email is already registered");
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { email: cleanEmail, isEmailVerified: true },
    { new: true, runValidators: true }
  );

  res.status(200).json(new ApiResponse(200, { user }, "Email updated successfully"));
});

// @desc Change Username
// @route PUT /api/v1/users/change-username
const changeUsername = asyncHandler(async (req, res) => {
  const { username } = req.body;
  if (!username) throw new ApiError(400, "Username is required");

  const lowerUsername = username.trim().toLowerCase();
  if (lowerUsername.length < 3 || lowerUsername.length > 30 || !/^[a-zA-Z0-9_]+$/.test(lowerUsername)) {
    throw new ApiError(400, "Username must be 3-30 characters long and contain only letters, numbers, and underscores");
  }

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

// @desc Get public author profile by username or userId
// @route GET /api/v1/users/author/:username
const getPublicAuthorProfile = asyncHandler(async (req, res) => {
  const identifier = req.params.username;
  const mongoose = require("mongoose");

  let author = await User.findOne({ username: identifier.toLowerCase() }).select("-password -email -resetPasswordToken -resetPasswordExpire");

  if (!author && mongoose.Types.ObjectId.isValid(identifier)) {
    author = await User.findById(identifier).select("-password -email -resetPasswordToken -resetPasswordExpire");
  }

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
