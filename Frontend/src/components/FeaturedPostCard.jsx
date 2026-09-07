import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Bookmark } from "lucide-react";
import { interactionApi } from "../api/commentInteractionApi";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const FeaturedPostCard = ({ post }) => {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!post) return null;

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info("Please log in to save posts to your bookmarks");
      return;
    }
    try {
      const res = await interactionApi.toggleBookmark(post._id);
      setIsBookmarked(res.data.isBookmarked);
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message || "Failed to update bookmark");
    }
  };

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Link
        to={`/post/${post.slug}`}
        style={{
          display: "block",
          position: "relative",
          width: "100%",
          height: "360px",
          overflow: "hidden",
          borderRadius: "var(--radius-md)",
          marginBottom: "1.25rem",
          border: "1px solid var(--border-color)",
        }}
      >
        <img
          src={post.featuredImage}
          alt={post.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 220ms ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        />
        <button
          onClick={handleBookmark}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "var(--bg-overlay)",
            border: "1px solid var(--border-color)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isBookmarked ? "var(--accent-warm)" : "var(--text-inverse)",
            cursor: "pointer",
            backdropFilter: "blur(6px)",
            zIndex: 2,
          }}
          title="Save story"
        >
          <Bookmark size={16} fill={isBookmarked ? "var(--accent-warm)" : "none"} />
        </button>
      </Link>

      <div style={{ textAlign: "center", padding: "0 0.5rem" }}>
        {post.category && (
          <Link
            to={`/category/${post.category.slug}`}
            className="editorial-category"
            style={{ display: "inline-block", marginBottom: "0.5rem" }}
          >
            {post.category.name}
          </Link>
        )}

        <h1
          style={{
            fontSize: "clamp(1.5rem, 3.2vw, 2.3rem)",
            lineHeight: 1.2,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "0.85rem",
            letterSpacing: "-0.025em",
          }}
        >
          <Link
            to={`/post/${post.slug}`}
            style={{ color: "inherit", transition: "color 150ms ease" }}
            onMouseOver={(e) => (e.currentTarget.style.color = "var(--brand-slate-blue)")}
            onMouseOut={(e) => (e.currentTarget.style.color = "inherit")}
          >
            {post.title}
          </Link>
        </h1>

        {post.excerpt && (
          <p
            style={{
              fontSize: "0.98rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              marginBottom: "1.25rem",
              maxWidth: "680px",
              margin: "0 auto 1.25rem auto",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.excerpt}
          </p>
        )}

        {/* Metadata */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            fontWeight: 500,
          }}
        >
          {post.author && (
            <Link
              to={`/author/${post.author.username}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--text-primary)",
                fontWeight: 600,
              }}
            >
              {post.author.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                />
              )}
              <span>{post.author.name}</span>
            </Link>
          )}

          {formattedDate && <span>·</span>}
          {formattedDate && <span>{formattedDate}</span>}

          <span>·</span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Clock size={13} /> {post.readingTime || 4} min read
          </span>
        </div>
      </div>
    </article>
  );
};

export default FeaturedPostCard;
