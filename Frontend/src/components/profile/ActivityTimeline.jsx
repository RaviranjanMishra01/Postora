import React from "react";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, UserPlus, FileText, Bookmark, Bell, Clock } from "lucide-react";

const getActivityIcon = (type) => {
  switch (type) {
    case "like":
      return { icon: Heart, color: "#ec4899", bg: "rgba(236, 72, 153, 0.15)" };
    case "comment":
    case "reply":
      return { icon: MessageSquare, color: "#38bdf8", bg: "rgba(56, 189, 248, 0.15)" };
    case "follow":
      return { icon: UserPlus, color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.15)" };
    case "post_publish":
    case "post":
      return { icon: FileText, color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" };
    case "bookmark":
      return { icon: Bookmark, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" };
    default:
      return { icon: Bell, color: "#94a3b8", bg: "rgba(148, 163, 184, 0.15)" };
  }
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "recently";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

const ActivityTimeline = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem 1.5rem",
          color: "var(--text-muted, #94a3b8)",
          fontStyle: "italic",
        }}
      >
        No recent activity recorded yet.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {activities.map((item, idx) => {
        const { icon: Icon, color, bg } = getActivityIcon(item.type);
        const sender = item.sender || {};
        const post = item.post || {};

        return (
          <div
            key={item._id || idx}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              padding: "1rem 1.25rem",
              background: "var(--bg-card, #1e293b)",
              border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
              borderRadius: "var(--radius-md, 12px)",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: bg,
                color: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={18} />
            </div>

            <div style={{ flexGrow: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-primary, #f8fafc)",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {sender.name ? (
                    <Link
                      to={`/author/${sender.username}`}
                      style={{ fontWeight: 700, color: "var(--text-primary)", textDecoration: "none" }}
                    >
                      {sender.name}
                    </Link>
                  ) : null}{" "}
                  {item.message ||
                    (item.type === "like"
                      ? "liked an article"
                      : item.type === "comment"
                      ? "commented on an article"
                      : item.type === "follow"
                      ? "started following an author"
                      : "published a new article")}
                </p>

                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted, #64748b)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    flexShrink: 0,
                  }}
                >
                  <Clock size={12} /> {formatTimeAgo(item.createdAt)}
                </span>
              </div>

              {post.title && (
                <Link
                  to={`/post/${post.slug || post._id}`}
                  style={{
                    fontSize: "0.83rem",
                    color: "var(--accent-secondary, #38bdf8)",
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-block",
                    marginTop: "0.3rem",
                  }}
                >
                  "{post.title}"
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;
