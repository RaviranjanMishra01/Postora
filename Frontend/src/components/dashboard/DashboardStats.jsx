import React from "react";
import { Bookmark, Users, Activity, FileText } from "lucide-react";

const DashboardStats = ({ user, bookmarksCount = 0, notificationsCount = 0, postsCount = 0 }) => {
  const isAuthor = !!user;

  const stats = [
    {
      label: "Saved Bookmarks",
      value: bookmarksCount,
      icon: Bookmark,
      color: "#FF497C",
    },
    {
      label: "Recent Activity",
      value: notificationsCount,
      icon: Activity,
      color: "#8B5CF6",
    },
    ...(isAuthor
      ? [
          {
            label: "Published Posts",
            value: postsCount,
            icon: FileText,
            color: "#F97316",
          },
        ]
      : []),
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1.25rem",
        marginBottom: "2rem",
      }}
    >
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.35rem" }}>
                {stat.label}
              </span>
              <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-primary)", fontFamily: "var(--font-heading)", lineHeight: 1 }}>
                {stat.value}
              </span>
            </div>

            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                color: stat.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
