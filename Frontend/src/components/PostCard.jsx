import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Eye, Heart, Bookmark } from "lucide-react";
import { interactionApi } from "../api/commentInteractionApi";
import { useAuth } from "../context/AuthContext";
import { toast } from "../context/ToastContext";

const PostCard = ({ post }) => {
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
    <article className="editorial-card" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ position: "relative", height: "200px", width: "100%", overflow: "hidden" }}>
        <Link to={`/post/${post.slug}`}>
          <img
            src={post.featuredImage}
            alt={post.title}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 200ms ease" }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
          />
        </Link>

        {post.category && (
          <span
            className="editorial-category"
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 2,
              background: "var(--bg-card)",
              padding: "0.2rem 0.6rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            {post.category.name}
          </span>
        )}

        <button
          onClick={handleBookmark}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "var(--bg-overlay)",
            border: "1px solid var(--border-color)",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isBookmarked ? "var(--accent-warm)" : "var(--text-inverse)",
            cursor: "pointer",
            backdropFilter: "blur(6px)",
            zIndex: 2,
          }}
          title="Bookmark post"
        >
          <Bookmark size={14} fill={isBookmarked ? "var(--accent-warm)" : "none"} />
        </button>
      </div>

      <div style={{ padding: "1.15rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <h3
          style={{
            fontSize: "1.08rem",
            fontWeight: 700,
            marginBottom: "0.45rem",
            lineHeight: 1.35,
            color: "var(--text-primary)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          <Link
            to={`/post/${post.slug}`}
            style={{ color: "inherit", transition: "color 150ms ease" }}
            onMouseOver={(e) => (e.currentTarget.style.color = "var(--carrino-pink)")}
            onMouseOut={(e) => (e.currentTarget.style.color = "inherit")}
          >
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.86rem",
              marginBottom: "1rem",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              flexGrow: 1,
            }}
          >
            {post.excerpt}
          </p>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--border-color)",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            marginTop: "auto",
          }}
        >
          {post.author ? (
            <Link
              to={`/author/${post.author.username}`}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-primary)", fontWeight: 600 }}
            >
              <img
                src={post.author.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                alt={post.author.name}
                style={{ width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover" }}
              />
              <span>{post.author.name}</span>
            </Link>
          ) : (
            <span>{formattedDate}</span>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
              <Clock size={12} /> {post.readingTime || 3}m
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
              <Eye size={12} /> {post.views || 0}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
              <Heart size={12} fill="var(--carrino-pink)" color="var(--carrino-pink)" /> {post.likesCount || 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
