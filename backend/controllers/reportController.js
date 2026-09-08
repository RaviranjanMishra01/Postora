const Report = require("../models/Report");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const { isValidObjectId } = require("../middleware/validate");

// @desc Submit a report for post/comment/user
// @route POST /api/v1/reports
const submitReport = asyncHandler(async (req, res) => {
  const { targetType, targetId, reason, description } = req.body;

  if (!targetType || !targetId || !reason) {
    throw new ApiError(400, "Target type, target ID, and reason are required");
  }

  const allowedTargetTypes = ["post", "comment", "user"];
  if (!allowedTargetTypes.includes(targetType.toLowerCase())) {
    throw new ApiError(400, "Invalid report target type. Must be 'post', 'comment', or 'user'");
  }

  if (!isValidObjectId(targetId)) {
    throw new ApiError(400, "Invalid target ID format");
  }

  // Business validation: verify target exists in database
  let targetExists = false;
  if (targetType.toLowerCase() === "post") {
    targetExists = await Post.exists({ _id: targetId });
  } else if (targetType.toLowerCase() === "comment") {
    targetExists = await Comment.exists({ _id: targetId });
  } else if (targetType.toLowerCase() === "user") {
    const User = require("../models/User");
    targetExists = await User.exists({ _id: targetId });
  }

  if (!targetExists) {
    throw new ApiError(404, "Reported target resource does not exist");
  }

  const report = await Report.create({
    reporter: req.user.id,
    targetType: targetType.toLowerCase(),
    targetId,
    reason: String(reason).trim().slice(0, 200),
    description: description ? String(description).trim().slice(0, 1000) : "",
  });

  res.status(201).json(new ApiResponse(201, { report }, "Report submitted for admin review"));
});

// @desc Get all reports for Admin moderation
// @route GET /api/v1/reports
const getReports = asyncHandler(async (req, res) => {
  const { status = "pending" } = req.query;
  const reports = await Report.find({ status })
    .populate("reporter", "name username email")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, { reports }, "Reports list fetched"));
});

// @desc Review / Resolve Report
// @route PUT /api/v1/reports/:id/resolve
const resolveReport = asyncHandler(async (req, res) => {
  const { action } = req.body; // 'remove_content' or 'dismiss'
  const report = await Report.findById(req.params.id);

  if (!report) throw new ApiError(404, "Report not found");

  if (action === "remove_content") {
    if (report.targetType === "comment") {
      await Comment.findByIdAndDelete(report.targetId);
    } else if (report.targetType === "post") {
      await Post.findByIdAndUpdate(report.targetId, { status: "trash" });
    }
  }

  report.status = action === "dismiss" ? "rejected" : "resolved";
  await report.save();

  res.status(200).json(new ApiResponse(200, { report }, `Report ${report.status}`));
});

module.exports = { submitReport, getReports, resolveReport };
