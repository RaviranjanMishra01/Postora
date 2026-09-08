const Newsletter = require("../models/Newsletter");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendEmail");
const { isValidEmail } = require("../middleware/validate");

// @desc Subscribe to newsletter
// @route POST /api/v1/newsletter/subscribe
const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !isValidEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  const cleanEmail = email.trim().toLowerCase();
  let subscriber = await Newsletter.findOne({ email: cleanEmail });

  if (subscriber) {
    if (subscriber.active) {
      return res.status(200).json(new ApiResponse(200, {}, "You are already subscribed!"));
    }
    subscriber.active = true;
    await subscriber.save();
  } else {
    subscriber = await Newsletter.create({ email: email.toLowerCase() });
  }

  await sendEmail({
    to: email,
    subject: "Welcome to MERN Blog Newsletter!",
    text: "Thank you for subscribing to our weekly tech insights and articles.",
  });

  res.status(201).json(new ApiResponse(201, { subscriber }, "Subscribed successfully!"));
});

// @desc Unsubscribe from newsletter
// @route POST /api/v1/newsletter/unsubscribe
const unsubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !isValidEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }
  await Newsletter.findOneAndUpdate({ email: email.trim().toLowerCase() }, { active: false });
  res.status(200).json(new ApiResponse(200, {}, "Unsubscribed successfully"));
});

// @desc Get Subscribers List for Admin
// @route GET /api/v1/newsletter
const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Newsletter.find({ active: true }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, { subscribers }, "Subscribers fetched"));
});

module.exports = { subscribe, unsubscribe, getSubscribers };
