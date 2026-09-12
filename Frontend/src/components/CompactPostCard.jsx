import React from "react";
import { Link } from "react-router-dom";

const CompactPostCard = ({ post, showImage = true }) => {
  if (!post) return null;

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
        gap: "0.85rem",
        paddingBottom: "1.25rem",
        marginBottom: "1.25rem",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      {showImage && post.featuredImage && (
        <Link
          to={`/post/${post.slug}`}
          style={{
            display: "block",
            width: "100%",
            height: "170px",
            overflow: "hidden",
            borderRadius: "var(--radius-md)",
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
              transition: "transform 200ms ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
          />
        </Link>
      )}

      <div>
        {(post.customCategory || post.category) && (
          <Link
            to={post.category?.slug ? `/category/${post.category.slug}` : `/categories`}
            className="editorial-category"
            style={{ display: "inline-block", marginBottom: "0.35rem" }}
          >
            {post.customCategory && post.customCategory.trim() ? post.customCategory : post.category?.name}
          </Link>
        )}

        <h3
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            lineHeight: 1.35,
            color: "var(--text-primary)",
            marginBottom: "0.4rem",
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

        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          {formattedDate}
        </div>
      </div>
    </article>
  );
};

export default CompactPostCard;
