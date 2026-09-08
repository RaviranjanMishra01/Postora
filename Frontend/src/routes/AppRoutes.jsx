import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages
import Home from "../pages/Home";
import PostDetail from "../pages/PostDetail";
import CreateEditPost from "../pages/CreateEditPost";
import CategoryDetail from "../pages/CategoryDetail";
import CategoriesPage from "../pages/CategoriesPage";
import TagDetail from "../pages/TagDetail";
import AuthorProfile from "../pages/AuthorProfile";
import UserProfile from "../pages/UserProfile";
import Dashboard from "../pages/Dashbord";
import BookmarksPage from "../pages/BookmarksPage";
import AuthorFeedPage from "../pages/AuthorFeedPage";
import SearchPage from "../pages/SearchPage";
import AdminDashboard from "../pages/AdminDashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminLogin from "../pages/AdminLogin";
import SuperAdminLogin from "../pages/SuperAdminLogin";
import AdminForgotPassword from "../pages/AdminForgotPassword";
import SuperAdminForgotPassword from "../pages/SuperAdminForgotPassword";
import {
  AboutPage,
  ContactPage,
  PrivacyPage,
  TermsPage,
  CookiePage,
  DisclaimerPage,
} from "../pages/StaticPages";

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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dedicated Admin & Super Admin Auth Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
      <Route path="/super-admin/login" element={<SuperAdminLogin />} />
      <Route path="/super-admin/forgot-password" element={<SuperAdminForgotPassword />} />

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
