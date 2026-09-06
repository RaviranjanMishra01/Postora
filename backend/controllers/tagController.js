const Tag = require("../models/Tag");
const Post = require("../models/Post");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const slugify = require("slugify");

// @desc Get all tags
// @route GET /api/v1/tags
const getTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find().sort({ postCount: -1, name: 1 });
  res.status(200).json(new ApiResponse(200, { tags }, "Tags fetched"));
});

// @desc Get popular tags
// @route GET /api/v1/tags/popular
const getPopularTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find().sort({ postCount: -1 }).limit(10);
  res.status(200).json(new ApiResponse(200, { tags }, "Popular tags fetched"));
});

// @desc Get tag by slug with posts
// @route GET /api/v1/tags/:slug
const getTagBySlug = asyncHandler(async (req, res) => {
  const tag = await Tag.findOne({ slug: req.params.slug });
  if (!tag) throw new ApiError(404, "Tag not found");

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 6;
  const startIndex = (page - 1) * limit;

  const total = await Post.countDocuments({ tags: tag._id, status: "published" });
  const posts = await Post.find({ tags: tag._id, status: "published" })
    .populate("author", "name username avatar")
    .populate("category", "name slug")
    .populate("tags", "name slug")
    .sort({ publishedAt: -1 })
    .skip(startIndex)
    .limit(limit);

  res.status(200).json(
    new ApiResponse(
      200,
      { tag, posts, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
      "Tag details fetched"
    )
  );
});

// @desc Create Tag
// @route POST /api/v1/tags
const createTag = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new ApiError(400, "Tag name is required");

  const slug = slugify(name, { lower: true, strict: true });
  const existing = await Tag.findOne({ slug });
  if (existing) return res.status(200).json(new ApiResponse(200, { tag: existing }, "Tag exists"));

  const tag = await Tag.create({ name, slug });
  res.status(201).json(new ApiResponse(201, { tag }, "Tag created successfully"));
});

// @desc Delete Tag
// @route DELETE /api/v1/tags/:id
const deleteTag = asyncHandler(async (req, res) => {
  await Tag.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, "Tag deleted successfully"));
});

module.exports = {
  getTags,
  getPopularTags,
  getTagBySlug,
  createTag,
  deleteTag,
};
