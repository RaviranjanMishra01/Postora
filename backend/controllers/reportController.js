const Report = require("../models/Report");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// @desc Submit a report for post/comment/user
// @route POST /api/v1/reports
const submitReport = asyncHandler(async (req, res) => {
  const { targetType, targetId, reason, description } = req.body;

  if (!targetType || !targetId || !reason) {
    throw new ApiError(400, "Target type, target ID, and reason are required");
  }

  const report = await Report.create({
    reporter: req.user.id,
    targetType,
    targetId,
    reason,
    description: description || "",
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
