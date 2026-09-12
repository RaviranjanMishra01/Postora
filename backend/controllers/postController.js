const mongoose = require("mongoose");
const Post = require("../models/Post");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const calculateReadingTime = require("../utils/readingTime");
const slugify = require("slugify");
const { isValidObjectId, sanitizeRichText, escapeRegex } = require("../middleware/validate");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

// Helper to normalize and find/create tags & topics
const processTopicsAndTags = async (rawTopics) => {
  let topicStrings = [];
  if (Array.isArray(rawTopics)) {
    topicStrings = rawTopics;
  } else if (typeof rawTopics === "string") {
    try {
      topicStrings = JSON.parse(rawTopics);
    } catch {
      topicStrings = [rawTopics];
    }
  }

  const cleanTopicNames = [];
  const seenLower = new Set();

  for (let t of topicStrings) {
    if (!t) continue;
    // If it's a tag ObjectId, resolve tag document first
    if (isValidObjectId(t)) {
      const existingTagDoc = await Tag.findById(t);
      if (existingTagDoc) {
        t = existingTagDoc.name;
      }
    }
    if (typeof t !== "string") continue;
    const trimmed = t.trim();
    if (!trimmed) continue;
    const lower = trimmed.toLowerCase();
    if (!seenLower.has(lower) && cleanTopicNames.length < 10) {
      seenLower.add(lower);
      cleanTopicNames.push(trimmed.slice(0, 50));
    }
  }

  const tagObjectIds = [];
  for (let topicName of cleanTopicNames) {
    const tagSlug = slugify(topicName, { lower: true, strict: true }) || topicName.toLowerCase().replace(/\s+/g, "-");
    let tagDoc = await Tag.findOne({
      $or: [{ slug: tagSlug }, { name: new RegExp("^" + escapeRegex(topicName) + "$", "i") }],
    });
    if (!tagDoc) {
      try {
        tagDoc = await Tag.create({ name: topicName, slug: tagSlug });
      } catch (err) {
        tagDoc = await Tag.findOne({ slug: tagSlug });
      }
    }
    if (tagDoc) {
      tagObjectIds.push(tagDoc._id);
    }
  }

  return { tagObjectIds, cleanTopicNames };
};

// Helper to process Category & customCategory
const processCategoryAndCustom = async (categoryInput, customCategoryInput) => {
  let isOther = false;
  let catObj = null;

  if (categoryInput === "Other" || categoryInput === "other") {
    isOther = true;
  } else if (isValidObjectId(categoryInput)) {
    catObj = await Category.findById(categoryInput);
    if (catObj && catObj.name.toLowerCase() === "other") {
      isOther = true;
    }
  }

  if (isOther) {
    if (!customCategoryInput || !customCategoryInput.trim()) {
      throw new ApiError(400, "Please enter your category for 'Other'");
    }
    // Ensure "Other" category document exists in MongoDB
    let otherCatDoc = await Category.findOne({ slug: "other" });
    if (!otherCatDoc) {
      otherCatDoc = await Category.create({
        name: "Other",
        slug: "other",
        description: "User defined categories",
      });
    }
    return {
      categoryId: otherCatDoc._id,
      customCategory: customCategoryInput.trim().slice(0, 50),
    };
  }

  // Standard category
  if (!catObj && isValidObjectId(categoryInput)) {
    catObj = await Category.findById(categoryInput);
  }
  if (!catObj) {
    throw new ApiError(404, "Category not found");
  }

  return {
    categoryId: catObj._id,
    customCategory: "",
  };
};

