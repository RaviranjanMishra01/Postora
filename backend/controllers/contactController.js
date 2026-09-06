const Contact = require("../models/Contact");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// @desc Submit Contact Message
// @route POST /api/v1/contact
const sendMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    throw new ApiError(400, "Please fill out all contact fields");
  }

  const contact = await Contact.create({ name, email, subject, message });

  res.status(201).json(new ApiResponse(201, { contact }, "Your message has been sent successfully!"));
});

// @desc Get Contact Messages for Admin Inbox
// @route GET /api/v1/contact
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, { messages }, "Inbox messages fetched"));
});

// @desc Mark Message as Resolved
// @route PUT /api/v1/contact/:id/resolve
const markResolved = asyncHandler(async (req, res) => {
  const message = await Contact.findByIdAndUpdate(
    req.params.id,
    { isResolved: true },
    { new: true }
  );
  res.status(200).json(new ApiResponse(200, { message }, "Message marked as resolved"));
});

// @desc Delete Message
// @route DELETE /api/v1/contact/:id
const deleteMessage = asyncHandler(async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, "Message deleted"));
});

module.exports = { sendMessage, getMessages, markResolved, deleteMessage };
