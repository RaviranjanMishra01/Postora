const mongoose = require("mongoose");
const Post = require("../models/Post");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const calculateReadingTime = require("../utils/readingTime");
const slugify = require("slugify");
const { isValidObjectId, sanitizeRichText } = require("../middleware/validate");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

// @desc Create a Post
// @route POST /api/v1/posts
const createPost = asyncHandler(async (req, res) => {
  const { title, excerpt, content, featuredImage, category, tags, status, seoTitle, seoDescription, canonicalUrl, scheduledAt } = req.body;

  if (!title || !content || !category) {
    throw new ApiError(400, "Please provide title, content, and category");
  }

  if (title.trim().length > 200) {
    throw new ApiError(400, "Post title cannot exceed 200 characters");
  }

  if (!isValidObjectId(category)) {
    throw new ApiError(400, "Invalid category ID format");
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ApiError(404, "Category not found");
  }

  let cleanTags = [];
  if (Array.isArray(tags)) {
    cleanTags = tags.filter((t) => isValidObjectId(t));
  }

  const cleanContent = sanitizeRichText(content);
  const generatedSlug = slugify(title, { lower: true, strict: true }) + "-" + Date.now().toString().slice(-4);
  const calculatedReadingTime = calculateReadingTime(cleanContent || content);

  let postFeaturedImage = featuredImage;
  if (req.file) {
    const uploadRes = await uploadToCloudinary(req.file.path, "posts", { protocol: req.protocol, host: req.get("host") });
    postFeaturedImage = uploadRes?.secure_url || postFeaturedImage;
  }

  const post = await Post.create({
    title: title.trim(),
    slug: generatedSlug,
    excerpt: excerpt ? excerpt.trim().slice(0, 500) : title.trim(),
    content: cleanContent || content,
    featuredImage: postFeaturedImage,
    readingTime: calculatedReadingTime,
    author: req.user.id,
    category,
    tags: cleanTags,
    status: ["published", "draft", "scheduled"].includes(status) ? status : "draft",
    seoTitle: seoTitle ? seoTitle.trim().slice(0, 100) : title.trim(),
    seoDescription: seoDescription ? seoDescription.trim().slice(0, 200) : (excerpt || title).trim(),
    canonicalUrl,
    scheduledAt,
    publishedAt: status === "published" ? new Date() : null,
  });

  // Update Category postCount
  await Category.findByIdAndUpdate(category, { $inc: { postCount: 1 } });
  if (tags && tags.length > 0) {
    await Tag.updateMany({ _id: { $in: tags } }, { $inc: { postCount: 1 } });
  }

  const populatedPost = await Post.findById(post._id)
    .populate("author", "name username avatar role")
    .populate("category", "name slug")
    .populate("tags", "name slug");

  res.status(201).json(new ApiResponse(201, { post: populatedPost }, "Post created successfully"));
});

// @desc Get All Published Posts with Pagination, Sorting & Filters
// @route GET /api/v1/posts
const getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 6;
  const startIndex = (page - 1) * limit;

  const { category, tag, author, search, sort, status, featured } = req.query;

  const query = {};

  // Default to published unless requested otherwise by author/admin
  if (status) {
    query.status = status;
  } else {
    query.status = "published";
  }

  if (featured === "true") {
    query.isFeatured = true;
  }

  if (category) {
    const catObj = await Category.findOne({ slug: category });
    if (catObj) query.category = catObj._id;
  }

  if (tag) {
    const tagObj = await Tag.findOne({ slug: tag });
    if (tagObj) query.tags = tagObj._id;
  }

  if (author) {
    query.author = author;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  let sortOption = { publishedAt: -1, createdAt: -1 };
  if (sort === "popular" || sort === "views") {
    sortOption = { views: -1 };
  } else if (sort === "likes") {
    sortOption = { likesCount: -1 };
  } else if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  }

  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .populate("author", "name username avatar role bio")
    .populate("category", "name slug image")
    .populate("tags", "name slug")
    .sort(sortOption)
    .skip(startIndex)
    .limit(limit);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Posts fetched successfully"
    )
  );
});

// @desc Get Single Post by Slug or ID
// @route GET /api/v1/posts/:slug
const getPostBySlug = asyncHandler(async (req, res) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(req.params.slug);
  const query = isObjectId
    ? { $or: [{ _id: req.params.slug }, { slug: req.params.slug }] }
    : { slug: req.params.slug };

  const post = await Post.findOne(query)
    .populate("author", "name username avatar role bio socialLinks followersCount")
    .populate("category", "name slug description")
    .populate("tags", "name slug");

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Increment views asynchronously
  post.views += 1;
  await post.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, { post }, "Post fetched successfully"));
});

