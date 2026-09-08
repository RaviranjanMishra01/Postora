import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  UserPlus,
  UserCheck,
  Globe,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  Eye,
  PenTool,
  Edit3,
} from "lucide-react";
import { authApi } from "../api/authApi";
import { followApi } from "../api/commentInteractionApi";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import { CardSkeleton } from "../components/SkeletonLoader";
import { toast } from "../context/ToastContext";

const defaultAvatar =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

const AuthorProfile = () => {
  const { username } = useParams();
  const { user } = useAuth();

  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [activeTab, setActiveTab] = useState("posts"); // posts | about | followers | following
  const [loading, setLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true);
      try {
        const res = await authApi.getPublicAuthor(username);
        const authorData = res.data.author;
        setAuthor(authorData);
        setPosts(res.data.posts || []);
        setIsFollowing(res.data.isFollowing || false);
        setFollowersCount(authorData.followersCount || 0);
        setFollowingCount(authorData.followingCount || 0);
      } catch (err) {
        console.error("Error fetching author profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchAuthor();
  }, [username]);

  // Lazy fetch followers & following when tabs change
  useEffect(() => {
    if (!author) return;

    if (activeTab === "followers" && followersList.length === 0) {
      followApi
        .getFollowers(author._id)
        .then((res) => setFollowersList(res.data.followers || []))
        .catch((err) => console.error(err));
    }
    if (activeTab === "following" && followingList.length === 0) {
      followApi
        .getFollowing(author._id)
        .then((res) => setFollowingList(res.data.following || []))
        .catch((err) => console.error(err));
    }
  }, [activeTab, author]);

  const handleFollowToggle = async () => {
    if (!user) {
      toast.info("Please log in to follow creators");
      return;
    }
    try {
      const res = await followApi.toggleFollow(author._id);
      setIsFollowing(res.data.isFollowing);
      setFollowersCount((prev) => (res.data.isFollowing ? prev + 1 : Math.max(0, prev - 1)));
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message || "Failed to update follow status");
    }
  };

  if (loading)
    return (
      <div className="container" style={{ paddingTop: "3rem", maxWidth: "1050px" }}>
        <CardSkeleton />
      </div>
    );

  if (!author)
    return (
      <div className="profile-error-container">
        <Sparkles size={36} color="var(--brand-slate-blue)" />
        <h2>Profile Not Found</h2>
        <p>The creator profile you are looking for does not exist.</p>
        <Link to="/" className="btn-primary" style={{ marginTop: "1rem" }}>
          Back to Home
        </Link>
      </div>
    );

  const isOwnProfile = user && author && user._id === author._id;
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const featuredPost = posts.length > 1 ? posts[0] : null;
  const remainingPosts = featuredPost ? posts.slice(1) : posts;

  // Extract unique categories for About tab
  const authorTopics = Array.from(
    new Set(posts.map((p) => p.category?.name).filter(Boolean))
  );

  return (
    <div className="creator-profile-container">
      {/* 1. COMPACT PREMIUM PROFILE HERO */}
      <div className="profile-hero-card">
        <div className="profile-hero-main-row">
          {/* Avatar */}
          <div className="profile-avatar-wrapper">
            <img
              src={!avatarError && author.avatar ? author.avatar : defaultAvatar}
              alt={author.name}
              onError={() => setAvatarError(true)}
              className="profile-avatar-img"
            />
          </div>

          {/* Identity & Actions */}
          <div className="profile-identity-block">
            <div className="profile-name-action-row">
              <div>
                <h1 className="profile-display-name">{author.name}</h1>
                <p className="profile-handle-role">
                  @{author.username} · <span className="profile-role-tag">{author.role || "Creator"}</span>
                </p>
              </div>

              {/* Action Button */}
              {isOwnProfile ? (
                <Link to="/profile" className="btn-edit-profile">
                  <Edit3 size={14} /> Edit Profile
                </Link>
              ) : (
                user && (
                  <button
                    type="button"
                    onClick={handleFollowToggle}
                    className={`btn-profile-follow ${isFollowing ? "is-following" : ""}`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck size={14} /> Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} /> Follow
                      </>
                    )}
                  </button>
                )
              )}
            </div>

            {/* Biography */}
            {author.bio ? (
              <p className="profile-bio-text">{author.bio}</p>
            ) : (
              isOwnProfile && (
                <p className="profile-bio-placeholder">
                  Add a bio to tell people what you write about.{" "}
                  <Link to="/profile" style={{ color: "var(--brand-slate-blue)", fontWeight: 700 }}>
                    Edit Bio
                  </Link>
                </p>
              )
            )}

            {/* Stats Row */}
            <div className="profile-stats-row">
              <button
                type="button"
                onClick={() => setActiveTab("posts")}
                className={`stat-pill-item ${activeTab === "posts" ? "active" : ""}`}
              >
                <span className="stat-number">{posts.length}</span>
                <span className="stat-label">Published</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("followers")}
                className={`stat-pill-item ${activeTab === "followers" ? "active" : ""}`}
              >
                <span className="stat-number">{followersCount}</span>
                <span className="stat-label">Followers</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("following")}
                className={`stat-pill-item ${activeTab === "following" ? "active" : ""}`}
              >
                <span className="stat-number">{followingCount}</span>
                <span className="stat-label">Following</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROFILE TAB NAVIGATION */}
      <div className="profile-tabs-bar">
        <button
          type="button"
          onClick={() => setActiveTab("posts")}
          className={`profile-tab-btn ${activeTab === "posts" ? "active" : ""}`}
        >
          Stories ({posts.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("about")}
          className={`profile-tab-btn ${activeTab === "about" ? "active" : ""}`}
        >
          About
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("followers")}
          className={`profile-tab-btn ${activeTab === "followers" ? "active" : ""}`}
        >
          Followers ({followersCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("following")}
          className={`profile-tab-btn ${activeTab === "following" ? "active" : ""}`}
        >
          Following ({followingCount})
        </button>
      </div>

      {/* 3. TAB CONTENT PANELS */}
      <div className="profile-tab-content">
        {/* TAB 1: STORIES / POSTS */}
        {activeTab === "posts" && (
          <div>
            {posts.length === 0 ? (
              <div className="profile-empty-card">
                <div className="empty-sparkle-icon">✦</div>
                <h3 className="empty-title">No stories yet</h3>
                <p className="empty-desc">
                  {isOwnProfile
                    ? "You haven't published any stories yet. Share your knowledge with your readers."
                    : "This writer hasn't published any stories yet. Check back later for new stories."}
                </p>
                {isOwnProfile && (
                  <Link to="/create-post" className="btn-primary" style={{ gap: "0.4rem" }}>
                    <PenTool size={15} /> Write your first story
                  </Link>
                )}
              </div>
            ) : (
              <div>
                {/* FEATURED STORY HIGHLIGHT (If > 1 post) */}
                {featuredPost && (
                  <div className="featured-story-block">
                    <div className="section-meta-tag">FEATURED STORY</div>
                    <div className="featured-card">
                      <Link to={`/post/${featuredPost.slug}`} className="featured-img-wrapper">
                        <img
                          src={
                            featuredPost.featuredImage ||
                            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80"
                          }
                          alt={featuredPost.title}
                          className="featured-img"
                        />
                      </Link>
                      <div className="featured-content">
                        {featuredPost.category && (
                          <span className="featured-badge">{featuredPost.category.name}</span>
                        )}
                        <h2 className="featured-title">
                          <Link to={`/post/${featuredPost.slug}`}>{featuredPost.title}</Link>
                        </h2>
                        {featuredPost.excerpt && (
                          <p className="featured-excerpt">{featuredPost.excerpt}</p>
                        )}
                        <div className="featured-footer">
                          <div className="featured-meta-line">
                            <Clock size={13} /> {featuredPost.readingTime || 1} min read ·{" "}
                            <Eye size={13} /> {featuredPost.views || 0} views
                          </div>
                          <Link to={`/post/${featuredPost.slug}`} className="btn-read-featured">
                            Read Story <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PUBLISHED STORIES GRID */}
                <div className="section-meta-tag" style={{ marginTop: featuredPost ? "2.5rem" : "0" }}>
                  {featuredPost ? "LATEST STORIES" : "PUBLISHED STORIES"} ({remainingPosts.length})
                </div>

                <div className="posts-cards-grid">
                  {remainingPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ABOUT */}
        {activeTab === "about" && (
          <div className="profile-about-card">
            <h3 className="about-heading">About {author.name}</h3>

            {author.bio ? (
              <p className="about-bio-text">{author.bio}</p>
            ) : (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.9rem" }}>
                No detailed biography provided.
              </p>
            )}

            {/* Writer Topics */}
            {authorTopics.length > 0 && (
              <div className="about-meta-block">
                <span className="about-meta-label">Topics written about:</span>
                <div className="about-topics-pills">
                  {authorTopics.map((topic, idx) => (
                    <span key={idx} className="topic-pill-badge">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="about-meta-grid">
              <div className="about-info-item">
                <Calendar size={15} color="var(--brand-slate-blue)" />
                <span>Joined {new Date(author.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
              </div>

              {author.location && (
                <div className="about-info-item">
                  <MapPin size={15} color="var(--brand-slate-blue)" />
                  <span>{author.location}</span>
                </div>
              )}

              {author.website && (
                <div className="about-info-item">
                  <Globe size={15} color="var(--brand-slate-blue)" />
                  <a href={author.website} target="_blank" rel="noreferrer" style={{ color: "var(--text-primary)" }}>
                    {author.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}

              <div className="about-info-item">
                <Eye size={15} color="var(--brand-slate-blue)" />
                <span>{totalViews} total story views</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FOLLOWERS */}
        {activeTab === "followers" && (
          <div>
            <div className="section-meta-tag">FOLLOWERS ({followersCount})</div>
            {followersList.length === 0 ? (
              <div className="profile-empty-card">
                <div className="empty-sparkle-icon">👥</div>
                <h3 className="empty-title">No followers yet</h3>
                <p className="empty-desc">
                  When users follow this creator, they will appear here.
                </p>
              </div>
            ) : (
              <div className="users-cards-grid">
                {followersList.map((item) => (
                  <div key={item._id} className="user-mini-card">
                    <div className="user-mini-info">
                      <img
                        src={item.avatar || defaultAvatar}
                        alt={item.name}
                        className="user-mini-avatar"
                      />
                      <div className="user-mini-names">
                        <Link to={`/author/${item.username}`} className="user-mini-fullname">
                          {item.name}
                        </Link>
                        <span className="user-mini-handle">@{item.username}</span>
                      </div>
                    </div>

                    <Link to={`/author/${item.username}`} className="btn-mini-profile">
                      View Profile
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FOLLOWING */}
        {activeTab === "following" && (
          <div>
            <div className="section-meta-tag">FOLLOWING ({followingCount})</div>
            {followingList.length === 0 ? (
              <div className="profile-empty-card">
                <div className="empty-sparkle-icon">📌</div>
                <h3 className="empty-title">Not following anyone yet</h3>
                <p className="empty-desc">
                  Authors and creators followed by this user will be listed here.
                </p>
              </div>
            ) : (
              <div className="users-cards-grid">
                {followingList.map((item) => (
                  <div key={item._id} className="user-mini-card">
                    <div className="user-mini-info">
                      <img
                        src={item.avatar || defaultAvatar}
                        alt={item.name}
                        className="user-mini-avatar"
                      />
                      <div className="user-mini-names">
                        <Link to={`/author/${item.username}`} className="user-mini-fullname">
                          {item.name}
                        </Link>
                        <span className="user-mini-handle">@{item.username}</span>
                      </div>
                    </div>

                    <Link to={`/author/${item.username}`} className="btn-mini-profile">
                      View Profile
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* COMPACT STYLES FOR CREATOR PROFILE */}
      <style>{`
        .creator-profile-container {
          max-width: 1050px;
          margin: 0 auto;
          padding: 2rem 1rem 5rem 1rem;
        }

        /* HERO CARD */
        .profile-hero-card {
          background: var(--bg-card, #FFFFFF);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: var(--radius-lg, 16px);
          padding: 2rem;
          margin-bottom: 1.75rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .profile-hero-main-row {
          display: flex;
          gap: 1.75rem;
          align-items: flex-start;
        }

        .profile-avatar-wrapper {
          flex-shrink: 0;
        }

        .profile-avatar-img {
          width: 104px;
          height: 104px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-primary, #FF497C);
        }

        .profile-identity-block {
          flex-grow: 1;
          min-width: 0;
        }

        .profile-name-action-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 0.65rem;
        }

        .profile-display-name {
          font-size: 1.9rem;
          font-weight: 900;
          color: var(--text-primary, #213448);
          font-family: var(--font-heading);
          margin: 0 0 0.15rem 0;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .profile-handle-role {
          font-size: 0.88rem;
          color: var(--text-muted, #94B4C1);
          margin: 0;
        }

        .profile-role-tag {
          font-weight: 600;
          color: var(--brand-slate-blue, #547792);
        }

        .btn-profile-follow {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.45rem 1.1rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: #FFFFFF;
          background: var(--accent-primary, #FF497C);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .btn-profile-follow.is-following {
          background: var(--bg-surface, #EFE9E3);
          color: var(--text-secondary, #547792);
          border: 1px solid var(--border-color, #D9CFC7);
        }

        .btn-edit-profile {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.45rem 0.95rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary, #213448);
          background: var(--bg-secondary, #F9F8F6);
          border: 1px solid var(--border-color, #D9CFC7);
          border-radius: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .profile-bio-text {
          font-size: 0.95rem;
          color: var(--text-secondary, #547792);
          line-height: 1.55;
          margin: 0 0 1.25rem 0;
          max-width: 660px;
        }

        .profile-bio-placeholder {
          font-size: 0.88rem;
          color: var(--text-muted, #94B4C1);
          margin: 0 0 1.25rem 0;
        }

        /* STATS ROW */
        .profile-stats-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .stat-pill-item {
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
        }

        .stat-number {
          font-size: 1.25rem;
          font-weight: 900;
          color: var(--text-primary, #213448);
        }

        .stat-label {
          font-size: 0.82rem;
          color: var(--text-secondary, #547792);
        }

        .stat-pill-item:hover .stat-label {
          color: var(--brand-slate-blue, #547792);
          text-decoration: underline;
        }

        /* TABS BAR */
        .profile-tabs-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-color, #EFE9E3);
          margin-bottom: 2rem;
        }

        .profile-tab-btn {
          padding: 0.65rem 1.15rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-muted, #94B4C1);
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          margin-bottom: -1px;
        }

        .profile-tab-btn.active {
          color: var(--text-primary, #213448);
          border-bottom-color: var(--accent-primary, #FF497C);
        }

        /* SECTION META TAG */
        .section-meta-tag {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--brand-slate-blue, #547792);
          margin-bottom: 1rem;
        }

        /* FEATURED STORY CARD */
        .featured-story-block {
          margin-bottom: 2.5rem;
        }

        .featured-card {
          display: flex;
          background: var(--bg-card, #FFFFFF);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .featured-img-wrapper {
          width: 42%;
          flex-shrink: 0;
          display: block;
          overflow: hidden;
        }

        .featured-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.25s ease;
        }

        .featured-card:hover .featured-img {
          transform: scale(1.03);
        }

        .featured-content {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-grow: 1;
        }

        .featured-badge {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--brand-slate-blue, #547792);
          margin-bottom: 0.5rem;
        }

        .featured-title {
          font-size: 1.4rem;
          font-weight: 800;
          line-height: 1.25;
          margin: 0 0 0.5rem 0;
          font-family: var(--font-heading);
        }

        .featured-title a {
          color: var(--text-primary, #213448);
          text-decoration: none;
        }

        .featured-excerpt {
          font-size: 0.9rem;
          color: var(--text-secondary, #547792);
          line-height: 1.5;
          margin: 0 0 1.25rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .featured-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.85rem;
          border-top: 1px dashed var(--border-color, #EFE9E3);
        }

        .featured-meta-line {
          font-size: 0.78rem;
          color: var(--text-muted, #94B4C1);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .btn-read-featured {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--accent-primary, #FF497C);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        /* POSTS GRID */
        .posts-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        /* EMPTY CARD */
        .profile-empty-card {
          padding: 3rem 1.5rem;
          text-align: center;
          background: var(--bg-card, #FFFFFF);
          border: 1px dashed var(--border-color, #EFE9E3);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .empty-sparkle-icon {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }

        .empty-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 0.25rem 0;
        }

        .empty-desc {
          font-size: 0.86rem;
          color: var(--text-secondary);
          max-width: 380px;
          margin: 0 0 1.25rem 0;
          line-height: 1.45;
        }

        /* ABOUT TAB */
        .profile-about-card {
          background: var(--bg-card, #FFFFFF);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 14px;
          padding: 2rem;
        }

        .about-heading {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
          font-family: var(--font-heading);
        }

        .about-bio-text {
          font-size: 0.98rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 1.75rem;
        }

        .about-meta-block {
          margin-bottom: 1.5rem;
        }

        .about-meta-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          display: block;
          margin-bottom: 0.5rem;
        }

        .about-topics-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .topic-pill-badge {
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.3rem 0.75rem;
          background: var(--bg-secondary, #F9F8F6);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 6px;
          color: var(--brand-slate-blue, #547792);
        }

        .about-meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-color, #EFE9E3);
        }

        .about-info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        /* USERS LIST / GRID */
        .users-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .user-mini-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1rem;
          background: var(--bg-card, #FFFFFF);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 10px;
          gap: 0.75rem;
        }

        .user-mini-info {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          min-width: 0;
        }

        .user-mini-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .user-mini-names {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .user-mini-fullname {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-mini-handle {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .btn-mini-profile {
          padding: 0.35rem 0.65rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--brand-slate-blue, #547792);
          background: var(--bg-secondary, #F9F8F6);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 6px;
          text-decoration: none;
          flex-shrink: 0;
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 768px) {
          .profile-hero-main-row {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .profile-name-action-row {
            flex-direction: column;
            align-items: center;
          }
          .profile-bio-text {
            text-align: center;
          }
          .profile-stats-row {
            justify-content: center;
          }
          .featured-card {
            flex-direction: column;
          }
          .featured-img-wrapper {
            width: 100%;
            height: 200px;
          }
        }

        .profile-error-container {
          padding: 5rem 1rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default AuthorProfile;
