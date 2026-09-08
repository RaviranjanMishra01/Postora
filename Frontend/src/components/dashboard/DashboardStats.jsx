import React from "react";
import { FileText, Eye, Heart, Users } from "lucide-react";

const formatStatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const DashboardStats = ({
  postsCount = 0,
  totalViews = 0,
  totalLikes = 0,
  followersCount = 0,
}) => {
  const stats = [
    {
      id: "published",
      label: "Published Stories",
      value: postsCount,
      subtext: "Public articles",
      icon: FileText,
      color: "#ec4899",
      bg: "rgba(236, 72, 153, 0.1)",
    },
    {
      id: "views",
      label: "Total Views",
      value: totalViews,
      subtext: "All-time story reads",
      icon: Eye,
      color: "#38bdf8",
      bg: "rgba(56, 189, 248, 0.1)",
    },
    {
      id: "likes",
      label: "Total Likes",
      value: totalLikes,
      subtext: "Reactions received",
      icon: Heart,
      color: "#f43f5e",
      bg: "rgba(244, 63, 94, 0.1)",
    },
    {
      id: "followers",
      label: "Followers",
      value: followersCount,
      subtext: "Subscribers & readers",
      icon: Users,
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.1)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
        gap: "1.25rem",
        marginBottom: "2.5rem",
      }}
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            style={{
              background: "var(--bg-card, #1e293b)",
              border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
              borderRadius: "var(--radius-lg, 14px)",
              padding: "1.35rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.borderColor = stat.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "var(--border-color, rgba(255, 255, 255, 0.08))";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--text-secondary, #94a3b8)",
                }}
              >
                {stat.label}
              </span>

              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: stat.bg,
                  color: stat.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={18} />
              </div>
            </div>

            <div>
              <span
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--text-primary, #f8fafc)",
                  fontFamily: "var(--font-heading, sans-serif)",
                  lineHeight: 1,
                  display: "block",
                  marginBottom: "0.35rem",
                }}
              >
                {formatStatNumber(stat.value)}
              </span>
              <span
                style={{
                  fontSize: "0.76rem",
                  color: "var(--text-muted, #64748b)",
                  display: "block",
                }}
              >
                {stat.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
