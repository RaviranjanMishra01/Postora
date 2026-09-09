import React from "react";
import { Link } from "react-router-dom";

const LatestPostList = ({ posts = [] }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <aside style={{ height: "100%" }}>
      <div
        style={{
          fontSize: "0.88rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-primary)",
          paddingBottom: "0.5rem",
          marginBottom: "1.25rem",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        LATEST
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        {posts.slice(0, 5).map((post, idx) => {
          const formattedDate = post.createdAt
            ? new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "";
          const numStr = (idx + 1).toString().padStart(2, "0");

          return (
            <div
              key={post._id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "0.85rem",
                alignItems: "center",
                paddingBottom: idx < 4 ? "1.1rem" : 0,
                borderBottom: idx < 4 ? "1px solid var(--border-color)" : "none",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    lineHeight: 1.35,
                    color: "var(--text-primary)",
                    marginBottom: "0.35rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  <Link
                    to={`/post/${post.slug}`}
                    style={{ color: "inherit", transition: "color 150ms ease" }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "var(--Postora-pink)")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "inherit")}
                  >
                    {post.title}
                  </Link>
                </h4>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  {formattedDate}
                </div>
              </div>

              {post.featuredImage && (
                <Link
                  to={`/post/${post.slug}`}
                  style={{
                    display: "block",
                    width: "68px",
                    height: "54px",
                    flexShrink: 0,
                    overflow: "hidden",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default LatestPostList;
