import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, FileText, Bookmark, Users, Activity, User, Settings, PenTool } from "lucide-react";

const DashboardSidebar = ({ user, activeSection, onSectionChange }) => {
  const location = useLocation();
  const isAuthor = !!user;

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Layout },
    ...(isAuthor ? [{ id: "myposts", label: "My Posts", icon: FileText }] : []),
    { id: "bookmarks", label: "Saved Bookmarks", icon: Bookmark, link: "/bookmarks" },
    { id: "following", label: "Following Feed", icon: Users, link: "/feed" },
    { id: "activity", label: "Recent Activity", icon: Activity },
    { id: "profile", label: "Profile Settings", icon: User, link: "/profile" },
  ];

  return (
    <aside
      style={{
        width: "260px",
        flexShrink: 0,
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        padding: "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        height: "fit-content",
        position: "sticky",
        top: "90px",
      }}
      className="dashboard-sidebar-container"
    >
      {/* Identity Card */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.85rem",
          paddingBottom: "1.25rem",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            overflow: "hidden",
            background: "#FF497C",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "1rem",
            flexShrink: 0,
          }}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            getInitials(user?.name)
          )}
        </div>

        <div style={{ overflow: "hidden" }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.name}
          </h4>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "capitalize" }}>
            @{user?.username} · {user?.role || "user"}
          </span>
        </div>
      </div>

      {/* Author Create Post Button */}
      {isAuthor && (
        <Link
          to="/create-post"
          className="btn-primary"
          style={{ width: "100%", justifyContent: "center", padding: "0.55rem 1rem" }}
        >
          <PenTool size={14} /> + Create New Post
        </Link>
      )}

      {/* Navigation Menu */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          if (item.link) {
            return (
              <Link
                key={item.id}
                to={item.link}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  transition: "all 150ms ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "var(--bg-primary)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <Icon size={16} color="var(--brand-slate-blue)" />
                <span>{item.label}</span>
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                padding: "0.6rem 0.85rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.88rem",
                fontWeight: isActive ? 700 : 600,
                color: isActive ? "#FF497C" : "var(--text-secondary)",
                background: isActive ? "var(--bg-primary)" : "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 150ms ease",
              }}
            >
              <Icon size={16} color={isActive ? "#FF497C" : "var(--brand-slate-blue)"} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
