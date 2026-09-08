import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  Users,
  Activity,
  Settings,
  PlusCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ProfileSidebar = ({ activeSection = "overview", onSectionChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "myposts", label: "My Posts", icon: FileText },
    { id: "bookmarks", label: "Saved Bookmarks", icon: Bookmark },
    { id: "following", label: "Following Feed", icon: Users },
    { id: "activity", label: "Recent Activity", icon: Activity },
    { id: "settings", label: "Profile Settings", icon: Settings },
  ];

  const defaultAvatar =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

  return (
    <>
      {/* Desktop Persistent Left Sidebar */}
      <aside
        className="profile-desktop-sidebar"
        style={{
          width: "270px",
          flexShrink: 0,
          background: "var(--bg-card, #1e293b)",
          border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
          borderRadius: "var(--radius-lg, 16px)",
          padding: "1.5rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          position: "sticky",
          top: "90px",
          minHeight: "calc(100vh - 120px)",
          alignSelf: "flex-start",
        }}
      >
        {/* User Profile Summary at Top */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <img
            src={user?.avatar || defaultAvatar}
            alt={user?.name || "User"}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2.5px solid var(--accent-primary, #ec4899)",
              flexShrink: 0,
            }}
          />
          <div style={{ overflow: "hidden" }}>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 800,
                color: "var(--text-primary, #f8fafc)",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name || "Member User"}
            </h3>
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--text-muted, #94a3b8)",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              @{user?.username || "user"} • {user?.role || "Author"}
            </p>
          </div>
        </div>

        {/* Prominent + CREATE NEW POST Button */}
        <Link
          to="/create-post"
          className="btn-primary"
          style={{
            width: "100%",
            justifyContent: "center",
            padding: "0.7rem",
            fontSize: "0.88rem",
            fontWeight: 800,
            borderRadius: "var(--radius-md, 10px)",
            textDecoration: "none",
            boxShadow: "0 4px 12px rgba(236, 72, 153, 0.3)",
          }}
        >
          <PlusCircle size={18} /> + CREATE NEW POST
        </Link>

        {/* Navigation Menu */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flexGrow: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSectionChange(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  padding: "0.7rem 0.9rem",
                  borderRadius: "var(--radius-md, 10px)",
                  background: isActive
                    ? "rgba(236, 72, 153, 0.15)"
                    : "transparent",
                  color: isActive
                    ? "var(--accent-primary, #ec4899)"
                    : "var(--text-secondary, #94a3b8)",
                  border: isActive
                    ? "1px solid rgba(236, 72, 153, 0.4)"
                    : "1px solid transparent",
                  fontWeight: isActive ? 800 : 500,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={18} color={isActive ? "var(--accent-primary, #ec4899)" : "currentColor"} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--border-color, rgba(255,255,255,0.08))" }}>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.6rem 0.85rem",
              borderRadius: "var(--radius-md, 10px)",
              background: "transparent",
              border: "none",
              color: "#f43f5e",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <LogOut size={17} /> Log Out
          </button>
        </div>
      </aside>

      {/* Mobile Touch Bottom Navigation Drawer Bar */}
      <div
        className="profile-mobile-bottom-nav"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid var(--border-color, #334155)",
          padding: "0.5rem 0.5rem",
          display: "none",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.2rem",
                background: "none",
                border: "none",
                color: isActive ? "var(--accent-primary, #ec4899)" : "#94a3b8",
                fontSize: "0.68rem",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                padding: "0.2rem 0.35rem",
              }}
            >
              <Icon size={19} />
              <span>{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 992px) {
          .profile-desktop-sidebar {
            display: none !important;
          }
          .profile-mobile-bottom-nav {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default ProfileSidebar;
