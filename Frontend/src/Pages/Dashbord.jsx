import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { interactionApi, followApi, notificationApi } from "../api/commentInteractionApi";
import { postApi } from "../api/postApi";

import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import SavedPostsPreview from "../components/dashboard/SavedPostsPreview";
import FollowingPreview from "../components/dashboard/FollowingPreview";
import MyPostsPreview from "../components/dashboard/MyPostsPreview";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");

  const [bookmarks, setBookmarks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);

  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingMyPosts, setLoadingMyPosts] = useState(false);

  const isAuthor = !!user;

  useEffect(() => {
    if (!user) return;

    // Fetch Bookmarks
    const fetchBookmarks = async () => {
      try {
        const res = await interactionApi.getBookmarks();
        setBookmarks(res.data?.bookmarks || []);
      } catch (err) {
        console.error("Error fetching bookmarks for dashboard:", err);
      } finally {
        setLoadingBookmarks(false);
      }
    };

    // Fetch Notifications
    const fetchNotifications = async () => {
      try {
        const res = await notificationApi.getNotifications();
        setNotifications(res.data?.notifications || []);
      } catch (err) {
        console.error("Error fetching notifications for dashboard:", err);
      } finally {
        setLoadingNotifs(false);
      }
    };

    // Fetch Author Feed
    const fetchAuthorFeed = async () => {
      try {
        const res = await followApi.getAuthorFeed();
        setFeedPosts(res.data?.posts || []);
      } catch (err) {
        console.error("Error fetching feed for dashboard:", err);
      } finally {
        setLoadingFeed(false);
      }
    };

    // Fetch Author's Own Posts (if author)
    const fetchMyPosts = async () => {
      if (!isAuthor) return;
      setLoadingMyPosts(true);
      try {
        const res = await postApi.getPosts({ limit: 10 });
        const userPosts = (res.data?.posts || []).filter(
          (p) => p.author?._id === user._id || p.author?.username === user.username
        );
        setMyPosts(userPosts);
      } catch (err) {
        console.error("Error fetching author posts for dashboard:", err);
      } finally {
        setLoadingMyPosts(false);
      }
    };

    fetchBookmarks();
    fetchNotifications();
    fetchAuthorFeed();
    fetchMyPosts();
  }, [user, isAuthor]);

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "5rem" }}>
      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "flex-start",
        }}
      >
        {/* Desktop Sidebar */}
        <DashboardSidebar
          user={user}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Dashboard Main Content Area */}
        <main style={{ flexGrow: 1, width: "100%", overflow: "hidden" }}>
          {/* Welcome Header */}
          <DashboardHeader user={user} />

          {/* Quick Metrics Cards */}
          <DashboardStats
            user={user}
            bookmarksCount={bookmarks.length}
            notificationsCount={notifications.length}
            postsCount={myPosts.length}
          />

          {/* Quick Actions Bar */}
          <QuickActions user={user} />

          {/* My Published Stories (For Authors) */}
          {isAuthor && (activeSection === "overview" || activeSection === "myposts") && (
            <MyPostsPreview posts={myPosts} loading={loadingMyPosts} />
          )}

          {/* Activity & Saved Content Grid */}
          {(activeSection === "overview" || activeSection === "activity" || activeSection === "bookmarks") && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              <RecentActivity notifications={notifications} loading={loadingNotifs} />
              <SavedPostsPreview bookmarks={bookmarks} loading={loadingBookmarks} />
            </div>
          )}

          {/* Following Feed Preview */}
          {(activeSection === "overview" || activeSection === "following") && (
            <div style={{ marginTop: "1.5rem" }}>
              <FollowingPreview feedPosts={feedPosts} loading={loadingFeed} />
            </div>
          )}
        </main>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .dashboard-sidebar-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;