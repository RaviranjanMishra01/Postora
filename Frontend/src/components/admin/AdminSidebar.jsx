import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart2,
  FileText,
  FolderTree,
  Tag,
  Users,
  MessageSquare,
  AlertTriangle,
  Mail,
  Send,
  Star,
  User,
  LogOut,
  Shield,
  X,
  ExternalLink,
  ShieldCheck,
  KeyRound,
  FileSearch,
  Settings,
  Lock,
  Wrench,
  Activity,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = ({ activeTab, onSelectTab, isMobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";

  const navSections = [
    {
      label: "MAIN",
      items: [
        { id: "overview", label: "Dashboard", icon: LayoutDashboard },
        { id: "analytics", label: "Analytics", icon: BarChart2 },
      ],
    },
    {
      label: "CONTENT",
      items: [
        { id: "posts", label: "Posts", icon: FileText },
        { id: "categories", label: "Categories", icon: FolderTree },
        { id: "tags", label: "Tags", icon: Tag },
        { id: "featured", label: "Featured Content", icon: Star },
      ],
    },
    {
      label: "COMMUNITY",
      items: [
        { id: "users", label: "Users", icon: Users },
        { id: "comments", label: "Comments", icon: MessageSquare },
        { id: "reports", label: "Reports Queue", icon: AlertTriangle },
      ],
    },
    {
      label: "COMMUNICATION",
      items: [
        { id: "support", label: "Support Inbox", icon: Mail },
        { id: "newsletter", label: "Newsletter", icon: Send },
      ],
    },
    // SuperAdmin Exclusive Sections
    ...(isSuperAdmin
      ? [
          {
            label: "ADMINISTRATION",
            items: [
              { id: "admins", label: "Admin Management", icon: ShieldCheck },
              { id: "roles", label: "Roles & Permissions", icon: KeyRound },
              { id: "audit-logs", label: "Audit Logs", icon: FileSearch },
            ],
          },
          {
            label: "SYSTEM",
            items: [
              { id: "system-settings", label: "Site Settings", icon: Settings },
              { id: "security-settings", label: "Security", icon: Lock },
              { id: "system-health", label: "System Health", icon: Activity },
              { id: "maintenance", label: "Maintenance", icon: Wrench },
            ],
          },
        ]
      : []),
    {
      label: "ACCOUNT",
      items: [
        { id: "profile", label: "Profile", icon: User },
        { id: "logout", label: "Logout", icon: LogOut },
      ],
    },
  ];

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 998,
          }}
        />
      )}

      <aside
        className={`admin-sidebar ${isMobileOpen ? "mobile-open" : ""}`}
        style={{
          width: "250px",
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 999,
          transition: "transform 250ms ease",
        }}
      >
        {/* BRAND HEADER */}
        <div
          style={{
            padding: "1.5rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "var(--Postora-pink)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "0.95rem",
              }}
            >
              <Shield size={18} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 900,
                  fontSize: "1.05rem",
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                  display: "block",
                  lineHeight: 1.1,
                }}
              >
                Postora
              </span>
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--Postora-pink)",
                }}
              >
                {isSuperAdmin ? "SUPER ADMIN" : "ADMIN CONSOLE"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="mobile-close-btn"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              display: "none",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION LIST */}
        <div
          style={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "1.25rem 0.85rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {navSections.map((section) => (
            <div key={section.label}>
              <div
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                  padding: "0 0.65rem 0.45rem 0.65rem",
                  textTransform: "uppercase",
                }}
              >
                {section.label}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (item.id === "logout") {
                          logout();
                        } else {
                          onSelectTab(item.id);
                        }
                        if (onCloseMobile) onCloseMobile();
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.6rem 0.75rem",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "var(--btn-primary-text)" : "var(--text-secondary)",
                        background: isActive ? "var(--Postora-pink)" : "transparent",
                        border: "none",
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "left",
                        transition: "all 150ms ease",
                      }}
                    >
                      <Icon size={16} color={isActive ? "#FFFFFF" : "currentColor"} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* VIEW PUBLIC WEBSITE BUTTON */}
          <div style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
            <Link
              to="/"
              className="btn-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
                padding: "0.55rem 0.75rem",
                fontSize: "0.82rem",
                fontWeight: 700,
                borderRadius: "8px",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
                textDecoration: "none",
              }}
            >
              <span>View Public Website</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        {/* ADMIN USER FOOTER */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", minWidth: 0 }}>
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80"}
              alt={user?.name || "Admin"}
              style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover" }}
            />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.name || "Sarah Jenkins"}
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: "var(--Postora-pink)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {user?.role?.toUpperCase() || "ADMIN"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "0.3rem",
            }}
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>

        <style>{`
          @media (max-width: 991px) {
            .admin-sidebar {
              transform: translateX(-100%);
            }
            .admin-sidebar.mobile-open {
              transform: translateX(0);
            }
            .mobile-close-btn {
              display: block !important;
            }
          }
        `}</style>
      </aside>
    </>
  );
};

export default AdminSidebar;
