import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages
import Home from "../Pages/Home";
import PostDetail from "../Pages/PostDetail";
import CreateEditPost from "../Pages/CreateEditPost";
import CategoryDetail from "../Pages/CategoryDetail";
import CategoriesPage from "../Pages/CategoriesPage";
import TagDetail from "../Pages/TagDetail";
import AuthorProfile from "../Pages/AuthorProfile";
import UserProfile from "../Pages/UserProfile";
import Dashboard from "../Pages/Dashbord";
import BookmarksPage from "../Pages/BookmarksPage";
import AuthorFeedPage from "../Pages/AuthorFeedPage";
import SearchPage from "../Pages/SearchPage";
import AdminDashboard from "../Pages/AdminDashboard";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import ForgotPassword from "../Pages/ForgotPassword";
import AdminLogin from "../Pages/AdminLogin";
import SuperAdminLogin from "../Pages/SuperAdminLogin";
import AdminForgotPassword from "../Pages/AdminForgotPassword";
import SuperAdminForgotPassword from "../Pages/SuperAdminForgotPassword";
import {
  AboutPage,
  ContactPage,
  PrivacyPage,
  TermsPage,
  CookiePage,
  DisclaimerPage,
} from "../Pages/StaticPages";

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

const AuthorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/admin/login" replace />;
  const role = user.role?.toLowerCase();
  return (role === "admin" || role === "superadmin") ? children : <Navigate to="/admin/login" replace />;
};

const SuperAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/super-admin/login" replace />;
  const role = user.role?.toLowerCase();
  return role === "superadmin" ? children : <Navigate to="/super-admin/login" replace />;
};

// Guest Only Route Guard (Prevents logged in users from seeing login forms again)
const GuestOnlyRoute = ({ children, portalType = "user" }) => {
  const { user, loading } = useAuth();
  if (loading) return null;

  if (user) {
    const role = user.role?.toLowerCase();
    if (role === "superadmin") {
      return <Navigate to="/super-admin/dashboard" replace />;
    }
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Normal USER or AUTHOR
    if (portalType === "admin" || portalType === "superadmin") {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/post/:slug" element={<PostDetail />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/category/:slug" element={<CategoryDetail />} />
      <Route path="/tag/:slug" element={<TagDetail />} />
      <Route path="/author/:username" element={<AuthorProfile />} />
      <Route path="/search" element={<SearchPage />} />

      {/* User Auth Routes */}
      <Route path="/login" element={<GuestOnlyRoute portalType="user"><Login /></GuestOnlyRoute>} />
      <Route path="/register" element={<GuestOnlyRoute portalType="user"><Register /></GuestOnlyRoute>} />
      <Route path="/forgot-password" element={<GuestOnlyRoute portalType="user"><ForgotPassword /></GuestOnlyRoute>} />

      {/* Dedicated Admin & Super Admin Auth Routes */}
      <Route path="/admin/login" element={<GuestOnlyRoute portalType="admin"><AdminLogin /></GuestOnlyRoute>} />
      <Route path="/admin/forgot-password" element={<GuestOnlyRoute portalType="admin"><AdminForgotPassword /></GuestOnlyRoute>} />
      <Route path="/super-admin/login" element={<GuestOnlyRoute portalType="superadmin"><SuperAdminLogin /></GuestOnlyRoute>} />
      <Route path="/super-admin/forgot-password" element={<GuestOnlyRoute portalType="superadmin"><SuperAdminForgotPassword /></GuestOnlyRoute>} />

      {/* Static Pages */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/cookie-policy" element={<CookiePage />} />
      <Route path="/disclaimer" element={<DisclaimerPage />} />

      {/* User Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
      <Route path="/feed" element={<ProtectedRoute><AuthorFeedPage /></ProtectedRoute>} />

      {/* Author Protected Routes */}
      <Route path="/create-post" element={<AuthorRoute><CreateEditPost /></AuthorRoute>} />
      <Route path="/edit-post/:id" element={<AuthorRoute><CreateEditPost /></AuthorRoute>} />

      {/* Admin Console Protected Routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      {/* Super Admin Console Protected Routes */}
      <Route path="/super-admin" element={<SuperAdminRoute><AdminDashboard /></SuperAdminRoute>} />
      <Route path="/super-admin/dashboard" element={<SuperAdminRoute><AdminDashboard /></SuperAdminRoute>} />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
