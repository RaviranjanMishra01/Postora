# 🛡️ Postora Backend API

High-performance, secure Express 5 & MongoDB REST API service for the Postora MERN Editorial Platform.

## 🚀 Features

- **Express 5 & Mongoose 9**: Modern async/await architecture with centralized error handling.
- **Security & Protection**:
  - Helmet security headers
  - Express Rate Limiting (API, Auth, Comment limits)
  - Express Mongo Sanitize (NoSQL Injection defense)
  - Dynamic multi-origin CORS support with credentials
  - Reverse proxy trust proxy support (`trust proxy = 1`)
- **Authentication**: JWT authentication with HTTP-only cookies, Bcrypt password hashing, & Google OAuth identity verification.
- **Role-Based Access Control**: Strict `USER`, `ADMIN`, and `SUPER_ADMIN` role permissions.
- **Media Uploads**: Multer storage middleware with 5MB image limit and mime-type validation.
- **Sitemap & RSS Feeds**: Automatic XML sitemap generation and RSS feed support.
- **Graceful Shutdown**: Production signal handling (`SIGTERM`, `SIGINT`, `unhandledRejection`, `uncaughtException`).

---

## 📁 Directory Structure

```text
backend/
├── controllers/      # Route controllers (Auth, Posts, Categories, Users, etc.)
├── DB/               # Database connection logic & automatic data seeders
├── middleware/       # Auth guard, rate limiters, upload handler, sanitizer, error handler
├── models/           # Mongoose schemas (User, Post, Comment, Like, Bookmark, etc.)
├── public/           # Static uploads directory (`/uploads`)
├── routes/           # API endpoints (/api/v1/...)
├── tests/            # Automated test runner (`apiTest.js`)
├── utils/            # Helper utilities (ApiError, ApiResponse, readingTime)
├── index.js          # Express app initialization
├── server.js         # HTTP server entry point
└── package.json
```

---

## ⚙️ Environment Variables (`.env`)

See `.env.example` for reference:

```env
PORT=3000
NODE_ENV=production
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/postora?appName=Postora
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend.vercel.app

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_PASS=your_email_app_password
```

---

## ⚡ Scripts

- `npm run dev` - Start dev server with nodemon
- `npm start` - Start production server
- `npm test` - Run automated API verification tests
