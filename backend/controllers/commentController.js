const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const PROFANITY_LIST = ["badword1", "spamword", "scamlink", "fakeoffer"];

const hasProfanity = (text) => {
  const lower = text.toLowerCase();
  return PROFANITY_LIST.some((word) => lower.includes(word));
};

// @desc Create comment or reply
// @route POST /api/v1/comments
const createComment = asyncHandler(async (req, res) => {
  const { post: postId, content, parentComment } = req.body;

  if (!postId || !content) {
    throw new ApiError(400, "Post ID and content are required");
  }

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const isSpam = hasProfanity(content);

  const comment = await Comment.create({
    post: postId,
    user: req.user.id,
    content,
    parentComment: parentComment || null,
    isSpam,
    isApproved: !isSpam,
  });

  // Increment comments count on post
  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

  // Update parent comment reply count if it's a nested reply
  if (parentComment) {
    await Comment.findByIdAndUpdate(parentComment, { $inc: { repliesCount: 1 } });

    // Notify parent comment author
    const parentComp = await Comment.findById(parentComment);
    if (parentComp && parentComp.user.toString() !== req.user.id) {
      await Notification.create({
        recipient: parentComp.user,
        sender: req.user.id,
        type: "reply",
        post: postId,
        comment: comment._id,
      });
    }
  } else if (post.author.toString() !== req.user.id) {
    // Notify post author
    await Notification.create({
      recipient: post.author,
      sender: req.user.id,
      type: "comment",
      post: postId,
      comment: comment._id,
    });
  }

  const populated = await Comment.findById(comment._id).populate("user", "name username avatar role");

  res.status(201).json(new ApiResponse(201, { comment: populated }, "Comment added successfully"));
});

// @desc Get top-level comments for a post (with populated nested replies)
// @route GET /api/v1/comments/post/:postId
const getPostComments = asyncHandler(async (req, res) => {
  const topComments = await Comment.find({
    post: req.params.postId,
    parentComment: null,
    isApproved: true,
  })
    .populate("user", "name username avatar role")
    .sort({ createdAt: -1 });

  // Fetch replies for each top comment
  const commentsWithReplies = await Promise.all(
    topComments.map(async (comment) => {
      const replies = await Comment.find({
        parentComment: comment._id,
        isApproved: true,
      })
        .populate("user", "name username avatar role")
        .sort({ createdAt: 1 });

      return {
        ...comment.toObject(),
        replies,
      };
    })
  );

  res.status(200).json(new ApiResponse(200, { comments: commentsWithReplies }, "Comments fetched"));
});

// @desc Update Comment
// @route PUT /api/v1/comments/:id
const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.user.toString() !== req.user.id && !["admin", "superadmin"].includes(req.user.role)) {
    throw new ApiError(403, "Not authorized to update this comment");
  }

  comment.content = req.body.content || comment.content;
  await comment.save();

  res.status(200).json(new ApiResponse(200, { comment }, "Comment updated successfully"));
});

// @desc Delete Comment
// @route DELETE /api/v1/comments/:id
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.user.toString() !== req.user.id && !["admin", "superadmin"].includes(req.user.role)) {
    throw new ApiError(403, "Not authorized to delete this comment");
  }

  await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });
  await comment.deleteOne();

  res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

// @desc Like Comment
// @route POST /api/v1/comments/:id/like
const likeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { $inc: { likesCount: 1 } },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, { comment }, "Comment liked"));
});

module.exports = {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  likeComment,
};
