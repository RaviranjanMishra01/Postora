const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");
const ApiError = require("../utils/ApiError");

// Helper: Check valid 24-char hex MongoDB ObjectId
const isValidObjectId = (id) => {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
};

// Helper: Validate email format
const isValidEmail = (email) => {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return trimmed.length >= 5 && trimmed.length <= 254 && emailRegex.test(trimmed);
};

// Helper: Validate URL (http:// or https:// only)
const isValidUrl = (url) => {
  if (typeof url !== "string" || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (err) {
    return false;
  }
};

// Helper: Sanitize Rich Text HTML Content
const sanitizeRichText = (content) => {
  if (typeof content !== "string") return "";
  return sanitizeHtml(content, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "p", "a", "ul", "ol",
      "nl", "li", "b", "i", "strong", "em", "stroke", "code", "hr", "br", "div",
      "table", "thead", "caption", "tbody", "tr", "th", "td", "pre", "img", "span"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      span: ["style", "class"],
      div: ["style", "class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
  });
};

// Middleware: Validate MongoDB ObjectId parameter
const validateObjectIdParam = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !isValidObjectId(id)) {
      return next(new ApiError(400, `Invalid ${paramName} parameter format`));
    }
    next();
  };
};

// Middleware: Validate Pagination & Sorting parameters
const validatePagination = (defaultLimit = 10, maxLimit = 100) => {
  return (req, res, next) => {
    let { page, limit, sort } = req.query;

    page = parseInt(page, 10);
    if (isNaN(page) || page < 1) page = 1;

    limit = parseInt(limit, 10);
    if (isNaN(limit) || limit < 1) limit = defaultLimit;
    if (limit > maxLimit) limit = maxLimit;

    req.query.page = page;
    req.query.limit = limit;

    const allowedSortFields = ["latest", "oldest", "popular", "views", "likesCount", "createdAt"];
    if (sort && typeof sort === "string") {
      const cleanSort = sort.trim();
      if (!allowedSortFields.includes(cleanSort)) {
        req.query.sort = "latest";
      }
    } else {
      req.query.sort = "latest";
    }

    next();
  };
};

// Middleware: Mass Assignment Protection
const sanitizeMassAssignment = (allowedFields = []) => {
  return (req, res, next) => {
    if (req.body && typeof req.body === "object" && !Array.isArray(req.body)) {
      const sanitized = {};
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          sanitized[field] = req.body[field];
        }
      });
      req.body = sanitized;
    }
    next();
  };
};

// Helper: Safe Regex Escape
const escapeRegex = (string) => {
  if (typeof string !== "string") return "";
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

module.exports = {
  isValidObjectId,
  isValidEmail,
  isValidUrl,
  sanitizeRichText,
  validateObjectIdParam,
  validatePagination,
  sanitizeMassAssignment,
  escapeRegex,
};
