import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Clock,
  Eye,
  Heart,
  Bookmark,
  Copy,
  Printer,
  UserPlus,
  UserCheck,
  Check,
  List,
  Sparkles,
  ArrowRight,
  Share2,
} from "lucide-react";
import { postApi } from "../api/postApi";
import { interactionApi, followApi, analyticsApi } from "../api/commentInteractionApi";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import { PostDetailSkeleton } from "../components/SkeletonLoader";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";

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
  const [heroImgError, setHeroImgError] = useState(false);
  const [authorAvatarError, setAuthorAvatarError] = useState(false);

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
            const authorStatus = await followApi.getFollowStatus(postData.author._id);
            setIsFollowing(authorStatus.data?.isFollowing || false);
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
      toast.success(res.message || (res.data.isBookmarked ? "Article saved!" : "Article removed from saved"));
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
        // Fallback to clipboard if share was cancelled or unsupported
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success("Article link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
  };

  if (loading) return <PostDetailSkeleton />;
  if (!post) return <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-primary)" }}>Article not found</div>;

  const formattedDate = post.publishedAt || post.createdAt
    ? new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <>
      {/* 1. Thin Reading Progress Indicator */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "3px",
          background: "var(--brand-slate-blue)",
          width: `${readingProgress}%`,
          zIndex: 10000,
          transition: "width 100ms ease-out",
        }}
      />

      {/* Prose & Layout Styles */}
      <style>{`
        .editorial-prose {
          font-size: 1.12rem;
          line-height: 1.8;
          color: var(--text-primary);
          font-family: var(--font-body);
        }
        .editorial-prose p {
          margin-top: 0;
          margin-bottom: 1.6em;
          font-size: 1.12rem;
          line-height: 1.8;
          color: var(--text-primary);
        }
        .editorial-prose h1, .editorial-prose h2 {
          font-size: 1.95rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--text-primary);
          margin-top: 2.2em;
          margin-bottom: 0.75em;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }
        .editorial-prose h3 {
          font-size: 1.45rem;
          font-weight: 700;
          font-family: var(--font-heading);
          color: var(--text-primary);
          margin-top: 1.8em;
          margin-bottom: 0.6em;
          line-height: 1.3;
        }
        .editorial-prose h4 {
          font-size: 1.2rem;
          font-weight: 700;
          font-family: var(--font-heading);
          color: var(--text-primary);
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .editorial-prose a {
          color: var(--brand-slate-blue);
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
          transition: color 150ms ease;
        }
        .editorial-prose a:hover {
          color: var(--brand-warm-accent);
        }
        .editorial-prose blockquote {
          border-left: 3px solid var(--brand-warm-accent);
          background: var(--bg-secondary);
          padding: 1.25rem 1.5rem;
          margin: 1.8em 0;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          font-size: 1.12rem;
          line-height: 1.7;
          color: var(--text-primary);
        }
        .editorial-prose blockquote p:last-child {
          margin-bottom: 0;
        }
        .editorial-prose pre {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1.15rem 1.35rem;
          margin: 1.8em 0;
          overflow-x: auto;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--text-primary);
        }
        .editorial-prose code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.88em;
          background: var(--bg-secondary);
          padding: 0.2em 0.4em;
          border-radius: 4px;
          border: 1px solid var(--border-color);
        }
        .editorial-prose pre code {
          background: transparent;
          padding: 0;
          border: none;
          font-size: 1em;
        }
        .editorial-prose img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.75em 0;
          display: block;
        }
        .editorial-prose ul, .editorial-prose ol {
          padding-left: 1.5rem;
          margin-bottom: 1.5em;
        }
        .editorial-prose li {
          margin-bottom: 0.5em;
          line-height: 1.7;
        }

        @media (max-width: 992px) {
          .desktop-toc-sidebar {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .editorial-prose {
            font-size: 1.05rem;
          }
          .editorial-prose p {
            font-size: 1.05rem;
          }
          .editorial-prose h1, .editorial-prose h2 {
            font-size: 1.6rem;
          }
          .editorial-prose h3 {
            font-size: 1.3rem;
          }
        }
        @media print {
          header, footer, .desktop-toc-sidebar, .article-action-bar, .article-tags-section, .about-author-section, .related-stories-section, .comments-wrapper-section {
            display: none !important;
          }
          article {
            max-width: 100% !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <main className="container" style={{ maxWidth: "1200px", paddingTop: "2.5rem", paddingBottom: "5rem" }}>
        {/* 2. ARTICLE HEADER (Max-width: 900px, Centered) */}
        <header style={{ maxWidth: "900px", margin: "0 auto 2.5rem" }}>
          {/* Category */}
          {post.category && (
            <div style={{ marginBottom: "0.75rem" }}>
              <Link
                to={`/category/${post.category.slug}`}
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--brand-warm-accent)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {post.category.name}
              </Link>
            </div>
          )}

          {/* Article Title */}
          <h1
            style={{
              fontSize: "clamp(2.1rem, 4.5vw, 3.4rem)",
              fontWeight: 800,
              lineHeight: 1.12,
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
              marginBottom: "1.25rem",
              letterSpacing: "-0.015em",
            }}
          >
            {post.title}
          </h1>

          {/* Short Excerpt */}
          {post.excerpt && (
            <p
              style={{
                fontSize: "1.12rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: "1.75rem",
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Author & Reading Metadata Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.2rem 0",
              borderTop: "1px solid var(--border-color)",
              borderBottom: "1px solid var(--border-color)",
              flexWrap: "wrap",
              gap: "1.25rem",
            }}
          >
            {/* Author Left Info */}
            {post.author && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <Link to={`/author/${post.author.username}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {post.author.avatar && !authorAvatarError ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        onError={() => setAuthorAvatarError(true)}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      getInitials(post.author.name)
                    )}
                  </div>
                </Link>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Link
                      to={`/author/${post.author.username}`}
                      style={{
                        fontSize: "0.98rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        textDecoration: "none",
                      }}
                    >
                      {post.author.name}
                    </Link>
                  </div>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    @{post.author.username}
                  </span>
                </div>

                {user && user._id !== post.author._id && (
                  <button
                    onClick={handleFollowToggle}
                    className={isFollowing ? "btn-secondary" : "btn-primary"}
                    style={{ padding: "0.3rem 0.75rem", fontSize: "0.75rem", marginLeft: "0.5rem" }}
                  >
                    {isFollowing ? <><UserCheck size={13} /> Following</> : <><UserPlus size={13} /> Follow</>}
                  </button>
                )}
              </div>
            )}

            {/* Reading Metadata Right Info */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {formattedDate && <span>{formattedDate}</span>}
              {formattedDate && <span>·</span>}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                <Clock size={14} /> {post.readingTime || 1} min read
              </span>
              <span>·</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                <Eye size={14} /> {post.views || 0} views
              </span>
            </div>
          </div>
        </header>

        {/* 3. HERO COVER IMAGE */}
        <div
          style={{
            maxWidth: "1100px",
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: "10px",
            overflow: "hidden",
            margin: "0 auto 3.5rem",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {post.featuredImage && !heroImgError ? (
            <img
              src={post.featuredImage}
              alt={post.title}
              loading="lazy"
              onError={() => setHeroImgError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
                color: "var(--text-secondary)",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <Sparkles size={42} strokeWidth={1.5} color="var(--brand-slate-blue)" />
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {post.title}
              </span>
            </div>
          )}
        </div>

        {/* 4. MAIN BODY CONTENT + STICKY TABLE OF CONTENTS SIDEBAR */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: toc.length > 0 ? "minmax(0, 760px) 240px" : "minmax(0, 760px)",
            gap: "52px",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {/* Article Main Body Column (Max 760px) */}
          <div style={{ width: "100%", minWidth: 0 }}>
            {/* Mobile Collapsible TOC if headings exist */}
            {toc.length > 0 && (
              <details
                style={{
                  marginBottom: "2rem",
                  padding: "1rem 1.25rem",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                }}
                className="mobile-toc-details"
              >
                <summary style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <List size={16} /> On this page (Table of Contents)
                </summary>
                <ul style={{ listStyle: "none", margin: "0.75rem 0 0", padding: "0", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {toc.map((item, idx) => (
                    <li key={idx} style={{ paddingLeft: item.level === "h3" ? "1rem" : item.level === "h4" ? "1.5rem" : "0" }}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                        }}
                        style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textDecoration: "none" }}
                      >
                        • {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {/* Render Article HTML Content */}
            <div
              className="editorial-prose"
              dangerouslySetInnerHTML={{ __html: sanitizedContent || DOMPurify.sanitize(post.content) }}
            />

            {/* 5. ARTICLE ACTION BAR (Likes, Bookmark, Share, Print) */}
            <div
              className="article-action-bar"
              style={{
                marginTop: "3.5rem",
                padding: "1.25rem 0",
                borderTop: "1px solid var(--border-color)",
                borderBottom: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {/* Like Button */}
                <button
                  onClick={handleLikeToggle}
                  className="btn-secondary"
                  style={{
                    borderColor: isLiked ? "var(--brand-warm-accent)" : "var(--btn-secondary-border)",
                    color: isLiked ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  <Heart size={16} fill={isLiked ? "var(--brand-warm-accent)" : "none"} color={isLiked ? "var(--brand-warm-accent)" : "currentColor"} />
                  <span>{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
                </button>

                {/* Bookmark Button */}
                <button
                  onClick={handleBookmarkToggle}
                  className="btn-secondary"
                  style={{
                    borderColor: isBookmarked ? "var(--brand-warm-accent)" : "var(--btn-secondary-border)",
                    color: isBookmarked ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  <Bookmark size={16} fill={isBookmarked ? "var(--brand-warm-accent)" : "none"} color={isBookmarked ? "var(--brand-warm-accent)" : "currentColor"} />
                  <span>{isBookmarked ? "Saved" : "Save"}</span>
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {/* Share Button */}
                <button onClick={handleCopyLink} className="btn-secondary" title="Share or Copy Link">
                  {copiedLink ? <Check size={16} color="#10b981" /> : <Share2 size={16} />}
                  <span>{copiedLink ? "Copied!" : "Share"}</span>
                </button>

                {/* Print Button */}
                <button onClick={handlePrint} className="btn-secondary" title="Print Article">
                  <Printer size={16} />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* 6. ARTICLE TAGS */}
            {post.tags && post.tags.length > 0 && (
              <div className="article-tags-section" style={{ marginTop: "2.25rem", marginBottom: "3rem" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "0.75rem",
                  }}
                >
                  TAGS
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {post.tags.map((t) => (
                    <Link
                      key={t._id || t.slug}
                      to={`/tag/${t.slug}`}
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        padding: "0.35rem 0.85rem",
                        borderRadius: "6px",
                        textDecoration: "none",
                        transition: "all 150ms ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = "var(--brand-warm-accent)";
                        e.currentTarget.style.color = "var(--text-primary)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-color)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}
                    >
                      #{t.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 7. ABOUT THE AUTHOR CARD */}
            {post.author && (
              <div
                className="about-author-section"
                style={{
                  marginTop: "3rem",
                  padding: "1.75rem",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "1rem",
                  }}
                >
                  ABOUT THE AUTHOR
                </span>

                <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "flex-start" }}>
                  <Link to={`/author/${post.author.username}`} style={{ textDecoration: "none" }}>
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "1px solid var(--border-color)",
                        background: "var(--bg-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        fontSize: "1.1rem",
                        flexShrink: 0,
                      }}
                    >
                      {post.author.avatar ? (
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        getInitials(post.author.name)
                      )}
                    </div>
                  </Link>

                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                      <Link to={`/author/${post.author.username}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {post.author.name}
                      </Link>
                    </h4>
                    <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
                      @{post.author.username}
                    </span>

                    {post.author.bio && (
                      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 1rem" }}>
                        {post.author.bio}
                      </p>
                    )}

                    <Link
                      to={`/author/${post.author.username}`}
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "var(--brand-slate-blue)",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      View Profile <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 8. RELATED STORIES */}
            {relatedPosts.length > 0 && (
              <section className="related-stories-section" style={{ marginTop: "4rem" }}>
                <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "2.5rem", marginBottom: "1.75rem" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                      marginBottom: "0.35rem",
                    }}
                  >
                    RECOMMENDED READING
                  </span>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)", margin: 0 }}>
                    Related Stories
                  </h3>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
                  {relatedPosts.slice(0, 3).map((rel) => (
                    <PostCard key={rel._id} post={rel} />
                  ))}
                </div>
              </section>
            )}

            {/* 9. COMMENTS SECTION */}
            <div className="comments-wrapper-section" style={{ marginTop: "4rem" }}>
              <CommentSection postId={post._id} />
            </div>
          </div>

          {/* Table of Contents Desktop Sticky Sidebar (240px) */}
          {toc.length > 0 && (
            <aside
              className="desktop-toc-sidebar"
              style={{
                position: "sticky",
                top: "100px",
                width: "240px",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "1.25rem 1rem",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "1rem",
                  }}
                >
                  ON THIS PAGE
                </span>

                <nav style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {toc.map((item) => {
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
                        style={{
                          fontSize: "0.83rem",
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                          textDecoration: "none",
                          borderLeft: isActive ? "3px solid var(--brand-warm-accent)" : "3px solid transparent",
                          paddingLeft: item.level === "h3" ? "1.25rem" : item.level === "h4" ? "1.75rem" : "0.6rem",
                          lineHeight: 1.4,
                          transition: "all 150ms ease",
                          display: "block",
                        }}
                      >
                        {item.text}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </main>
    </>
  );
};

export default PostDetail;
