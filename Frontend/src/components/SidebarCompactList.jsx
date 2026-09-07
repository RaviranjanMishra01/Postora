import React from "react";
import { Link } from "react-router-dom";

const SidebarCompactList = ({ posts = [] }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", marginBottom: "2rem" }}>
      {posts.slice(0, 4).map((post) => {
        const formattedDate = post.createdAt
          ? new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "";

        return (
          <div
            key={post._id}
            style={{
              display: "grid",
              gridTemplateColumns: "72px 1fr",
              gap: "0.85rem",
              alignItems: "center",
            }}
          >
            {post.featuredImage && (
              <Link
                to={`/post/${post.slug}`}
                style={{
                  width: "72px",
                  height: "64px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  display: "block",
                  flexShrink: 0,
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

            <div>
              <h4
                style={{
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: "var(--text-primary)",
                  marginBottom: "0.25rem",
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
              </h4>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {post.author ? `by ${post.author.name} ` : ""}
                {post.author && formattedDate ? "· " : ""}
                {formattedDate}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SidebarCompactList;
