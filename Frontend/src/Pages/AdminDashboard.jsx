import React, { useState, useEffect } from "react";
import { toast } from "../context/ToastContext";
import { adminApi, reportApi, contactApi, notificationApi } from "../api/commentInteractionApi";
import { categoryApi, tagApi } from "../api/categoryTagApi";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminOverview from "../components/admin/AdminOverview";
import AdminAnalytics from "../components/admin/AdminAnalytics";
import AdminPosts from "../components/admin/AdminPosts";
import AdminCategories from "../components/admin/AdminCategories";
import AdminTags from "../components/admin/AdminTags";
import AdminFeatured from "../components/admin/AdminFeatured";
import AdminUsers from "../components/admin/AdminUsers";
import AdminComments from "../components/admin/AdminComments";
import AdminReports from "../components/admin/AdminReports";
import AdminSupport from "../components/admin/AdminSupport";
import AdminNewsletter from "../components/admin/AdminNewsletter";
import AdminProfile from "../components/admin/AdminProfile";
import AdminSuperAdminManagement from "../components/admin/AdminSuperAdminManagement";
import AdminSystemSettings from "../components/admin/AdminSystemSettings";
import AdminSystemHealth from "../components/admin/AdminSystemHealth";
import NotificationDrawer from "../components/NotificationDrawer";
import { CardSkeleton } from "../components/SkeletonLoader";
import SEO from "../components/SEO";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [reports, setReports] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [comments, setComments] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await adminApi.getStats();
      setStats(res.data.stats || null);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await adminApi.getUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await adminApi.getAdminPosts();
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getCategories();
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await tagApi.getTags();
      setTags(res.data.tags || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await reportApi.getReports();
      setReports(res.data.reports || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await contactApi.getMessages();
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getNotifications();
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchUsers(),
      fetchPosts(),
      fetchCategories(),
      fetchTags(),
      fetchReports(),
      fetchMessages(),
      fetchNotifications(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Action Handlers
  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminApi.updateUserRole(userId, { role: newRole });
      toast.success("User role updated");
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await adminApi.toggleUserStatus(userId);
      toast.info(res.message);
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user account?")) {
      try {
        await adminApi.deleteUser(userId);
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleToggleFeature = async (postId) => {
    try {
      const res = await adminApi.toggleFeaturedPost(postId);
      toast.success(res.message);
      fetchPosts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this publication?")) {
      try {
        await adminApi.deletePost(postId);
        toast.success("Post deleted");
        fetchPosts();
      } catch (err) {
        toast.error(err.message || "Failed to delete post");
      }
    }
  };

  const tabTitles = {
    overview: { title: "Dashboard Overview", subtitle: "Manage and monitor your publishing platform health" },
    analytics: { title: "Analytics & Performance", subtitle: "In-depth traffic, engagement, and readership statistics" },
    posts: { title: "Article Content Moderation", subtitle: "Review, edit, feature, or remove platform posts" },
    categories: { title: "Taxonomy & Categories", subtitle: "Manage topic hierarchy and category branding" },
    tags: { title: "Tag Taxonomy", subtitle: "Manage story tags and article topics" },
    featured: { title: "Featured Content Manager", subtitle: "Manage homepage hero slider and highlight stories" },
    users: { title: "User Account Management", subtitle: "Manage registered members, authors, and account roles" },
    comments: { title: "Comment Moderation", subtitle: "Review and moderate user discussion comments" },
    reports: { title: "Moderation Reports Queue", subtitle: "Resolve user flag reports on posts and comments" },
    support: { title: "Support & Contact Inbox", subtitle: "Respond to user contact form inquiries" },
    newsletter: { title: "Newsletter Subscribers", subtitle: "Manage platform newsletter readership list" },
    profile: { title: "Admin Account & Security", subtitle: "Manage your admin profile settings and security" },
    admins: { title: "Administrator Roster", subtitle: "Manage system administrators and account privileges" },
    roles: { title: "Roles & Permissions", subtitle: "Inspect platform role-based access control matrix" },
    "audit-logs": { title: "Audit Trail & System Logs", subtitle: "Track administrator activities and system events" },
    "system-settings": { title: "Global Site Settings", subtitle: "Configure platform behavior and general options" },
    "security-settings": { title: "System Security Policies", subtitle: "Manage authentication and system security" },
    "system-health": { title: "System Health & Infrastructure", subtitle: "Monitor core database, storage, auth, and API health status" },
    maintenance: { title: "Platform Maintenance Control", subtitle: "Manage platform maintenance status and banners" },
  };

  const currentTabInfo = tabTitles[activeTab] || tabTitles.overview;
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <SEO title="Admin Console" url="/admin" noindex={true} />
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. MAIN ADMIN WORKSPACE */}
      <div style={{ flexGrow: 1, marginLeft: "250px", display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* TOP HEADER */}
        <AdminHeader
          title={currentTabInfo.title}
          subtitle={currentTabInfo.subtitle}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        {/* WORKSPACE CONTENT AREA */}
        <main style={{ padding: "2rem", flexGrow: 1 }}>
          {loading ? (
            <CardSkeleton />
          ) : (
            <>
              {activeTab === "overview" && (
                <AdminOverview
                  stats={stats}
                  recentPosts={posts}
                  reports={reports}
                  users={users}
                  onSelectTab={setActiveTab}
                  onToggleFeature={handleToggleFeature}
                />
              )}

              {activeTab === "analytics" && <AdminAnalytics stats={stats} posts={posts} />}

              {activeTab === "posts" && (
                <AdminPosts
                  posts={posts}
                  onToggleFeature={handleToggleFeature}
                  onDeletePost={handleDeletePost}
                />
              )}

              {activeTab === "categories" && (
                <AdminCategories categories={categories} onRefresh={fetchCategories} />
              )}

              {activeTab === "tags" && (
                <AdminTags tags={tags} onRefresh={fetchTags} />
              )}

              {activeTab === "featured" && (
                <AdminFeatured posts={posts} onToggleFeature={handleToggleFeature} />
              )}

              {activeTab === "users" && (
                <AdminUsers
                  users={users}
                  onRoleChange={handleRoleChange}
                  onToggleStatus={handleToggleStatus}
                  onDeleteUser={handleDeleteUser}
                  onRefresh={fetchUsers}
                />
              )}

              {activeTab === "comments" && (
                <AdminComments comments={comments} onDeleteComment={() => {}} />
              )}

              {activeTab === "reports" && (
                <AdminReports reports={reports} onRefresh={fetchReports} />
              )}

              {activeTab === "support" && (
                <AdminSupport messages={messages} onRefresh={fetchMessages} />
              )}

              {activeTab === "newsletter" && (
                <AdminNewsletter subscribers={subscribers} />
              )}

              {["admins", "roles", "audit-logs"].includes(activeTab) && (
                <AdminSuperAdminManagement activeSubTab={activeTab} users={users} onRefresh={fetchUsers} />
              )}

              {["system-settings", "security-settings", "maintenance"].includes(activeTab) && (
                <AdminSystemSettings activeSubTab={activeTab} />
              )}

              {activeTab === "system-health" && <AdminSystemHealth />}

              {activeTab === "profile" && <AdminProfile />}
            </>
          )}
        </main>
      </div>

      {/* NOTIFICATIONS DRAWER */}
      <NotificationDrawer
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onRefresh={fetchNotifications}
      />

      <style>{`
        @media (max-width: 991px) {
          main {
            padding: 1.25rem !important;
          }
          div[style*="marginLeft: 250px"] {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
