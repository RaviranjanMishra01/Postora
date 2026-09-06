const Notification = require("../models/Notification");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// @desc Get Notifications for logged in user
// @route GET /api/v1/notifications
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user.id })
    .populate("sender", "name username avatar")
    .populate("post", "title slug")
    .sort({ createdAt: -1 })
    .limit(20);

  const unreadCount = await Notification.countDocuments({
    recipient: req.user.id,
    isRead: false,
  });

  res.status(200).json(
    new ApiResponse(200, { notifications, unreadCount }, "Notifications fetched")
  );
});

// @desc Mark Notification as Read
// @route PUT /api/v1/notifications/:id/read
const markAsRead = asyncHandler(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.status(200).json(new ApiResponse(200, {}, "Marked as read"));
});

// @desc Mark All Notifications as Read
// @route PUT /api/v1/notifications/read-all
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user.id }, { isRead: true });
  res.status(200).json(new ApiResponse(200, {}, "All notifications marked as read"));
});

// @desc Delete Notification
// @route DELETE /api/v1/notifications/:id
const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, "Notification deleted"));
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
