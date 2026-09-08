import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, PenTool } from "lucide-react";
import ArticleCard from "../profile/ArticleCard";
import { CardSkeleton } from "../SkeletonLoader";

const MyPostsPreview = ({ posts = [], loading = false, onViewAll, onDeleteSuccess }) => {
  return (
    <section style={{ marginBottom: "2.5rem" }}>
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BookOpen size={18} color="var(--accent-primary, #ec4899)" />
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "var(--text-primary, #f8fafc)",
              margin: 0,
            }}
          >
            My Stories ({posts.length})
          </h2>
        </div>

        {posts.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-primary, #ec4899)",
              fontSize: "0.88rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <span>View all</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.5rem" }}>
          <CardSkeleton />
        </div>
      ) : posts.length === 0 ? (
        <div
          style={{
            padding: "3rem 2rem",
            textAlign: "center",
            borderRadius: "var(--radius-lg, 16px)",
            background: "rgba(30, 41, 59, 0.3)",
            border: "1px dashed var(--border-color, rgba(255, 255, 255, 0.1))",
          }}
        >
          <BookOpen size={36} color="var(--accent-primary, #ec4899)" style={{ marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary, #f8fafc)", margin: "0 0 0.4rem 0" }}>
            No published stories yet
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary, #94a3b8)", margin: "0 0 1.5rem 0" }}>
            Share your ideas, tutorials, and stories with the world.
          </p>
          <Link
            to="/create-post"
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.65rem 1.25rem",
              fontSize: "0.88rem",
              borderRadius: "var(--radius-md, 8px)",
              textDecoration: "none",
            }}
          >
            <PenTool size={16} /> Write a Story
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.5rem" }}>
          {posts.slice(0, 3).map((post) => (
            <ArticleCard
              key={post._id}
              post={post}
              isOwnPost={true}
              onDeleteSuccess={onDeleteSuccess}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MyPostsPreview;
