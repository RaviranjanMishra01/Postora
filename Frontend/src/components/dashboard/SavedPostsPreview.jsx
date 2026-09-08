import React from "react";
import { Link } from "react-router-dom";
import { Bookmark, Compass } from "lucide-react";
import ArticleCard from "../profile/ArticleCard";
import { CardSkeleton } from "../SkeletonLoader";

const SavedPostsPreview = ({ bookmarks = [], loading = false }) => {
  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.25rem",
        }}
      >
        <Bookmark size={18} color="#38bdf8" />
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "var(--text-primary, #f8fafc)",
            margin: 0,
          }}
        >
          Saved Stories ({bookmarks.length})
        </h2>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.5rem" }}>
          <CardSkeleton />
        </div>
      ) : bookmarks.length === 0 ? (
        <div
          style={{
            padding: "2.5rem 1.75rem",
            textAlign: "center",
            borderRadius: "var(--radius-lg, 16px)",
            background: "rgba(30, 41, 59, 0.3)",
            border: "1px dashed var(--border-color, rgba(255, 255, 255, 0.1))",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(56, 189, 248, 0.12)",
              color: "#38bdf8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem auto",
            }}
          >
            <Bookmark size={22} />
          </div>

          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "var(--text-primary, #f8fafc)",
              margin: "0 0 0.35rem 0",
            }}
          >
            Your reading list is empty
          </h3>

          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary, #94a3b8)",
              maxWidth: "380px",
              margin: "0 auto 1.25rem auto",
              lineHeight: 1.5,
            }}
          >
            Found something worth reading? Save it here and come back anytime.
          </p>

          <Link
            to="/"
            className="btn-secondary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.55rem 1.1rem",
              fontSize: "0.85rem",
              borderRadius: "var(--radius-md, 8px)",
              textDecoration: "none",
            }}
          >
            <Compass size={15} /> Explore Stories →
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.5rem" }}>
          {bookmarks.slice(0, 3).map((post) => (
            <ArticleCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
};

export default SavedPostsPreview;
