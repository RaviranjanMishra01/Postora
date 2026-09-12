import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Clock,
  Eye,
  Heart,
  Bookmark,
  Share2,
  Check,
  List,
  Sparkles,
  UserPlus,
  UserCheck,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { postApi } from "../api/postApi";
import { interactionApi, followApi, analyticsApi } from "../api/commentInteractionApi";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import { PostDetailSkeleton } from "../components/SkeletonLoader";
import DOMPurify from "dompurify";
import { toast } from "../context/ToastContext";
import SEO from "../components/SEO";

const defaultAvatar =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";

const PostDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [sanitizedContent, setSanitizedContent] = useState("");
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [toc, setToc] = useState([]);
  const [activeTocId, setActiveTocId] = useState("");

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [authorAvatarError, setAuthorAvatarError] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);

  // Fetch Post Details
  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      try {
        const res = await postApi.getPostBySlug(slug);
        const postData = res.data.post;
        setPost(postData);
        setLikesCount(postData.likesCount || 0);

        // Record page view analytics
        analyticsApi.recordView({ source: "direct" });

        // Update Document SEO Title
        document.title = postData.seoTitle || `${postData.title} | MERN Blog`;

        // Fetch related posts
        const relatedRes = await postApi.getRelatedPosts(postData._id);
        setRelatedPosts(relatedRes.data.posts || []);

        // Fetch interaction status if user is logged in
        if (user) {
          const statusRes = await interactionApi.getStatus(postData._id);
          setIsLiked(statusRes.data.isLiked);
          setIsBookmarked(statusRes.data.isBookmarked);
          if (postData.author?._id) {
            const authorStatus = await followApi.getFollowers(postData.author._id);
            // Check if current user is in author's followers
            const followersList = authorStatus.data?.followers || [];
            const userFollows = followersList.some((f) => f._id === user._id);
            setIsFollowing(userFollows);
          }
        }

        // Parse Table of Contents from HTML Headings and inject IDs
        if (postData.content) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(postData.content, "text/html");
          const headingElements = Array.from(doc.querySelectorAll("h1, h2, h3, h4"));

          const headings = headingElements.map((h, i) => {
            const id = `heading-${i}`;
            h.setAttribute("id", id);
            return {
              id,
              text: h.textContent ? h.textContent.trim() : "",
              level: h.tagName.toLowerCase(),
            };
          });

          setToc(headings);
          setSanitizedContent(DOMPurify.sanitize(doc.body.innerHTML));
        }
      } catch (err) {
        console.error("Error fetching post detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPostData();
  }, [slug, user]);

  // Reading progress scroll listener & Active TOC observer
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
      setReadingProgress(progress);

      // Active TOC item tracking
      if (toc.length > 0) {
        for (let i = toc.length - 1; i >= 0; i--) {
          const el = document.getElementById(toc[i].id);
          if (el && el.getBoundingClientRect().top <= 160) {
            setActiveTocId(toc[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  const handleLikeToggle = async () => {
    if (!user) {
      toast.info("Please log in to like articles");
      return;
    }
    try {
      const res = await interactionApi.toggleLike(post._id);
      setIsLiked(res.data.isLiked);
      setLikesCount((prev) => (res.data.isLiked ? prev + 1 : prev - 1));
      if (res.data.isLiked) {
        setHeartAnim(true);
        setTimeout(() => setHeartAnim(false), 600);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user) {
      toast.info("Please log in to bookmark articles");
      return;
    }
    try {
      const res = await interactionApi.toggleBookmark(post._id);
      setIsBookmarked(res.data.isBookmarked);
      toast.success(res.message || (res.data.isBookmarked ? "Article saved to bookmarks!" : "Article removed from saved"));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) {
      toast.info("Please log in to follow authors");
      return;
    }
    try {
      const res = await followApi.toggleFollow(post.author._id);
      setIsFollowing(res.data.isFollowing);
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCopyLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share was cancelled
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success("Article link copied!");
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const scrollToComments = () => {
    const el = document.getElementById("comments") || document.querySelector(".discussion-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) return <PostDetailSkeleton />;
  if (!post)
    return (
      <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-primary)" }}>
        Article not found
      </div>
    );

  const formattedDate = post.publishedAt || post.createdAt
    ? new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const authorAvatar =
    post.author?.avatar && !authorAvatarError ? post.author.avatar : defaultAvatar;

  const hasMultipleSections = toc.length >= 2;

  return (
    <>
      <SEO
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        image={post.featuredImage}
        url={`/post/${post.slug}`}
        type="article"
        articleData={post}
        breadcrumbs={[
          { name: "Home", item: "/" },
          ...(post.category ? [{ name: post.category.name, item: `/category/${post.category.slug}` }] : []),
          { name: post.title, item: `/post/${post.slug}` }
        ]}
      />
      {/* 1. THIN READING PROGRESS BAR */}
      <div
        className="reading-progress-bar"
        style={{ width: `${readingProgress}%` }}
      />

      <article className="editorial-article-page">
        <div className="editorial-master-container">
          <div className={`article-layout-grid ${hasMultipleSections ? "has-toc" : "no-toc"}`}>
            
            {/* MAIN ARTICLE COLUMN — SINGLE MASTER SOURCE OF TRUTH FOR ALIGNMENT */}
            <main className="main-article-column">
              {/* Category Pill */}
              {post.category && (
                <div className="article-category-wrapper">
                  <Link to={`/category/${post.category.slug}`} className="article-category-badge">
                    {post.category.name}
                  </Link>
                </div>
              )}

              {/* Large Powerful Editorial Headline */}
              <h1 className="article-headline">{post.title}</h1>

              {/* Subtitle / Deck */}
              {post.excerpt && <p className="article-subtitle">{post.excerpt}</p>}

              {/* Author Byline Row */}
              {post.author && (
                <div className="author-byline-card">
                  <div className="author-byline-info">
                    <Link to={`/author/${post.author.username}`}>
                      <img
                        src={authorAvatar}
                        alt={post.author.name}
                        onError={() => setAuthorAvatarError(true)}
                        className="author-byline-avatar"
                      />
                    </Link>

                    <div className="author-byline-meta">
                      <div className="author-name-row">
                        <Link to={`/author/${post.author.username}`} className="author-byline-name">
                          {post.author.name}
                        </Link>
                        <span className="author-byline-handle">@{post.author.username}</span>
                      </div>

                      <div className="article-meta-line">
                        {formattedDate && <span>Published {formattedDate}</span>}
                        {formattedDate && <span className="meta-dot">·</span>}
                        <span className="meta-item">
                          <Clock size={13} /> {post.readingTime || 1} min read
                        </span>
                        <span className="meta-dot">·</span>
                        <span className="meta-item">
                          <Eye size={13} /> {post.views || 0} views
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Follow Button */}
                  {user && user._id !== post.author._id && (
                    <button
                      type="button"
                      onClick={handleFollowToggle}
                      className={`btn-author-follow ${isFollowing ? "is-following" : ""}`}
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
                  )}
                </div>
              )}

              {/* HERO FEATURED IMAGE */}
              <div className="article-hero-wrapper">
                {post.featuredImage && !heroImgError ? (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    loading="lazy"
                    onError={() => setHeroImgError(true)}
                    className="article-hero-img"
                  />
                ) : (
                  <div className="article-hero-fallback">
                    <Sparkles size={40} strokeWidth={1.5} color="var(--brand-slate-blue)" />
                    <span className="hero-fallback-title">{post.title}</span>
                  </div>
                )}
              </div>

              {/* Mobile Collapsible Table of Contents (ONLY IF 2+ SECTIONS) */}
              {hasMultipleSections && (
                <details className="mobile-toc-box">
                  <summary className="mobile-toc-summary">
                    <List size={15} /> Table of Contents ({toc.length} sections)
                  </summary>
                  <ul className="mobile-toc-list">
                    {toc.map((item, idx) => (
                      <li
                        key={idx}
                        style={{
                          paddingLeft: item.level === "h3" ? "1rem" : item.level === "h4" ? "1.5rem" : "0",
                        }}
                      >
                        <a
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                          }}
                        >
                          <span className="mobile-toc-num">{String(idx + 1).padStart(2, "0")}</span> {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              {/* Sanitized Body HTML Content (if content exists) */}
              {(sanitizedContent || post.content) ? (
                <div
                  className="editorial-prose"
                  dangerouslySetInnerHTML={{
                    __html: sanitizedContent || DOMPurify.sanitize(post.content || ""),
                  }}
                />
              ) : null}

              {/* TOPICS / TAGS SECTION */}
              {post.tags && post.tags.length > 0 && (
                <div className="article-topics-section">
                  <span className="topics-label">TOPICS</span>
                  <div className="topics-pills-row">
                    {post.tags.map((t) => (
                      <Link key={t._id || t.slug} to={`/tag/${t.slug}`} className="topic-pill">
                        #{t.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* SOLE PRIMARY ENGAGEMENT BAR (LIKE, COMMENTS, SAVE, SHARE) */}
              <div className="article-bottom-actions-bar">
                <button
                  type="button"
                  onClick={handleLikeToggle}
                  className={`bottom-action-btn ${isLiked ? "active" : ""} ${heartAnim ? "heart-pop" : ""}`}
                  aria-label="Like article"
                >
                  <Heart
                    size={18}
                    fill={isLiked ? "var(--accent-primary, #FF497C)" : "none"}
                    color={isLiked ? "var(--accent-primary, #FF497C)" : "currentColor"}
                  />
                  <span>
                    {isLiked
                      ? likesCount > 0
                        ? `${likesCount} ${likesCount === 1 ? "Like" : "Likes"}`
                        : "Liked"
                      : likesCount > 0
                      ? `${likesCount} ${likesCount === 1 ? "Like" : "Likes"}`
                      : "Like"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={scrollToComments}
                  className="bottom-action-btn"
                  aria-label="Comments"
                >
                  <MessageSquare size={18} />
                  <span>Comments</span>
                </button>

                <button
                  type="button"
                  onClick={handleBookmarkToggle}
                  className={`bottom-action-btn ${isBookmarked ? "active" : ""}`}
                  aria-label="Save bookmark"
                >
                  <Bookmark
                    size={18}
                    fill={isBookmarked ? "var(--accent-primary, #FF497C)" : "none"}
                    color={isBookmarked ? "var(--accent-primary, #FF497C)" : "currentColor"}
                  />
                  <span>{isBookmarked ? "Saved" : "Save"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="bottom-action-btn"
                  aria-label="Share article"
                >
                  {copiedLink ? <Check size={18} color="#10b981" /> : <Share2 size={18} />}
                  <span>{copiedLink ? "Copied" : "Share"}</span>
                </button>
              </div>

            {/* COMMENTS SECTION */}
            <div id="comments" className="discussion-section">
              <CommentSection postId={post._id} />
            </div>

            {/* MORE TO READ / RECOMMENDED STORIES */}
            {relatedPosts.length > 0 && (
              <section className="more-stories-section">
                <div className="more-stories-header">
                  <span className="more-stories-label">MORE TO READ</span>
                  <h3 className="more-stories-title">Related Stories</h3>
                </div>

                <div className="related-cards-grid">
                  {relatedPosts.slice(0, 3).map((rel) => (
                    <PostCard key={rel._id} post={rel} />
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* SECONDARY DESKTOP STICKY TOC SIDEBAR (ONLY IF 2+ SECTIONS) */}
          {hasMultipleSections && (
            <aside className="sticky-toc-sidebar">
              <div className="toc-container-box">
                <div className="toc-header-row">
                  <span className="toc-header-label">TABLE OF CONTENTS</span>
                  <span className="toc-count-badge">{toc.length} sections</span>
                </div>
                <div className="toc-divider" />
                <nav className="toc-nav-list">
                  {toc.map((item, idx) => {
                    const isActive = activeTocId === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTocId(item.id);
                          document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`toc-nav-link ${isActive ? "active" : ""}`}
                        style={{
                          paddingLeft:
                            item.level === "h3" ? "1.4rem" : item.level === "h4" ? "2rem" : "0.5rem",
                        }}
                      >
                        <span className="toc-item-num">{String(idx + 1).padStart(2, "0")}</span>
                        <span className="toc-item-text">{item.text}</span>
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </article>

      {/* STYLES (Enforcing Single Master Alignment Grid for Entire Article) */}
      <style>{`
        .reading-progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          background: var(--accent-primary, #FF497C);
          z-index: 10000;
          transition: width 80ms ease-out;
        }

        .editorial-article-page {
          width: 100%;
          padding: 2.5rem 1.25rem 6rem 1.25rem;
        }

        .editorial-master-container {
          max-width: 1080px;
          margin: 0 auto;
        }

        /* LAYOUT GRID: SINGLE MASTER COLUMN + OPTIONAL TOC SIDEBAR */
        .article-layout-grid {
          display: flex;
          justify-content: center;
          gap: 3rem;
          align-items: flex-start;
          width: 100%;
        }

        .article-layout-grid.no-toc {
          justify-content: center;
        }

        /* MAIN ARTICLE COLUMN: THE SINGLE SOURCE OF TRUTH FOR ALIGNMENT */
        .main-article-column {
          width: 100%;
          max-width: 760px;
          flex-shrink: 1;
          min-width: 0;
          margin: 0 auto;
        }

        .article-layout-grid.has-toc .main-article-column {
          margin: 0;
        }

        /* CATEGORY */
        .article-category-wrapper {
          margin-bottom: 0.85rem;
        }

        .article-category-badge {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--brand-slate-blue, #547792);
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .article-category-badge:hover {
          color: var(--accent-primary, #FF497C);
        }

        /* HEADLINE */
        .article-headline {
          font-size: clamp(2.3rem, 5vw, 3.6rem);
          font-weight: 900;
          line-height: 1.12;
          color: var(--text-primary, #213448);
          font-family: var(--font-heading);
          margin: 0 0 1.15rem 0;
          letter-spacing: -0.02em;
        }

        /* SUBTITLE */
        .article-subtitle {
          font-size: 1.22rem;
          color: var(--text-secondary, #547792);
          line-height: 1.6;
          margin: 0 0 1.85rem 0;
        }

        /* AUTHOR BYLINE CARD */
        .author-byline-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.15rem 0;
          border-top: 1px solid var(--border-color, #EFE9E3);
          border-bottom: 1px solid var(--border-color, #EFE9E3);
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          gap: 1rem;
          width: 100%;
        }

        .author-byline-info {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .author-byline-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--border-color, #EFE9E3);
          flex-shrink: 0;
        }

        .author-byline-meta {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .author-name-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .author-byline-name {
          font-size: 0.98rem;
          font-weight: 800;
          color: var(--text-primary, #213448);
          text-decoration: none;
        }

        .author-byline-name:hover {
          color: var(--brand-slate-blue, #547792);
        }

        .author-byline-handle {
          font-size: 0.8rem;
          color: var(--text-muted, #94B4C1);
        }

        .article-meta-line {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: var(--text-secondary, #547792);
          flex-wrap: wrap;
        }

        .meta-dot {
          color: var(--text-muted, #94B4C1);
        }

        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
        }

        .btn-author-follow {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.35rem 0.85rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: #FFFFFF;
          background: var(--accent-primary, #FF497C);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-author-follow.is-following {
          background: var(--bg-surface, #EFE9E3);
          color: var(--text-secondary, #547792);
          border: 1px solid var(--border-color, #D9CFC7);
        }

        /* HERO FEATURED IMAGE */
        .article-hero-wrapper {
          width: 100%;
          margin: 0 0 3rem 0;
          border-radius: 14px;
          overflow: hidden;
          background: var(--bg-secondary, #F9F8F6);
          border: 1px solid var(--border-color, #EFE9E3);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .article-hero-img {
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          display: block;
        }

        .article-hero-fallback {
          padding: 4rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .hero-fallback-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* EDITORIAL PROSE TYPOGRAPHY */
        .editorial-prose {
          width: 100%;
          font-size: 1.18rem;
          line-height: 1.85;
          color: var(--text-primary, #213448);
          font-family: var(--font-body);
        }

        .editorial-prose p {
          margin: 0 0 1.8em 0;
          font-size: 1.18rem;
          line-height: 1.85;
          color: var(--text-primary, #213448);
        }

        .editorial-prose h1, .editorial-prose h2 {
          font-size: 1.85rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--text-primary, #213448);
          margin: 2.2em 0 0.75em 0;
          line-height: 1.25;
          letter-spacing: -0.015em;
        }

        .editorial-prose h3 {
          font-size: 1.4rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--text-primary, #213448);
          margin: 1.8em 0 0.6em 0;
          line-height: 1.3;
        }

        .editorial-prose a {
          color: var(--brand-slate-blue, #547792);
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
        }

        .editorial-prose blockquote {
          border-left: 3px solid var(--accent-primary, #FF497C);
          background: var(--bg-secondary, #F9F8F6);
          padding: 1.25rem 1.5rem;
          margin: 2em 0;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          font-size: 1.1rem;
          line-height: 1.7;
        }

        .editorial-prose pre {
          background: var(--bg-secondary, #F9F8F6);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 10px;
          padding: 1.25rem;
          margin: 2em 0;
          overflow-x: auto;
          font-family: monospace;
          font-size: 0.9rem;
        }

        .editorial-prose img {
          max-width: 100%;
          border-radius: 10px;
          margin: 2em 0;
        }

        /* TOPICS SECTION */
        .article-topics-section {
          width: 100%;
          margin-top: 2.5rem;
          margin-bottom: 2rem;
        }

        .topics-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--brand-slate-blue, #547792);
          margin-bottom: 0.65rem;
        }

        .topics-pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .topic-pill {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary, #547792);
          background: var(--bg-secondary, #F9F8F6);
          border: 1px solid var(--border-color, #EFE9E3);
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .topic-pill:hover {
          border-color: var(--brand-slate-blue, #547792);
          color: var(--text-primary, #213448);
        }

        /* SOLE PRIMARY ENGAGEMENT BAR */
        .article-bottom-actions-bar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0.85rem 1.25rem;
          background: var(--bg-card, #FFFFFF);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 12px;
          margin: 2.5rem 0 0 0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          gap: 0.5rem;
        }

        .bottom-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-height: 44px;
          padding: 0.5rem 1.1rem;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-secondary, #547792);
          background: transparent;
          border: 1px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          flex: 1;
        }

        .bottom-action-btn:hover {
          background: var(--bg-secondary, #F9F8F6);
          color: var(--text-primary, #213448);
          border-color: var(--border-color, #EFE9E3);
        }

        .bottom-action-btn.active {
          border-color: var(--accent-primary, #FF497C);
          color: var(--accent-primary, #FF497C);
          background: rgba(255, 73, 124, 0.06);
        }

        @keyframes heartPopAnim {
          0% { transform: scale(1); }
          50% { transform: scale(1.25); }
          100% { transform: scale(1); }
        }

        .bottom-action-btn.heart-pop svg {
          animation: heartPopAnim 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* MORE STORIES SECTION */
        .more-stories-section {
          width: 100%;
          margin-top: 4rem;
          padding-top: 2.5rem;
          border-top: 1px solid var(--border-color, #EFE9E3);
        }

        .more-stories-label {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--brand-slate-blue, #547792);
          display: block;
          margin-bottom: 0.2rem;
        }

        .more-stories-title {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--text-primary, #213448);
          font-family: var(--font-heading);
          margin: 0 0 1.5rem 0;
        }

        .related-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.25rem;
        }

        /* STICKY TOC SIDEBAR (Desktop) */
        .sticky-toc-sidebar {
          position: sticky;
          top: 100px;
          width: 240px;
          flex-shrink: 0;
        }

        .toc-container-box {
          background: var(--bg-card, #FFFFFF);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 12px;
          padding: 1.15rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
        }

        .toc-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.65rem;
        }

        .toc-header-label {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--brand-slate-blue, #547792);
        }

        .toc-count-badge {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          background: var(--bg-secondary, #F9F8F6);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 12px;
          color: var(--text-secondary, #547792);
        }

        .toc-divider {
          height: 1px;
          background: var(--border-color, #EFE9E3);
          margin-bottom: 0.75rem;
        }

        .toc-nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .toc-nav-link {
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text-secondary, #547792);
          text-decoration: none;
          line-height: 1.35;
          display: flex;
          align-items: baseline;
          gap: 0.45rem;
          padding: 0.35rem 0.4rem;
          border-radius: 6px;
          border-left: 2px solid transparent;
          transition: all 0.15s ease;
        }

        .toc-item-num {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted, #94B4C1);
          font-family: monospace;
          flex-shrink: 0;
        }

        .toc-item-text {
          flex-grow: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .toc-nav-link:hover {
          color: var(--text-primary, #213448);
          background: var(--bg-secondary, #F9F8F6);
        }

        .toc-nav-link.active {
          font-weight: 700;
          color: var(--accent-primary, #FF497C);
          border-left-color: var(--accent-primary, #FF497C);
          background: rgba(255, 73, 124, 0.04);
        }

        .toc-nav-link.active .toc-item-num {
          color: var(--accent-primary, #FF497C);
        }

        /* MOBILE TOC BOX */
        .mobile-toc-box {
          width: 100%;
          margin-bottom: 2rem;
          padding: 0.85rem 1rem;
          background: var(--bg-secondary, #F9F8F6);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 8px;
        }

        .mobile-toc-summary {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .mobile-toc-list {
          list-style: none;
          margin: 0.65rem 0 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .mobile-toc-list a {
          font-size: 0.82rem;
          color: var(--text-secondary);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .mobile-toc-num {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted, #94B4C1);
          font-family: monospace;
        }

        /* RESPONSIVE LAYOUT */
        @media (max-width: 1024px) {
          .sticky-toc-sidebar {
            display: none;
          }
          .article-layout-grid {
            gap: 0;
          }
          .main-article-column {
            margin: 0 auto;
          }
        }

        @media (max-width: 768px) {
          .editorial-article-page {
            padding: 1.5rem 1rem 4rem 1rem;
          }
          .editorial-prose {
            font-size: 1.05rem;
          }
          .editorial-prose p {
            font-size: 1.05rem;
          }
          .author-byline-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .author-profile-row {
            flex-direction: column;
          }
          .article-bottom-actions-bar {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
            padding: 0.75rem;
          }
          .bottom-action-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default PostDetail;
