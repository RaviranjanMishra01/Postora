const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const fs = require("fs");

const errorHandler = require("./middleware/errorHandler");
const customMongoSanitize = require("./middleware/mongoSanitize");
const { apiLimiter } = require("./middleware/rateLimiter");

// Route imports
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const categoryRoutes = require("./routes/category.routes");
const tagRoutes = require("./routes/tag.routes");
const commentRoutes = require("./routes/comment.routes");
const interactionRoutes = require("./routes/interaction.routes");
const followRoutes = require("./routes/follow.routes");
const notificationRoutes = require("./routes/notification.routes");
const searchRoutes = require("./routes/search.routes");
const adminRoutes = require("./routes/admin.routes");
const reportRoutes = require("./routes/report.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const newsletterRoutes = require("./routes/newsletter.routes");
const contactRoutes = require("./routes/contact.routes");
const seoRoutes = require("./routes/seo.routes");

const app = express();

// Enable trust proxy for production reverse proxies (Render, Vercel, Nginx, Cloudflare)
app.set("trust proxy", 1);

// Security & Optimization Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(customMongoSanitize);
app.use(compression());
app.use(cookieParser());

// CORS configuration allowing dynamic origin mirroring with credentials support across Vercel, Render, & local testing
app.use(
  cors({
    origin: function (origin, callback) {
      // Dynamically echo requesting origin to support multi-domain deployments (Vercel previews, custom domains, local)
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiter for general API routes
app.use("/api", apiLimiter);

// Ensure static uploads directory exists and serve files
const uploadsDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Mount API Endpoints
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/interactions", interactionRoutes);
app.use("/api/v1/follows", followRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/newsletter", newsletterRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/", seoRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "MERN Blog API is healthy and operational", timestamp: new Date() });
});

// Centralized error handling
app.use(errorHandler);

module.exports = app;