import React from "react";
import { User, Key, AlertTriangle } from "lucide-react";

const ProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "security", label: "Security & Password", icon: Key },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle, danger: true },
  ];

  return (
    <nav
      style={{
        borderBottom: "1px solid var(--border-color)",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.75rem",
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          whiteSpace: "nowrap",
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          const color = isActive
            ? "var(--text-primary)"
            : "var(--text-secondary)";

          const borderBottom = isActive
            ? "2px solid var(--text-primary)"
            : "2px solid transparent";

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.75rem 0.25rem",
                fontSize: "0.88rem",
                fontWeight: isActive ? 700 : 600,
                color,
                border: "none",
                borderBottom,
                background: "none",
                cursor: "pointer",
                transition: "all 150ms ease",
              }}
            >
              <Icon size={15} color={isActive ? "var(--text-primary)" : "var(--text-muted)"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default ProfileTabs;