// @desc Update Post
// @route PUT /api/v1/posts/:id
const updatePost = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new ApiError(400, "Invalid post ID format");
  }

  let post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check ownership unless admin/superadmin
  if (post.author.toString() !== req.user.id && !["admin", "superadmin"].includes(req.user.role)) {
    throw new ApiError(403, "Not authorized to update this post");
  }

  const { title, excerpt, content, featuredImage, category, tags, status, seoTitle, seoDescription, canonicalUrl, isFeatured } = req.body;

  if (title && title !== post.title) {
    if (title.trim().length > 200) {
      throw new ApiError(400, "Post title cannot exceed 200 characters");
    }
    post.title = title.trim();
    post.slug = slugify(title, { lower: true, strict: true }) + "-" + Date.now().toString().slice(-4);
  }

  if (content) {
    const cleanContent = sanitizeRichText(content);
    post.content = cleanContent || content;
    post.readingTime = calculateReadingTime(post.content);
  }

  if (category) {
    if (!isValidObjectId(category)) {
      throw new ApiError(400, "Invalid category ID format");
    }
    const catObj = await Category.findById(category);
    if (!catObj) throw new ApiError(404, "Category not found");
    post.category = category;
  }

  if (Array.isArray(tags)) {
    post.tags = tags.filter((t) => isValidObjectId(t));
  }

  if (excerpt !== undefined) post.excerpt = String(excerpt).trim().slice(0, 500);

  if (req.file) {
    if (post.featuredImage) {
      await deleteFromCloudinary(post.featuredImage);
    }
    const uploadRes = await uploadToCloudinary(req.file.path, "posts", { protocol: req.protocol, host: req.get("host") });
    post.featuredImage = uploadRes?.secure_url || post.featuredImage;
  } else if (featuredImage && featuredImage !== post.featuredImage) {
    if (post.featuredImage) {
      await deleteFromCloudinary(post.featuredImage);
    }
    post.featuredImage = featuredImage;
  }

  if (status && ["published", "draft", "scheduled", "trash"].includes(status)) {
    post.status = status;
    if (status === "published" && !post.publishedAt) {
      post.publishedAt = new Date();
    }
  }
  if (isFeatured !== undefined) post.isFeatured = Boolean(isFeatured);
  if (seoTitle !== undefined) post.seoTitle = String(seoTitle).trim().slice(0, 100);
  if (seoDescription !== undefined) post.seoDescription = String(seoDescription).trim().slice(0, 200);
  if (canonicalUrl !== undefined) post.canonicalUrl = canonicalUrl;

  await post.save();

  const updatedPost = await Post.findById(post._id)
    .populate("author", "name username avatar role")
    .populate("category", "name slug")
    .populate("tags", "name slug");

  res.status(200).json(new ApiResponse(200, { post: updatedPost }, "Post updated successfully"));
});

// @desc Delete / Trash Post
// @route DELETE /api/v1/posts/:id
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.author.toString() !== req.user.id && !["admin", "superadmin"].includes(req.user.role)) {
    throw new ApiError(403, "Not authorized to delete this post");
  }

  if (post.status === "trash") {
    // Permanent deletion from database & real-time Cloudinary removal
    if (post.featuredImage) {
      await deleteFromCloudinary(post.featuredImage);
    }
    await post.deleteOne();
    res.status(200).json(new ApiResponse(200, {}, "Post permanently deleted"));
  } else {
    // Soft delete to trash
    post.status = "trash";
    await post.save();
    res.status(200).json(new ApiResponse(200, { post }, "Post moved to trash"));
  }
});

// @desc Restore Trash Post
// @route PUT /api/v1/posts/:id/restore
const restorePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) throw new ApiError(404, "Post not found");

  if (post.author.toString() !== req.user.id && !["admin", "superadmin"].includes(req.user.role)) {
    throw new ApiError(403, "Not authorized to restore this post");
  }

  post.status = "draft";
  await post.save();

  res.status(200).json(new ApiResponse(200, { post }, "Post restored to draft"));
});

// @desc Duplicate Post
// @route POST /api/v1/posts/:id/duplicate
const duplicatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) throw new ApiError(404, "Original post not found");

  const newTitle = `${post.title} (Copy)`;
  const newSlug = slugify(newTitle, { lower: true, strict: true }) + "-" + Date.now().toString().slice(-4);

  const duplicated = await Post.create({
    title: newTitle,
    slug: newSlug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage,
    readingTime: post.readingTime,
    author: req.user.id,
    category: post.category,
    tags: post.tags,
    status: "draft",
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
  });

  res.status(201).json(new ApiResponse(201, { post: duplicated }, "Post duplicated successfully"));
});

// @desc Get Related Posts
// @route GET /api/v1/posts/:id/related
const getRelatedPosts = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, "Post not found");

  const related = await Post.find({
    _id: { $ne: post._id },
    category: post.category,
    status: "published",
  })
    .populate("author", "name username avatar")
    .populate("category", "name slug")
    .limit(4);

  res.status(200).json(new ApiResponse(200, { posts: related }, "Related posts fetched"));
});

module.exports = {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  restorePost,
  duplicatePost,
  getRelatedPosts,
};
