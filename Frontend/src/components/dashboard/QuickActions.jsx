import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Bookmark, Grid, User, PenTool, FileText } from "lucide-react";

const QuickActions = ({ user }) => {
  const isAuthor = !!user;

  const actions = isAuthor
    ? [
        { label: "Create New Post", link: "/create-post", icon: PenTool, primary: true },
        { label: "View Bookmarks", link: "/bookmarks", icon: Bookmark },
        { label: "Explore Categories", link: "/categories", icon: Grid },
        { label: "Manage Profile", link: "/profile", icon: User },
      ]
    : [
        { label: "Read Latest Stories", link: "/", icon: BookOpen, primary: true },
        { label: "View Saved Bookmarks", link: "/bookmarks", icon: Bookmark },
        { label: "Explore Categories", link: "/categories", icon: Grid },
        { label: "Manage Profile", link: "/profile", icon: User },
      ];

  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <h3
        style={{
          fontSize: "0.85rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-primary)",
          marginBottom: "1rem",
        }}
      >
        QUICK ACTIONS
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link
              key={idx}
              to={action.link}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.85rem 1.1rem",
                borderRadius: "var(--radius-md)",
                background: action.primary ? "#FF497C" : "var(--bg-secondary)",
                color: action.primary ? "#FFFFFF" : "var(--text-primary)",
                border: "1px solid var(--border-color)",
                fontSize: "0.88rem",
                fontWeight: 700,
                transition: "all 180ms ease",
              }}
            >
              <Icon size={16} />
              <span>{action.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;
