const Follow = require("../models/Follow");
const User = require("../models/User");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// @desc Toggle Follow / Unfollow Author
// @route POST /api/v1/follows/:authorId
const toggleFollow = asyncHandler(async (req, res) => {
  const { authorId } = req.params;
  const followerId = req.user.id;

  if (authorId === followerId) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  const author = await User.findById(authorId);
  if (!author) throw new ApiError(404, "Author not found");

  const existingFollow = await Follow.findOne({ follower: followerId, following: authorId });

  if (existingFollow) {
    // Unfollow
    await existingFollow.deleteOne();
    await User.findByIdAndUpdate(authorId, { $inc: { followersCount: -1 } });
    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
    return res.status(200).json(new ApiResponse(200, { isFollowing: false }, "Unfollowed author"));
  } else {
    // Follow
    await Follow.create({ follower: followerId, following: authorId });
    await User.findByIdAndUpdate(authorId, { $inc: { followersCount: 1 } });
    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });

    // Send notification
    await Notification.create({
      recipient: authorId,
      sender: followerId,
      type: "follow",
    });

    return res.status(200).json(new ApiResponse(200, { isFollowing: true }, "Following author"));
  }
});

// @desc Get Author Feed (Posts from followed authors)
// @route GET /api/v1/follows/feed
const getAuthorFeed = asyncHandler(async (req, res) => {
  const follows = await Follow.find({ follower: req.user.id });
  const followingIds = follows.map((f) => f.following);

  const posts = await Post.find({ author: { $in: followingIds }, status: "published" })
    .populate("author", "name username avatar role")
    .populate("category", "name slug")
    .populate("tags", "name slug")
    .sort({ publishedAt: -1 })
    .limit(10);

  res.status(200).json(new ApiResponse(200, { posts }, "Author feed fetched"));
});

module.exports = {
  toggleFollow,
  getAuthorFeed,
};
