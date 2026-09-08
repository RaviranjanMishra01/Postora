import React from "react";
import { FileText, Bookmark, Heart, FileEdit, Activity } from "lucide-react";

const ProfileContentTabs = ({ activeTab = "myposts", onTabChange, counts = {} }) => {
  const tabs = [
    { id: "myposts", label: "My Posts", icon: FileText, count: counts.myposts },
    { id: "saved", label: "Saved", icon: Bookmark, count: counts.saved },
    { id: "liked", label: "Liked", icon: Heart, count: counts.liked },
    { id: "drafts", label: "Drafts", icon: FileEdit, count: counts.drafts },
    { id: "activity", label: "Activity", icon: Activity, count: counts.activity },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        borderBottom: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
        marginBottom: "1.75rem",
        overflowX: "auto",
        scrollbarWidth: "none",
        paddingBottom: "2px",
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              background: isActive
                ? "rgba(236, 72, 153, 0.12)"
                : "transparent",
              color: isActive
                ? "var(--accent-primary, #ec4899)"
                : "var(--text-secondary, #94a3b8)",
              border: "none",
              borderBottom: isActive
                ? "2.5px solid var(--accent-primary, #ec4899)"
                : "2.5px solid transparent",
              borderRadius: "8px 8px 0 0",
              fontWeight: isActive ? 700 : 500,
              fontSize: "0.9rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.18s ease",
            }}
          >
            <Icon size={16} />
            <span>{tab.label}</span>

            {tab.count !== undefined && tab.count > 0 && (
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "0.15rem 0.45rem",
                  borderRadius: "10px",
                  background: isActive
                    ? "var(--accent-primary, #ec4899)"
                    : "rgba(255, 255, 255, 0.1)",
                  color: isActive ? "#ffffff" : "var(--text-muted, #94a3b8)",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ProfileContentTabs;
