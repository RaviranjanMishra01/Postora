import React from "react";
import { FileText, Users, UserCheck, Heart } from "lucide-react";

const formatStatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const ProfileStats = ({
  postsCount = 0,
  followersCount = 0,
  followingCount = 0,
  likesCount = 0,
  onStatClick,
}) => {
  const statsList = [
    {
      id: "posts",
      label: "Posts",
      value: postsCount,
      icon: FileText,
      color: "#ec4899",
      bg: "rgba(236, 72, 153, 0.12)",
    },
    {
      id: "followers",
      label: "Followers",
      value: followersCount,
      icon: Users,
      color: "#38bdf8",
      bg: "rgba(56, 189, 248, 0.12)",
    },
    {
      id: "following",
      label: "Following",
      value: followingCount,
      icon: UserCheck,
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.12)",
    },
    {
      id: "likes",
      label: "Likes",
      value: likesCount,
      icon: Heart,
      color: "#f43f5e",
      bg: "rgba(244, 63, 94, 0.12)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: "1rem",
        marginBottom: "1.75rem",
      }}
    >
      {statsList.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            onClick={() => onStatClick && onStatClick(stat.id)}
            style={{
              background: "var(--bg-card, #1e293b)",
              border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
              borderRadius: "var(--radius-lg, 14px)",
              padding: "1.1rem 1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              cursor: onStatClick ? "pointer" : "default",
              transition: "transform 0.15s ease, border-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (onStatClick) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = stat.color;
              }
            }}
            onMouseLeave={(e) => {
              if (onStatClick) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border-color, rgba(255, 255, 255, 0.08))";
              }
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: stat.bg,
                color: stat.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={20} />
            </div>

            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "var(--text-primary, #f8fafc)",
                  lineHeight: 1.1,
                }}
              >
                {formatStatNumber(stat.value)}
              </span>
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted, #94a3b8)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                {stat.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileStats;