// @desc Create a Post
// @route POST /api/v1/posts
const createPost = asyncHandler(async (req, res) => {
  const {
    title,
    excerpt,
    featuredImage,
    category,
    customCategory,
    tags,
    topics,
    status,
    seoTitle,
    seoDescription,
    canonicalUrl,
    scheduledAt,
  } = req.body;

  if (!title || !category) {
    throw new ApiError(400, "Please provide title, and category");
  }

  if (title.trim().length > 200) {
    throw new ApiError(400, "Post title cannot exceed 200 characters");
  }

  // Process Category and Custom Category
  const { categoryId, customCategory: finalCustomCategory } = await processCategoryAndCustom(
    category,
    customCategory
  );

  // Process Topics & Tags
  const rawTopicsInput = topics || tags || [];
  const { tagObjectIds, cleanTopicNames } = await processTopicsAndTags(rawTopicsInput);

  const generatedSlug = slugify(title, { lower: true, strict: true }) + "-" + Date.now().toString().slice(-4);

  let postFeaturedImage = featuredImage;
  if (req.file) {
    const uploadRes = await uploadToCloudinary(req.file.path, "posts", {
      protocol: req.protocol,
      host: req.get("host"),
    });
    postFeaturedImage = uploadRes?.secure_url || postFeaturedImage;
  }

  const post = await Post.create({
    title: title.trim(),
    slug: generatedSlug,
    excerpt: excerpt ? excerpt.trim().slice(0, 500) : title.trim(),
    featuredImage: postFeaturedImage,
    readingTime: calculateReadingTime(excerpt || title),
    author: req.user.id,
    category: categoryId,
    customCategory: finalCustomCategory,
    topics: cleanTopicNames,
    tags: tagObjectIds,
    status: ["published", "draft", "scheduled"].includes(status) ? status : "draft",
    seoTitle: seoTitle ? seoTitle.trim().slice(0, 100) : title.trim(),
    seoDescription: seoDescription ? seoDescription.trim().slice(0, 200) : (excerpt || title).trim(),
    canonicalUrl,
    scheduledAt,
    publishedAt: status === "published" ? new Date() : null,
  });

  // Update Category & Tag post counts
  await Category.findByIdAndUpdate(categoryId, { $inc: { postCount: 1 } });
  if (tagObjectIds.length > 0) {
    await Tag.updateMany({ _id: { $in: tagObjectIds } }, { $inc: { postCount: 1 } });
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

  if (status) {
    query.status = status;
  } else {
    query.status = "published";
  }

  if (featured === "true") {
    query.isFeatured = true;
  }

  if (category) {
    const safeCat = escapeRegex(category);
    const catObj = await Category.findOne({
      $or: [{ slug: category }, { name: new RegExp("^" + safeCat + "$", "i") }],
    });
    if (catObj) {
      query.$or = [
        { category: catObj._id },
        { customCategory: { $regex: new RegExp("^" + safeCat + "$", "i") } },
      ];
    } else {
      query.customCategory = { $regex: new RegExp("^" + safeCat + "$", "i") };
    }
  }

  if (tag) {
    const safeTag = escapeRegex(tag);
    const tagObj = await Tag.findOne({
      $or: [{ slug: tag }, { name: new RegExp("^" + safeTag + "$", "i") }],
    });
    if (tagObj) {
      query.$or = [
        { tags: tagObj._id },
        { topics: { $regex: new RegExp("^" + safeTag + "$", "i") } },
      ];
    } else {
      query.topics = { $regex: new RegExp("^" + safeTag + "$", "i") };
    }
  }

  if (author) {
    query.author = author;
  }

  if (search) {
    const safeSearch = escapeRegex(search);
    const searchRegex = new RegExp(safeSearch, "i");
    query.$or = [
      { title: searchRegex },
      { excerpt: searchRegex },
      { customCategory: searchRegex },
      { topics: searchRegex },
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

  const {
    title,
    excerpt,
    featuredImage,
    category,
    customCategory,
    tags,
    topics,
    status,
    seoTitle,
    seoDescription,
    canonicalUrl,
    isFeatured,
  } = req.body;

  if (title && title !== post.title) {
    if (title.trim().length > 200) {
      throw new ApiError(400, "Post title cannot exceed 200 characters");
    }
    post.title = title.trim();
    post.slug = slugify(title, { lower: true, strict: true }) + "-" + Date.now().toString().slice(-4);
  }


  if (category) {
    const { categoryId, customCategory: finalCustomCategory } = await processCategoryAndCustom(
      category,
      customCategory
    );
    post.category = categoryId;
    post.customCategory = finalCustomCategory;
  }

  if (topics || tags) {
    const rawTopicsInput = topics || tags || [];
    const { tagObjectIds, cleanTopicNames } = await processTopicsAndTags(rawTopicsInput);
    post.tags = tagObjectIds;
    post.topics = cleanTopicNames;
  }

  if (excerpt !== undefined) post.excerpt = String(excerpt).trim().slice(0, 500);

  if (req.file) {
    if (post.featuredImage) {
      await deleteFromCloudinary(post.featuredImage);
    }
    const uploadRes = await uploadToCloudinary(req.file.path, "posts", {
      protocol: req.protocol,
      host: req.get("host"),
    });
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
    if (post.featuredImage) {
      await deleteFromCloudinary(post.featuredImage);
    }
    await post.deleteOne();
    res.status(200).json(new ApiResponse(200, {}, "Post permanently deleted"));
  } else {
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
    featuredImage: post.featuredImage,
    readingTime: post.readingTime,
    author: req.user.id,
    category: post.category,
    customCategory: post.customCategory,
    topics: post.topics,
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
