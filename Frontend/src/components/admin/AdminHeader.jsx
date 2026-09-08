import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Search, Menu, Moon, Sun, ExternalLink, LayoutDashboard, User, LogOut, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const AdminHeader = ({ title, subtitle, onToggleMobileSidebar, unreadNotificationsCount = 0, onOpenNotifications }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isSuperAdmin = user?.role === "superadmin";

  return (
    <header
      style={{
        padding: "1.1rem 2rem",
        background: "var(--bg-card)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.5rem",
        position: "sticky",
        top: 0,
        zIndex: 90,
        boxShadow: "var(--shadow-subtle)",
      }}
    >
      {/* LEFT: Title & Breadcrumbs */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="admin-hamburger-btn"
          style={{
            background: "none",
            border: "none",
            color: "var(--text-primary)",
            cursor: "pointer",
            display: "none",
            padding: "0.25rem",
          }}
        >
          <Menu size={22} />
        </button>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", fontWeight: 800, color: "var(--carrino-pink)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            <Shield size={13} /> {isSuperAdmin ? "CARRINO / SUPER ADMIN CONSOLE" : "CARRINO / ADMIN CONSOLE"}
          </div>
          <h1
            style={{
              fontSize: "1.3rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
              lineHeight: 1.2,
              margin: "0.15rem 0 0 0",
            }}
          >
            {title || "Dashboard Overview"}
          </h1>
        </div>
      </div>

      {/* RIGHT: Search, Theme Toggle, Notifications & Avatar Dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
        {/* Search Action */}
        <button
          type="button"
          onClick={() => setShowSearchModal(!showSearchModal)}
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-primary)",
            cursor: "pointer",
          }}
          title="Search Admin Console"
        >
          <Search size={16} />
        </button>

        {/* Theme Switcher Button */}
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-primary)",
            cursor: "pointer",
          }}
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Notifications Icon Button */}
        <button
          type="button"
          onClick={onOpenNotifications}
          style={{
            position: "relative",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-primary)",
            cursor: "pointer",
          }}
          title="Notifications"
        >
          <Bell size={16} />
          {unreadNotificationsCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                background: "var(--carrino-pink)",
                color: "#FFFFFF",
                fontSize: "0.65rem",
                fontWeight: 900,
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Admin Avatar & Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80"}
              alt={user?.name || "Admin"}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "1.5px solid var(--carrino-pink)",
              }}
            />
          </button>

          {isDropdownOpen && (
            <div
              className="glass-card-admin"
              style={{
                position: "absolute",
                top: "120%",
                right: 0,
                width: "210px",
                padding: "0.4rem 0",
                zIndex: 1000,
              }}
            >
              <div style={{ padding: "0.5rem 0.85rem", borderBottom: "1px solid var(--border-color)", marginBottom: "0.2rem" }}>
                <p style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--text-primary)", margin: 0 }}>{user?.name || "Alex Vance"}</p>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--carrino-pink)", textTransform: "uppercase" }}>
                  {user?.role?.toUpperCase() || "SUPER ADMIN"}
                </span>
              </div>

              <Link
                to="/admin/dashboard"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0.85rem", fontSize: "0.82rem", color: "var(--text-primary)", textDecoration: "none" }}
                onClick={() => setIsDropdownOpen(false)}
              >
                <LayoutDashboard size={14} color="var(--carrino-pink)" /> {isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard"}
              </Link>

              <Link
                to="/profile"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0.85rem", fontSize: "0.82rem", color: "var(--text-primary)", textDecoration: "none" }}
                onClick={() => setIsDropdownOpen(false)}
              >
                <User size={14} /> Profile Settings
              </Link>

              <Link
                to="/"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0.85rem", fontSize: "0.82rem", color: "var(--text-primary)", textDecoration: "none" }}
                onClick={() => setIsDropdownOpen(false)}
              >
                <ExternalLink size={14} /> View Public Website ↗
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  color: "#f87171",
                  cursor: "pointer",
                  borderTop: "1px solid var(--border-color)",
                  marginTop: "0.2rem",
                  padding: "0.45rem 0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.82rem",
                }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .admin-hamburger-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};

export default AdminHeader;
