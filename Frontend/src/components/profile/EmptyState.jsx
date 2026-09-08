import React from "react";
import { Link } from "react-router-dom";
import { FolderOpen, Bookmark, Heart, FileEdit, Activity, Plus } from "lucide-react";

const iconMap = {
  posts: FolderOpen,
  saved: Bookmark,
  liked: Heart,
  drafts: FileEdit,
  activity: Activity,
};

const EmptyState = ({
  type = "posts",
  title,
  description,
  actionLabel,
  actionLink,
  onActionClick,
}) => {
  const IconComponent = iconMap[type] || FolderOpen;

  const defaultContent = {
    posts: {
      title: "No published posts yet",
      description: "Share your ideas, tutorials, and stories with the world.",
      actionLabel: "Create Your First Post",
      actionLink: "/create-post",
    },
    saved: {
      title: "No saved articles",
      description: "Bookmark interesting articles to read or reference later.",
      actionLabel: "Explore Articles",
      actionLink: "/",
    },
    liked: {
      title: "No liked articles yet",
      description: "Show appreciation for great content by liking articles.",
      actionLabel: "Discover Stories",
      actionLink: "/",
    },
    drafts: {
      title: "No draft posts",
      description: "You don't have any unpublished drafts in progress.",
      actionLabel: "Start New Draft",
      actionLink: "/create-post",
    },
    activity: {
      title: "No recent activity",
      description: "Your interactions, likes, and publications will appear here.",
      actionLabel: "Browse Feed",
      actionLink: "/",
    },
  };

  const current = defaultContent[type] || defaultContent.posts;
  const finalTitle = title || current.title;
  const finalDesc = description || current.description;
  const finalLabel = actionLabel || current.actionLabel;
  const finalLink = actionLink || current.actionLink;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3.5rem 2rem",
        textAlign: "center",
        background: "rgba(30, 41, 59, 0.4)",
        border: "1px dashed var(--border-color, #334155)",
        borderRadius: "var(--radius-lg, 16px)",
        margin: "1.5rem 0",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "rgba(236, 72, 153, 0.1)",
          color: "var(--accent-primary, #ec4899)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.25rem",
          border: "1px solid rgba(236, 72, 153, 0.2)",
        }}
      >
        <IconComponent size={28} />
      </div>

      <h3
        style={{
          fontSize: "1.2rem",
          fontWeight: 700,
          color: "var(--text-primary, #f8fafc)",
          marginBottom: "0.4rem",
        }}
      >
        {finalTitle}
      </h3>

      <p
        style={{
          fontSize: "0.9rem",
          color: "var(--text-secondary, #94a3b8)",
          maxWidth: "420px",
          lineHeight: 1.5,
          marginBottom: "1.5rem",
        }}
      >
        {finalDesc}
      </p>

      {onActionClick ? (
        <button
          type="button"
          onClick={onActionClick}
          className="btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.25rem" }}
        >
          <Plus size={16} />
          <span>{finalLabel}</span>
        </button>
      ) : finalLink ? (
        <Link
          to={finalLink}
          className="btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.25rem" }}
        >
          <Plus size={16} />
          <span>{finalLabel}</span>
        </Link>
      ) : null}
    </div>
  );
};

export default EmptyState;
