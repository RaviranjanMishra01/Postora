const Contact = require("../models/Contact");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const { isValidEmail } = require("../middleware/validate");

// @desc Submit Contact Message
// @route POST /api/v1/contact
const sendMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    throw new ApiError(400, "Please fill out all contact fields");
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, "Please enter a valid email address");
  }

  const cleanName = String(name).trim().slice(0, 100);
  const cleanSubject = String(subject).trim().slice(0, 200);
  const cleanMessage = String(message).trim().slice(0, 5000);

  if (!cleanName || !cleanSubject || !cleanMessage) {
    throw new ApiError(400, "Contact form fields cannot be blank");
  }

  const contact = await Contact.create({
    name: cleanName,
    email: email.trim().toLowerCase(),
    subject: cleanSubject,
    message: cleanMessage,
  });

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
