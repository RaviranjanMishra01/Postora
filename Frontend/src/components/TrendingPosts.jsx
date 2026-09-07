import React from "react";
import { Link } from "react-router-dom";
import SectionHeader from "./SectionHeader";

const TrendingPosts = ({ posts = [] }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section style={{ marginBottom: "3rem" }}>
      <SectionHeader title="TRENDING STORIES" subtitle="Most read articles this week" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {posts.slice(0, 5).map((post, idx) => {
          const numStr = (idx + 1).toString().padStart(2, "0");

          return (
            <div
              key={post._id}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "1rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  color: "var(--accent-warm)",
                  lineHeight: 1,
                  marginBottom: "0.6rem",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {numStr}
              </div>

              {post.category && (
                <Link
                  to={`/category/${post.category.slug}`}
                  className="editorial-category"
                  style={{ marginBottom: "0.35rem", fontSize: "0.68rem" }}
                >
                  {post.category.name}
                </Link>
              )}

              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: "var(--text-primary)",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
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
              </h3>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrendingPosts;
