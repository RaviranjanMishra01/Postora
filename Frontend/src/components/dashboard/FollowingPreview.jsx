import React from "react";
import { Link } from "react-router-dom";
import { Users, ArrowRight } from "lucide-react";

const FollowingPreview = ({ feedPosts = [], loading = false }) => {
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
          <Users size={18} color="#FF497C" /> Following Feed
        </h3>
        <Link
          to="/feed"
          style={{ fontSize: "0.8rem", fontWeight: 700, color: "#FF497C", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}
        >
          View feed <ArrowRight size={13} />
        </Link>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div className="skeleton" style={{ height: "48px" }} />
          <div className="skeleton" style={{ height: "48px" }} />
        </div>
      ) : feedPosts.length === 0 ? (
        <div
          style={{
            padding: "2.5rem 1rem",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.88rem",
            margin: "auto 0",
          }}
        >
          <p style={{ color: "var(--text-secondary)", fontWeight: 600 }}>You're not following any authors yet.</p>
          <span style={{ fontSize: "0.78rem" }}>Follow creators to see their latest publications here.</span>
          <div style={{ marginTop: "1rem" }}>
            <Link to="/" className="btn-secondary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.78rem" }}>
              Discover Authors
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {feedPosts.slice(0, 4).map((post) => (
            <div
              key={post._id}
              style={{
                display: "grid",
                gridTemplateColumns: "36px 1fr",
                gap: "0.75rem",
                alignItems: "center",
                paddingBottom: "0.85rem",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              {post.author?.avatar ? (
                <img src={post.author.avatar} alt={post.author.name} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#FF497C", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem" }}>
                  {post.author?.name?.charAt(0) || "A"}
                </div>
              )}

              <div>
                <h4 style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-primary)", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  <Link to={`/post/${post.slug}`}>{post.title}</Link>
                </h4>
                <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                  by {post.author?.name || "Author"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowingPreview;
