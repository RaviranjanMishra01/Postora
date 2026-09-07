import React from "react";
import { Link } from "react-router-dom";
import { Bookmark, ArrowRight, Clock } from "lucide-react";

const SavedPostsPreview = ({ bookmarks = [], loading = false }) => {
  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        padding: "1.75rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Bookmark size={18} color="#FF497C" /> Saved Articles
        </h3>
        <Link
          to="/bookmarks"
          style={{ fontSize: "0.8rem", fontWeight: 700, color: "#FF497C", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}
        >
          View all <ArrowRight size={13} />
        </Link>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div className="skeleton" style={{ height: "60px" }} />
          <div className="skeleton" style={{ height: "60px" }} />
        </div>
      ) : bookmarks.length === 0 ? (
        <div
          style={{
            padding: "2.5rem 1rem",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.88rem",
            margin: "auto 0",
          }}
        >
          <p style={{ color: "var(--text-secondary)", fontWeight: 600 }}>No saved articles yet.</p>
          <span style={{ fontSize: "0.78rem" }}>Save articles to read them anytime.</span>
          <div style={{ marginTop: "1rem" }}>
            <Link to="/" className="btn-secondary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.78rem" }}>
              Explore Articles
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {bookmarks.slice(0, 4).map((item) => {
            const post = item.post || item;
            if (!post || !post.title) return null;

            return (
              <div
                key={post._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "70px 1fr",
                  gap: "0.85rem",
                  alignItems: "center",
                  paddingBottom: "0.85rem",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                {post.featuredImage && (
                  <Link
                    to={`/post/${post.slug}`}
                    style={{ width: "70px", height: "58px", borderRadius: "var(--radius-sm)", overflow: "hidden", display: "block" }}
                  >
                    <img src={post.featuredImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </Link>
                )}

                <div>
                  {post.category && (
                    <span className="editorial-category" style={{ fontSize: "0.65rem", display: "block", marginBottom: "0.15rem" }}>
                      {post.category.name}
                    </span>
                  )}
                  <h4 style={{ fontSize: "0.88rem", fontWeight: 700, lineHeight: 1.3, color: "var(--text-primary)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </h4>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "0.2rem", marginTop: "0.15rem" }}>
                    <Clock size={11} /> {post.readingTime || 4}m read
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedPostsPreview;
