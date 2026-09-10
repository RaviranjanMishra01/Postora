import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { postApi } from "../api/postApi";
import { interactionApi, followApi, notificationApi } from "../api/commentInteractionApi";

// Modular Dashboard Components
import ProfileSidebar from "../components/profile/ProfileSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import MyPostsPreview from "../components/dashboard/MyPostsPreview";
import ContinueWritingDraft from "../components/dashboard/ContinueWritingDraft";
import SavedPostsPreview from "../components/dashboard/SavedPostsPreview";
import FollowingPreview from "../components/dashboard/FollowingPreview";
import QuickActions from "../components/dashboard/QuickActions";
import DiscoverAuthors from "../components/dashboard/DiscoverAuthors";
import ArticleCard from "../components/profile/ArticleCard";
import ActivityTimeline from "../components/profile/ActivityTimeline";
import InlineProfileSettings from "../components/profile/InlineProfileSettings";
import EmptyState from "../components/profile/EmptyState";
import { CardSkeleton } from "../components/SkeletonLoader";
import SEO from "../components/SEO";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Local Single-Page UI Navigation State (NO page reload, NO route redirects)
  const [activeSection, setActiveSection] = useState("overview"); // overview | myposts | bookmarks | following | activity | settings
  const [postFilter, setPostFilter] = useState("all"); // all | published | drafts

  // Data States
  const [myPosts, setMyPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Loading States
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // Pure Local State Change - ZERO Page Redirects
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  useEffect(() => {
    if (!user) return;

    // Fetch User's Published Posts
    const fetchMyPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await postApi.getPosts({ author: user._id, status: "published", limit: 30 });
        setMyPosts(res.data?.posts || []);
      } catch (err) {
        console.error("Error fetching published posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    // Fetch User's Draft Posts
    const fetchDrafts = async () => {
      try {
        const res = await postApi.getPosts({ author: user._id, status: "draft", limit: 10 });
        setDrafts(res.data?.posts || []);
      } catch (err) {
        console.error("Error fetching drafts:", err);
      }
    };

    // Fetch Saved / Bookmarked Posts
    const fetchBookmarks = async () => {
      setLoadingBookmarks(true);
      try {
        const res = await interactionApi.getBookmarks();
        setBookmarks(res.data?.posts || []);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      } finally {
        setLoadingBookmarks(false);
      }
    };

    // Fetch Following Feed
    const fetchFeed = async () => {
      setLoadingFeed(true);
      try {
        const res = await followApi.getAuthorFeed();
        setFeedPosts(res.data?.posts || []);
      } catch (err) {
        console.error("Error fetching feed:", err);
      } finally {
        setLoadingFeed(false);
      }
    };

    // Fetch Followers & Following Lists
    const fetchFollows = async () => {
      try {
        const [followersRes, followingRes] = await Promise.all([
          followApi.getFollowers(user._id),
          followApi.getFollowing(user._id),
        ]);
        setFollowers(followersRes.data?.followers || []);
        setFollowing(followingRes.data?.following || []);
      } catch (err) {
        console.error("Error fetching followers/following:", err);
      }
    };

    // Fetch Recent Activity
    const fetchActivity = async () => {
      setLoadingActivity(true);
      try {
        const res = await notificationApi.getNotifications();
        setNotifications(res.data?.notifications || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoadingActivity(false);
      }
    };

    fetchMyPosts();
    fetchDrafts();
    fetchBookmarks();
    fetchFeed();
    fetchFollows();
    fetchActivity();
  }, [user]);

  // Metrics
  const totalViews = myPosts.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalLikes = myPosts.reduce((acc, p) => acc + (p.likesCount || 0), 0);

  const handleDeletePostSuccess = (deletedId) => {
    setMyPosts((prev) => prev.filter((p) => p._id !== deletedId));
    setDrafts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  return (
    <div className="container" style={{ maxWidth: "1280px", paddingTop: "2rem", paddingBottom: "5rem" }}>
      <SEO title="User Dashboard" url="/dashboard" noindex={true} />
      {/* 2-COLUMN SINGLE-PAGE DASHBOARD LAYOUT */}
      <div
        style={{
          display: "flex",
          gap: "2.25rem",
          alignItems: "flex-start",
        }}
      >
        {/* LEFT COLUMN: PERSISTENT FULL-HEIGHT SIDEBAR */}
        <ProfileSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        {/* RIGHT COLUMN: DYNAMIC CONTENT PANEL (ONLY THIS AREA CHANGES) */}
        <main
          style={{
            flexGrow: 1,
            width: "100%",
            minWidth: 0,
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
        >
          {/* SECTION 1: OVERVIEW */}
          {activeSection === "overview" && (
            <div className="dashboard-section-fade">
              {/* Greeting Header */}
              <DashboardHeader user={user} />

              {/* Minimal Stats Cards */}
              <DashboardStats
                postsCount={myPosts.length}
                totalViews={totalViews}
                totalLikes={totalLikes}
                followersCount={user?.followersCount || followers.length}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 320px",
                  gap: "2rem",
                  alignItems: "flex-start",
                }}
                className="dashboard-inner-grid"
              >
                {/* Main Content Area */}
                <div>
                  <MyPostsPreview
                    posts={myPosts}
                    loading={loadingPosts}
                    onViewAll={() => setActiveSection("myposts")}
                    onDeleteSuccess={handleDeletePostSuccess}
                  />

                  <ContinueWritingDraft drafts={drafts} />

                  <SavedPostsPreview bookmarks={bookmarks} loading={loadingBookmarks} />

                  <FollowingPreview
                    feedPosts={feedPosts}
                    loading={loadingFeed}
                    onDiscoverClick={() => setActiveSection("following")}
                  />
                </div>

                {/* Right Sidebar Widgets */}
                <aside style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
                  <QuickActions onNavigateSection={setActiveSection} />
                  <DiscoverAuthors />
                </aside>
              </div>
            </div>
          )}

          {/* SECTION 2: MY POSTS */}
          {activeSection === "myposts" && (
            <div className="dashboard-section-fade">
              <div style={{ marginBottom: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--text-primary, #f8fafc)", margin: "0 0 0.25rem 0" }}>
                    My Posts
                  </h2>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary, #94a3b8)", margin: 0 }}>
                    Manage your published stories and unpublished drafts.
                  </p>
                </div>

                {/* Filter Switcher */}
                <div style={{ display: "flex", gap: "0.5rem", background: "var(--bg-card, #1e293b)", padding: "0.25rem", borderRadius: "8px", border: "1px solid var(--border-color, #334155)" }}>
                  <button
                    type="button"
                    onClick={() => setPostFilter("all")}
                    style={{
                      padding: "0.4rem 0.85rem",
                      fontSize: "0.82rem",
                      fontWeight: postFilter === "all" ? 700 : 500,
                      background: postFilter === "all" ? "var(--accent-primary, #ec4899)" : "transparent",
                      color: postFilter === "all" ? "#fff" : "#94a3b8",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    All ({myPosts.length + drafts.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostFilter("published")}
                    style={{
                      padding: "0.4rem 0.85rem",
                      fontSize: "0.82rem",
                      fontWeight: postFilter === "published" ? 700 : 500,
                      background: postFilter === "published" ? "var(--accent-primary, #ec4899)" : "transparent",
                      color: postFilter === "published" ? "#fff" : "#94a3b8",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Published ({myPosts.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostFilter("drafts")}
                    style={{
                      padding: "0.4rem 0.85rem",
                      fontSize: "0.82rem",
                      fontWeight: postFilter === "drafts" ? 700 : 500,
                      background: postFilter === "drafts" ? "var(--accent-primary, #ec4899)" : "transparent",
                      color: postFilter === "drafts" ? "#fff" : "#94a3b8",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Drafts ({drafts.length})
                  </button>
                </div>
              </div>

              {loadingPosts ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.5rem" }}>
                  <CardSkeleton /><CardSkeleton />
                </div>
              ) : (postFilter === "drafts" ? drafts : postFilter === "published" ? myPosts : [...myPosts, ...drafts]).length === 0 ? (
                <EmptyState type="posts" />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.5rem" }}>
                  {(postFilter === "drafts" ? drafts : postFilter === "published" ? myPosts : [...myPosts, ...drafts]).map((post) => (
                    <ArticleCard
                      key={post._id}
                      post={post}
                      isOwnPost={true}
                      isDraft={post.status === "draft"}
                      onDeleteSuccess={handleDeletePostSuccess}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: SAVED BOOKMARKS */}
          {activeSection === "bookmarks" && (
            <div className="dashboard-section-fade">
              <div style={{ marginBottom: "1.75rem" }}>
                <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--text-primary, #f8fafc)", margin: "0 0 0.25rem 0" }}>
                  Saved Bookmarks
                </h2>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary, #94a3b8)", margin: 0 }}>
                  Stories you've saved to read later.
                </p>
              </div>

              {loadingBookmarks ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.5rem" }}>
                  <CardSkeleton />
                </div>
              ) : bookmarks.length === 0 ? (
                <EmptyState type="saved" />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.5rem" }}>
                  {bookmarks.map((post) => (
                    <ArticleCard key={post._id} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 4: FOLLOWING FEED */}
          {activeSection === "following" && (
            <div className="dashboard-section-fade">
              <div style={{ marginBottom: "1.75rem" }}>
                <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--text-primary, #f8fafc)", margin: "0 0 0.25rem 0" }}>
                  Following Feed
                </h2>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary, #94a3b8)", margin: 0 }}>
                  Latest stories from writers you follow.
                </p>
              </div>

              {loadingFeed ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.5rem" }}>
                  <CardSkeleton />
                </div>
              ) : feedPosts.length === 0 ? (
                <div>
                  <EmptyState type="activity" title="Build your reading circle" description="Follow writers you enjoy and their latest stories will appear here." />
                  <div style={{ marginTop: "2rem" }}>
                    <DiscoverAuthors />
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.5rem" }}>
                  {feedPosts.map((post) => (
                    <ArticleCard key={post._id} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 5: RECENT ACTIVITY */}
          {activeSection === "activity" && (
            <div className="dashboard-section-fade">
              <div style={{ marginBottom: "1.75rem" }}>
                <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--text-primary, #f8fafc)", margin: "0 0 0.25rem 0" }}>
                  Recent Activity
                </h2>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary, #94a3b8)", margin: 0 }}>
                  Your recent publications, likes, bookmarks, and interactions.
                </p>
              </div>

              {loadingActivity ? (
                <CardSkeleton />
              ) : notifications.length === 0 ? (
                <EmptyState type="activity" title="No recent activity yet" description="Interact with stories to build your activity feed." />
              ) : (
                <ActivityTimeline activities={notifications} />
              )}
            </div>
          )}

          {/* SECTION 6: INLINE PROFILE SETTINGS */}
          {activeSection === "settings" && (
            <div className="dashboard-section-fade">
              <InlineProfileSettings />
            </div>
          )}
        </main>
      </div>

      <style>{`
        .dashboard-section-fade {
          animation: dashboardFadeIn 0.25s ease-out forwards;
        }

        @keyframes dashboardFadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 992px) {
          .dashboard-inner-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;