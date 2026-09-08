import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Image as ImageIcon } from "lucide-react";
import { interactionApi } from "../api/commentInteractionApi";
import { useAuth } from "../context/AuthContext";
import { toast } from "../context/ToastContext";

const OverlayPostCard = ({ post, height = "280px", showBadgeIcon = false }) => {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!post) return null;

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info("Please log in to bookmark stories");
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

  const commentsCount = typeof post.commentsCount === "number"
    ? post.commentsCount
    : post.comments?.length || 0;

  return (
    <article
      className="carrino-card"
      style={{
        height,
        width: "100%",
        display: "block",
      }}
    >
      <Link to={`/post/${post.slug}`} style={{ display: "block", width: "100%", height: "100%" }}>
        {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={post.title}
            loading="lazy"
            className="carrino-card-img"
          />
        )}

        <div className="carrino-gradient-overlay" />

        {/* Top Badges */}
        <div style={{ position: "absolute", top: "14px", left: "14px", right: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 3 }}>
          {post.category && (
            <span className="carrino-badge-pill" style={{ margin: 0 }}>
              {post.category.name}
            </span>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }}>
            {showBadgeIcon && (
              <span
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  color: "var(--text-primary)",
                  padding: "0.3rem",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ImageIcon size={14} />
              </span>
            )}
            <button
              onClick={handleBookmark}
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isBookmarked ? "#FF497C" : "#FFFFFF",
                cursor: "pointer",
                backdropFilter: "blur(4px)",
              }}
              title="Save story"
            >
              <Bookmark size={14} fill={isBookmarked ? "#FF497C" : "none"} />
            </button>
          </div>
        </div>

        {/* Bottom Content Overlay */}
        <div className="carrino-card-content">
          <h3
            style={{
              fontSize: height > "320px" ? "1.4rem" : "1.1rem",
              fontWeight: 800,
              lineHeight: 1.3,
              color: "#FFFFFF",
              marginBottom: "0.6rem",
              fontFamily: "var(--font-heading)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
            }}
          >
            {post.title}
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              fontSize: "0.78rem",
              color: "rgba(255, 255, 255, 0.88)",
              fontWeight: 500,
              flexWrap: "wrap",
            }}
          >
            {post.author && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                {post.author.avatar && (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    style={{ width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255, 255, 255, 0.6)" }}
                  />
                )}
                <span style={{ fontWeight: 600 }}>by {post.author.name}</span>
              </div>
            )}
            {post.author && formattedDate && <span>·</span>}
            {formattedDate && <span>{formattedDate}</span>}
            {commentsCount > 0 && <span>·</span>}
            {commentsCount > 0 && <span>{commentsCount} {commentsCount === 1 ? "Comment" : "Comments"}</span>}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default OverlayPostCard;
