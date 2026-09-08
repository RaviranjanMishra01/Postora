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

    // Clean up follow notifications for this follow pair to prevent duplicate/stale entries
    await Notification.deleteMany({ recipient: authorId, sender: followerId, type: "follow" });

    const updatedAuthor = await User.findById(authorId).select("followersCount followingCount");
    const followersCount = Math.max(0, updatedAuthor?.followersCount || 0);

    return res.status(200).json(
      new ApiResponse(200, { isFollowing: false, followersCount }, "Unfollowed author")
    );
  } else {
    // Follow
    await Follow.create({ follower: followerId, following: authorId });
    await User.findByIdAndUpdate(authorId, { $inc: { followersCount: 1 } });
    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });

    // Prevent duplicate follow notifications: remove any old follow notification from this sender to recipient, then create clean new one
    await Notification.deleteMany({ recipient: authorId, sender: followerId, type: "follow" });
    await Notification.create({
      recipient: authorId,
      sender: followerId,
      type: "follow",
    });

    const updatedAuthor = await User.findById(authorId).select("followersCount followingCount");
    const followersCount = updatedAuthor?.followersCount || 1;

    return res.status(200).json(
      new ApiResponse(200, { isFollowing: true, followersCount }, "Following author")
    );
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

// @desc Get Followers List for User
// @route GET /api/v1/follows/followers/:userId?
const getFollowersList = asyncHandler(async (req, res) => {
  const targetId = req.params.userId || req.user?.id;
  if (!targetId) throw new ApiError(400, "User ID is required");

  const follows = await Follow.find({ following: targetId })
    .populate("follower", "name username avatar role bio followersCount location")
    .sort({ createdAt: -1 });

  // Filter out null values for deleted/deactivated follower accounts gracefully
  const followers = follows.map((f) => f.follower).filter(Boolean);

  res.status(200).json(new ApiResponse(200, { followers }, "Followers list fetched successfully"));
});

// @desc Get Following List for User
// @route GET /api/v1/follows/following/:userId?
const getFollowingList = asyncHandler(async (req, res) => {
  const targetId = req.params.userId || req.user?.id;
  if (!targetId) throw new ApiError(400, "User ID is required");

  const follows = await Follow.find({ follower: targetId })
    .populate("following", "name username avatar role bio followersCount location")
    .sort({ createdAt: -1 });

  // Filter out null values for deleted/deactivated following accounts gracefully
  const following = follows.map((f) => f.following).filter(Boolean);

  res.status(200).json(new ApiResponse(200, { following }, "Following list fetched successfully"));
});

module.exports = {
  toggleFollow,
  getAuthorFeed,
  getFollowersList,
  getFollowingList,
};
