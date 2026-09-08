import React from "react";
import { Link } from "react-router-dom";
import { PenTool, BookOpen, Bookmark, User, ArrowRight, Zap } from "lucide-react";

const QuickActions = ({ onNavigateSection }) => {
  const actions = [
    {
      id: "write",
      label: "Write a Story",
      subtext: "Create & publish a new article",
      link: "/create-post",
      icon: PenTool,
      accent: "#ec4899",
      bg: "rgba(236, 72, 153, 0.12)",
    },
    {
      id: "stories",
      label: "My Stories",
      subtext: "Manage published articles & drafts",
      link: "/dashboard?tab=myposts",
      icon: BookOpen,
      accent: "#38bdf8",
      bg: "rgba(56, 189, 248, 0.12)",
      onClick: () => onNavigateSection && onNavigateSection("myposts"),
    },
    {
      id: "saved",
      label: "Saved Stories",
      subtext: "Access your bookmarked reading list",
      link: "/bookmarks",
      icon: Bookmark,
      accent: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.12)",
    },
    {
      id: "profile",
      label: "Edit Profile",
      subtext: "Update avatar, bio & account info",
      link: "/profile",
      icon: User,
      accent: "#10b981",
      bg: "rgba(16, 185, 129, 0.12)",
    },
  ];

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.5rem",
        borderRadius: "var(--radius-lg, 16px)",
        background: "var(--bg-card, #1e293b)",
        border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.25rem",
        }}
      >
        <Zap size={18} color="var(--accent-primary, #ec4899)" />
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 800,
            color: "var(--text-primary, #f8fafc)",
            margin: 0,
          }}
        >
          Quick Actions
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.id}
              to={action.link}
              onClick={(e) => {
                if (action.onClick) {
                  e.preventDefault();
                  action.onClick();
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.85rem 1rem",
                borderRadius: "var(--radius-md, 10px)",
                background: "var(--bg-secondary, #0f172a)",
                border: "1px solid var(--border-color, rgba(255, 255, 255, 0.06))",
                textDecoration: "none",
                transition: "transform 0.15s ease, border-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(4px)";
                e.currentTarget.style.borderColor = action.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.borderColor = "var(--border-color, rgba(255, 255, 255, 0.06))";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: action.bg,
                    color: action.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      color: "var(--text-primary, #f8fafc)",
                      margin: 0,
                    }}
                  >
                    {action.label}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.76rem",
                      color: "var(--text-muted, #94a3b8)",
                      margin: "0.1rem 0 0 0",
                    }}
                  >
                    {action.subtext}
                  </p>
                </div>
              </div>

              <ArrowRight size={16} color="var(--text-muted, #64748b)" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
