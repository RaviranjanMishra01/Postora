import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Heart, Bookmark, Clock, MoreVertical, Edit3, Trash2, Share2, FileText } from "lucide-react";
import { interactionApi } from "../../api/commentInteractionApi";
import { postApi } from "../../api/postApi";
import { toast } from "../../context/ToastContext";

const ArticleCard = ({
  post,
  isOwnPost = false,
  isDraft = false,
  onDeleteSuccess,
  onBookmarkToggle,
  onLikeToggle,
}) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const coverImg =
    post.featuredImage ||
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80";

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic UI
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const res = await interactionApi.toggleLike(post._id);
      if (onLikeToggle) onLikeToggle(post._id, res.data.isLiked);
    } catch (err) {
      // Rollback
      setLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error("Failed to update like status");
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic UI
    const prevBookmarked = bookmarked;
    setBookmarked(!prevBookmarked);

    try {
      const res = await interactionApi.toggleBookmark(post._id);
      toast.success(res.message);
      if (onBookmarkToggle) onBookmarkToggle(post._id, res.data.isBookmarked);
    } catch (err) {
      setBookmarked(prevBookmarked);
      toast.error("Failed to bookmark post");
    }
  };

  const handleCopyLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    const postUrl = `${window.location.origin}/post/${post.slug || post._id}`;
    navigator.clipboard.writeText(postUrl);
    toast.success("Post link copied to clipboard!");
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    setDeleting(true);
    try {
      await postApi.deletePost(post._id);
      toast.success("Article deleted successfully");
      if (onDeleteSuccess) onDeleteSuccess(post._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete post");
    } finally {
      setDeleting(false);
      setShowMenu(false);
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        borderRadius: "var(--radius-lg, 16px)",
        border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
        background: "var(--bg-card, #1e293b)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 12px 24px -6px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Cover Image Container */}
      <div style={{ position: "relative", width: "100%", height: "180px", overflow: "hidden" }}>
        <Link to={isDraft ? `/edit-post/${post._id}` : `/post/${post.slug || post._id}`}>
          <img
            src={coverImg}
            alt={post.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
          />
        </Link>

        {/* Category Pill */}
        {(post.customCategory || post.category) && (
          <span
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: "rgba(15, 23, 42, 0.85)",
              backdropFilter: "blur(4px)",
              color: "var(--accent-primary, #ec4899)",
              fontSize: "0.75rem",
              fontWeight: "700",
              padding: "0.25rem 0.65rem",
              borderRadius: "12px",
              border: "1px solid rgba(236, 72, 153, 0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {post.customCategory && post.customCategory.trim()
              ? post.customCategory
              : typeof post.category === "object"
              ? post.category?.name
              : post.category}
          </span>
        )}

        {/* Draft Badge */}
        {isDraft && (
          <span
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "#eab308",
              color: "#0f172a",
              fontSize: "0.72rem",
              fontWeight: "800",
              padding: "0.2rem 0.55rem",
              borderRadius: "8px",
              textTransform: "uppercase",
            }}
          >
            Draft
          </span>
        )}

        {/* More Actions Menu */}
        {(isOwnPost || isDraft) && (
          <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "38px",
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
                  width: "140px",
                  zIndex: 20,
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    navigate(`/edit-post/${post._id}`);
                  }}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "none",
                    border: "none",
                    color: "#f8fafc",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "none",
                    border: "none",
                    color: "#f8fafc",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <Share2 size={14} /> Share Link
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "none",
                    border: "none",
                    color: "#f43f5e",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <Trash2 size={14} /> {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Link
          to={isDraft ? `/edit-post/${post._id}` : `/post/${post.slug || post._id}`}
          style={{ textDecoration: "none" }}
        >
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: "700",
              color: "var(--text-primary, #f8fafc)",
              lineHeight: 1.35,
              marginBottom: "0.5rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary, #94a3b8)",
              lineHeight: 1.5,
              marginBottom: "1rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.excerpt}
          </p>
        )}

        {/* Footer Meta Details */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--border-color, rgba(255,255,255,0.06))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.78rem",
            color: "var(--text-muted, #64748b)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Clock size={13} /> {post.readingTime || 3} min
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Eye size={13} /> {post.views || 0}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Like Button */}
            <button
              type="button"
              onClick={handleLike}
              style={{
                background: "none",
                border: "none",
                color: liked ? "var(--accent-primary, #ec4899)" : "var(--text-muted, #64748b)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.8rem",
                fontWeight: "600",
                transition: "color 0.15s ease",
              }}
            >
              <Heart size={15} fill={liked ? "currentColor" : "none"} />
              <span>{likesCount}</span>
            </button>

            {/* Bookmark Button */}
            <button
              type="button"
              onClick={handleBookmark}
              style={{
                background: "none",
                border: "none",
                color: bookmarked ? "#38bdf8" : "var(--text-muted, #64748b)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "0.2rem",
                transition: "color 0.15s ease",
              }}
            >
              <Bookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Draft Edit Button CTA */}
        {isDraft && (
          <Link
            to={`/edit-post/${post._id}`}
            className="btn-primary"
            style={{
              marginTop: "0.85rem",
              width: "100%",
              justifyContent: "center",
              padding: "0.5rem",
              fontSize: "0.82rem",
            }}
          >
            <FileText size={14} /> Continue Editing
          </Link>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
