const Like = require("../models/Like");
const Bookmark = require("../models/Bookmark");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// @desc Toggle Like on Post
// @route POST /api/v1/interactions/like/:postId
const toggleLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const existingLike = await Like.findOne({ user: userId, post: postId });

  if (existingLike) {
    // Unlike
    await existingLike.deleteOne();
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
    return res.status(200).json(new ApiResponse(200, { isLiked: false }, "Post unliked"));
  } else {
    // Like
    await Like.create({ user: userId, post: postId });
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

    // Notify author
    if (post.author.toString() !== userId) {
      await Notification.create({
        recipient: post.author,
        sender: userId,
        type: "like",
        post: postId,
      });
    }

    return res.status(200).json(new ApiResponse(200, { isLiked: true }, "Post liked"));
  }
});

// @desc Toggle Bookmark on Post
// @route POST /api/v1/interactions/bookmark/:postId
const toggleBookmark = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const existingBookmark = await Bookmark.findOne({ user: userId, post: postId });

  if (existingBookmark) {
    // Remove Bookmark
    await existingBookmark.deleteOne();
    return res.status(200).json(new ApiResponse(200, { isBookmarked: false }, "Bookmark removed"));
  } else {
    // Add Bookmark
    await Bookmark.create({ user: userId, post: postId });
    return res.status(200).json(new ApiResponse(200, { isBookmarked: true }, "Post saved to bookmarks"));
  }
});

// @desc Get user liked & bookmarked states for a post
// @route GET /api/v1/interactions/status/:postId
const getInteractionStatus = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const isLiked = !!(await Like.findOne({ user: userId, post: postId }));
  const isBookmarked = !!(await Bookmark.findOne({ user: userId, post: postId }));

  res.status(200).json(new ApiResponse(200, { isLiked, isBookmarked }, "Interaction status fetched"));
});

// @desc Get user bookmarked posts page
// @route GET /api/v1/interactions/bookmarks
const getSavedPosts = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user.id })
    .populate({
      path: "post",
      populate: [
        { path: "author", select: "name username avatar" },
        { path: "category", select: "name slug" },
        { path: "tags", select: "name slug" },
      ],
    })
    .sort({ createdAt: -1 });

  const posts = bookmarks.map((b) => b.post).filter(Boolean);

  res.status(200).json(new ApiResponse(200, { posts }, "Saved posts fetched successfully"));
});

// @desc Get user liked posts
// @route GET /api/v1/interactions/liked
const getLikedPosts = asyncHandler(async (req, res) => {
  const likes = await Like.find({ user: req.user.id })
    .populate({
      path: "post",
      populate: [
        { path: "author", select: "name username avatar" },
        { path: "category", select: "name slug" },
        { path: "tags", select: "name slug" },
      ],
    })
    .sort({ createdAt: -1 });

  const posts = likes.map((l) => l.post).filter(Boolean);

  res.status(200).json(new ApiResponse(200, { posts }, "Liked posts fetched successfully"));
});

module.exports = {
  toggleLike,
  toggleBookmark,
  getInteractionStatus,
  getSavedPosts,
  getLikedPosts,
};
