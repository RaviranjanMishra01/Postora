const Category = require("../models/Category");
const Post = require("../models/Post");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const slugify = require("slugify");

// @desc Get all categories
// @route GET /api/v1/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json(new ApiResponse(200, { categories }, "Categories fetched"));
});

// @desc Get category by slug with pagination
// @route GET /api/v1/categories/:slug
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) throw new ApiError(404, "Category not found");

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 6;
  const startIndex = (page - 1) * limit;

  const total = await Post.countDocuments({ category: category._id, status: "published" });
  const posts = await Post.find({ category: category._id, status: "published" })
    .populate("author", "name username avatar")
    .populate("category", "name slug")
    .populate("tags", "name slug")
    .sort({ publishedAt: -1 })
    .skip(startIndex)
    .limit(limit);

  res.status(200).json(
    new ApiResponse(
      200,
      { category, posts, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
      "Category details fetched"
    )
  );
});

// @desc Create Category (Author / Admin)
// @route POST /api/v1/categories
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;
  if (!name) throw new ApiError(400, "Category name is required");

  const slug = slugify(name, { lower: true, strict: true });
  const existing = await Category.findOne({ slug });
  if (existing) throw new ApiError(400, "Category already exists");

  const category = await Category.create({
    name,
    slug,
    description,
    image: image || (req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : undefined),
  });

  res.status(201).json(new ApiResponse(201, { category }, "Category created successfully"));
});

// @desc Update Category
// @route PUT /api/v1/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");

  if (name) {
    category.name = name;
    category.slug = slugify(name, { lower: true, strict: true });
  }
  if (description !== undefined) category.description = description;
  if (image) category.image = image;
  if (req.file) category.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  await category.save();
  res.status(200).json(new ApiResponse(200, { category }, "Category updated successfully"));
});

// @desc Delete Category
// @route DELETE /api/v1/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, "Category deleted successfully"));
});

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
