# 🚀 Postora - Production-Ready MERN Blogging & Editorial Platform

Postora is a modern, scalable, high-performance full-stack MERN (MongoDB, Express.js, React, Node.js) blogging and editorial publishing platform. It features rich media support, role-based administration, Google OAuth authentication, interaction systems (likes, bookmarks, comments, author follows), rate limiting, robust security practices, and full deployment readiness for Render and Vercel.

---

## 🌟 Key Features

### 🎨 Frontend (React + Vite)
- **Editorial UI Design**: Custom modern Postora editorial design with dark/light themes, dynamic animations (Framer Motion), and responsive layouts.
- **Authentication**: Email/Password authentication & Google One-Tap / OAuth integration.
- **Article Reader & Editor**: Rich text article viewer, read-time calculation, category/tag filtering, and search functionality.
- **Social & Community**: Follow/unfollow authors, like posts, bookmark articles, and nested commenting system.
- **User Dashboard & Profile**: Personal profile customization, reading history, saved bookmarks, and notification center.
- **Admin & SuperAdmin Portal**: Advanced management suite for posts, categories, tags, user permissions, platform analytics, and user reports.

### 🛡️ Backend (Node.js + Express + MongoDB)
- **Modular Architecture**: RESTful API design with clean separation of controllers, services, models, routes, and middleware.
- **Security & Hardening**:
  - `helmet` security headers & Content Security Policy (CSP).
  - `express-rate-limit` DDoS and brute-force protection (API, Auth, Comment limits).
  - `express-mongo-sanitize` against NoSQL injection.
  - HTML sanitization (`sanitize-html`) to prevent XSS attacks.
  - Dynamic multi-origin CORS support with credentials (`Vercel`, `Render`, `localhost`).
  - `trust proxy` configuration for cloud reverse proxies.
- **Role-Based Access Control (RBAC)**: Strict authorization guards (`USER`, `ADMIN`, `SUPER_ADMIN`).
- **Media Uploads**: File upload handling via `multer` with file-type validation & static asset serving.
- **SEO & RSS Feeds**: Dynamic XML sitemap generator (`/sitemap.xml`) and RSS feed endpoint (`/feed.xml`).
- **Automated Testing**: Integrated API verification test suite (`npm test`).

---

## 📁 Repository Structure

```text
hiii/
├── Frontend/               # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── api/            # Axios API instances & service functions
│   │   ├── components/     # Reusable UI components & Admin widgets
│   │   ├── context/        # Auth & Toast context providers
│   │   ├── Pages/          # Application views & pages
│   │   └── routes/         # React Router v7 routes setup
│   ├── .env.example        # Example environment configuration for Frontend
│   ├── package.json
│   └── vite.config.js
│
└── backend/                # Node.js + Express + MongoDB Backend Service
    ├── controllers/        # Express request controllers
    ├── DB/                 # MongoDB Mongoose connection & initial seed logic
    ├── middleware/         # Auth, Rate Limiter, Error Handler, Uploads, Sanitization
    ├── models/             # Mongoose Data Models (User, Post, Comment, etc.)
    ├── routes/             # Express API v1 Route endpoints
    ├── tests/              # Automated API test suite (`apiTest.js`)
    ├── utils/              # Helper utilities (ApiError, ApiResponse, readingTime)
    ├── .env.example        # Example environment configuration for Backend
    ├── index.js            # Express app middleware & route initialization
    ├── server.js           # Server entry point with graceful shutdown
    └── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router v7, Axios, Lucide React, Framer Motion, React Toastify |
| **Backend** | Node.js, Express.js 5, Mongoose 9 (MongoDB Atlas), JWT, bcryptjs, Cookie Parser |
| **Security** | Helmet, Express Rate Limit, Mongo Sanitize, Sanitize-HTML, CORS |
| **Media & Email**| Multer, Nodemailer |
| **Deployment** | Render (Backend API), Vercel (Frontend SPA) |

---

## ⚙️ Environment Variables Setup

### Backend Environment Variables (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and update the values:

```env
PORT=3000
NODE_ENV=production
MONGO_URI=mongodb+srv://<db_user>:<db_password>@cluster.mongodb.net/postora?appName=Postora
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend.vercel.app,http://localhost:5173

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# SMTP Email Setup
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_PASS=your_app_password
```

### Frontend Environment Variables (`Frontend/.env`)

Copy `Frontend/.env.example` to `Frontend/.env` and update the values:

```env
VITE_API_URL=https://your-backend.onrender.com/api/v1
VITE_API=https://your-backend.onrender.com/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/RaviranjanMishra01/Postora.git
cd Postora
```

### 2. Setup & Start Backend
```bash
cd backend
npm install
npm run dev
```
*Backend will run on `http://localhost:3000`*

### 3. Setup & Start Frontend
```bash
cd ../Frontend
npm install
npm run dev
```
*Frontend will run on `http://localhost:5173`*

---

## 🧪 Testing

To run the automated backend API verification tests:

```bash
cd backend
npm test
```

---

## ☁️ Deployment Instructions

### Deploying Backend to **Render.com**
1. Create a new **Web Service** on Render connected to your GitHub repo.
2. Set **Root Directory** to `backend`.
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node server.js`
5. Under **Environment Variables**, add `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL`, etc.
6. Click **Deploy**.

### Deploying Frontend to **Vercel**
1. Import your GitHub repo on Vercel.
2. Set **Root Directory** to `Frontend`.
3. Framework Preset: **Vite**.
4. Under **Environment Variables**, add `VITE_API_URL` pointing to your Render backend URL (`https://your-backend.onrender.com/api/v1`).
5. Click **Deploy**.

---

## 📜 License

This project is licensed under the **ISC License**. Created with ❤️ by Raviranjan Mishra.
