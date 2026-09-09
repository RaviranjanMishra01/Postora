# 🎨 Postora Frontend (React + Vite)

Modern, responsive editorial SPA for the Postora MERN Blog platform built with React 19, Vite, and Lucide React.

## 🌟 Features

- **Carrino Editorial Theme**: Sleek UI design system with dark/light themes and custom CSS variables.
- **Dynamic Views**:
  - Home feed with featured posts, latest stories, category blocks.
  - Interactive Post Details with read time, views, likes, bookmarking, and nested comments.
  - Author profiles, follower/following sections, and inline profile settings.
  - Category and Tag discovery pages with search filtering.
  - Admin & SuperAdmin dashboard views for full site control.
- **Authentication Integration**: Login, Register, Password Reset, and Google One-Tap / OAuth sign-in.
- **Toast Notifications**: Smooth notification feedback via custom Toast Context.

---

## 📁 Directory Structure

```text
Frontend/
├── src/
│   ├── api/          # Axios instance and API call modules
│   ├── assets/       # Static icons and assets
│   ├── components/   # Post Cards, Hero sections, Admin widgets, Comment section
│   ├── context/      # AuthContext, ToastContext
│   ├── Pages/        # Main pages (Home, PostDetail, Profile, Admin Dashboard, etc.)
│   ├── routes/       # React Router setup (`AppRoutes.jsx`)
│   └── App.jsx       # Main App component
├── .env.example      # Example environment variables
├── package.json
└── vite.config.js
```

---

## ⚙️ Environment Variables (`.env`)

See `.env.example` for reference:

```env
VITE_API_URL=https://your-backend.onrender.com/api/v1
VITE_API=https://your-backend.onrender.com/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## ⚡ Scripts

- `npm run dev` - Start local development server with Vite
- `npm run build` - Build production bundle to `dist/`
- `npm run preview` - Preview production build locally
