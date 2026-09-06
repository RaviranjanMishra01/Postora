const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      unique: true,
      index: true,
    },
    pageViews: {
      type: Number,
      default: 0,
    },
    uniqueVisitors: {
      type: Number,
      default: 0,
    },
    trafficSources: {
      direct: { type: Number, default: 0 },
      google: { type: Number, default: 0 },
      social: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Analytics = mongoose.models.Analytics || mongoose.model("Analytics", analyticsSchema);
module.exports = Analytics;
