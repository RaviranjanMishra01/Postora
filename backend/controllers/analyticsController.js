const Analytics = require("../models/Analytics");
const Post = require("../models/Post");
const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// @desc Record daily page view
// @route POST /api/v1/analytics/view
const recordPageView = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const { source } = req.body; // direct, google, social, other

  let doc = await Analytics.findOne({ date: today });
  if (!doc) {
    doc = await Analytics.create({ date: today, pageViews: 1, uniqueVisitors: 1 });
  } else {
    doc.pageViews += 1;
    if (source && doc.trafficSources[source] !== undefined) {
      doc.trafficSources[source] += 1;
    } else {
      doc.trafficSources.direct += 1;
    }
    await doc.save();
  }

  res.status(200).json(new ApiResponse(200, {}, "Pageview recorded"));
});

// @desc Get traffic & performance analytics for Admin Dashboard
// @route GET /api/v1/analytics
const getAnalytics = asyncHandler(async (req, res) => {
  const analyticsData = await Analytics.find().sort({ date: -1 }).limit(30);

  const topPosts = await Post.find({ status: "published" })
    .populate("author", "name username")
    .sort({ views: -1 })
    .limit(5)
    .select("title views likesCount commentsCount slug");

  const topAuthors = await User.find({ role: { $in: ["author", "admin", "superadmin"] } })
    .sort({ followersCount: -1 })
    .limit(5)
    .select("name username avatar followersCount");

  res.status(200).json(
    new ApiResponse(200, { analytics: analyticsData.reverse(), topPosts, topAuthors }, "Analytics fetched")
  );
});

module.exports = { recordPageView, getAnalytics };
