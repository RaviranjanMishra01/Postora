const Post = require("../models/Post");
const User = require("../models/User");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { escapeRegex } = require("../middleware/validate");

// @desc Unified Search API for posts, authors, categories, and tags
// @route GET /api/v1/search
const searchAll = asyncHandler(async (req, res) => {
  let { q, category, tag, author, sort } = req.query;

  if (q && typeof q === "string") {
    q = q.trim().slice(0, 100);
  } else {
    q = null;
  }

  if (!q && !category && !tag && !author) {
    return res.status(200).json(new ApiResponse(200, { posts: [], authors: [], categories: [], tags: [] }));
  }

  const safeQ = q ? escapeRegex(q) : null;
  const searchRegex = safeQ ? new RegExp(safeQ, "i") : null;

  // Search Posts
  const postQuery = { status: "published" };
  if (searchRegex) {
    postQuery.$or = [
      { title: searchRegex },
      { excerpt: searchRegex },
      { customCategory: searchRegex },
      { topics: searchRegex },
    ];
  }

  if (category) {
    const safeCat = escapeRegex(category);
    const catObj = await Category.findOne({
      $or: [{ slug: category }, { name: new RegExp("^" + safeCat + "$", "i") }],
    });
    if (catObj) {
      postQuery.$or = [
        { category: catObj._id },
        { customCategory: { $regex: new RegExp("^" + safeCat + "$", "i") } },
      ];
    } else {
      postQuery.customCategory = { $regex: new RegExp("^" + safeCat + "$", "i") };
    }
  }

  if (tag) {
    const safeTag = escapeRegex(tag);
    const tagObj = await Tag.findOne({
      $or: [{ slug: tag }, { name: new RegExp("^" + safeTag + "$", "i") }],
    });
    if (tagObj) {
      postQuery.$or = [
        { tags: tagObj._id },
        { topics: { $regex: new RegExp("^" + safeTag + "$", "i") } },
      ];
    } else {
      postQuery.topics = { $regex: new RegExp("^" + safeTag + "$", "i") };
    }
  }

  if (author) {
    postQuery.author = author;
  }

  let sortOption = { publishedAt: -1 };
  if (sort === "popular" || sort === "views") sortOption = { views: -1 };
  if (sort === "likes") sortOption = { likesCount: -1 };

  const posts = await Post.find(postQuery)
    .populate("author", "name username avatar")
    .populate("category", "name slug")
    .populate("tags", "name slug")
    .sort(sortOption)
    .limit(10);

  let authors = [];
  let categories = [];
  let tags = [];

  if (searchRegex) {
    authors = await User.find({
      role: { $in: ["author", "admin", "superadmin"] },
      $or: [{ name: searchRegex }, { username: searchRegex }],
    })
      .select("name username avatar bio followersCount")
      .limit(5);

    categories = await Category.find({ name: searchRegex }).limit(5);
    tags = await Tag.find({ name: searchRegex }).limit(5);
  }

  res.status(200).json(
    new ApiResponse(200, { posts, authors, categories, tags }, "Search completed")
  );
});

// @desc Auto-complete suggestions for debounced search bar
// @route GET /api/v1/search/suggestions
const getSuggestions = asyncHandler(async (req, res) => {
  let { q } = req.query;
  if (!q || typeof q !== "string" || q.trim().length < 2) {
    return res.status(200).json(new ApiResponse(200, { suggestions: [] }));
  }

  const cleanQ = q.trim().slice(0, 100);
  const regex = new RegExp(escapeRegex(cleanQ), "i");
  const posts = await Post.find({
    $or: [{ title: regex }, { customCategory: regex }, { topics: regex }],
    status: "published",
  })
    .select("title slug")
    .limit(5);
  const tags = await Tag.find({ name: regex }).select("name slug").limit(3);

  const suggestions = [
    ...posts.map((p) => ({ type: "post", title: p.title, slug: p.slug })),
    ...tags.map((t) => ({ type: "tag", title: `#${t.name}`, slug: t.slug })),
  ];

  res.status(200).json(new ApiResponse(200, { suggestions }));
});

module.exports = { searchAll, getSuggestions };
