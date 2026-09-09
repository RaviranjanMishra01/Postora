import React, { useState } from "react";
import { BarChart2, Eye, Heart, MessageSquare, TrendingUp, Award, Calendar, Users, Layers } from "lucide-react";

const AdminAnalytics = ({ stats, posts = [] }) => {
  const [timeRange, setTimeRange] = useState("30D");
  if (!stats) return null;

  const sortedByViews = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  const sortedByLikes = [...posts].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0)).slice(0, 5);
  const sortedByComments = [...posts].sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0)).slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* 1. TIME RANGE SELECTOR BAR */}
      <div
        className="glass-card-admin"
        style={{
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.92rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
          <Calendar size={18} color="var(--Postora-pink)" /> Analytics Time Window
        </div>

        <div style={{ display: "flex", gap: "0.4rem" }}>
          {[
            { id: "7D", label: "7 Days" },
            { id: "30D", label: "30 Days" },
            { id: "90D", label: "90 Days" },
            { id: "1Y", label: "1 Year" },
          ].map((range) => (
            <button
              key={range.id}
              type="button"
              onClick={() => setTimeRange(range.id)}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "6px",
                fontSize: "0.78rem",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                background: timeRange === range.id ? "var(--Postora-pink)" : "var(--bg-secondary)",
                color: timeRange === range.id ? "#FFFFFF" : "var(--text-secondary)",
                transition: "all 150ms ease",
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. OVERVIEW METRICS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
        <div className="glass-card-admin" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
            Total Readership Views
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
            {(stats.totalViews || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--accent-green)", fontWeight: 700, marginTop: "0.3rem" }}>
            +12.1% ({timeRange})
          </div>
        </div>

        <div className="glass-card-admin" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
            Total Story Likes
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--Postora-pink)", fontFamily: "var(--font-heading)" }}>
            {(stats.totalLikes || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--Postora-pink)", fontWeight: 700, marginTop: "0.3rem" }}>
            +8.4% ({timeRange})
          </div>
        </div>

        <div className="glass-card-admin" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
            Total Discussions & Comments
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--accent-purple)", fontFamily: "var(--font-heading)" }}>
            {(stats.totalComments || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--accent-purple)", fontWeight: 700, marginTop: "0.3rem" }}>
            +6.5% ({timeRange})
          </div>
        </div>

        <div className="glass-card-admin" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
            Active Platform Users
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--accent-blue)", fontFamily: "var(--font-heading)" }}>
            {(stats.totalUsers || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--accent-blue)", fontWeight: 700, marginTop: "0.3rem" }}>
            +5.9% ({timeRange})
          </div>
        </div>
      </div>

      {/* 3. PERFORMANCE RANKINGS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {/* Most Viewed Posts */}
        <div className="glass-card-admin" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 1.25rem 0", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Award color="var(--accent-blue)" size={18} /> Most Viewed Publications
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {sortedByViews.map((p, idx) => (
              <div key={p._id || idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 0.85rem", borderRadius: "8px", background: "var(--bg-secondary)" }}>
                <div style={{ minWidth: 0, paddingRight: "0.5rem" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    0{idx + 1}. {p.title}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>by {p.author?.name || "Author"}</div>
                </div>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--accent-blue)", display: "flex", alignItems: "center", gap: "0.25rem", flexShrink: 0 }}>
                  <Eye size={13} /> {(p.views || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Liked Posts */}
        <div className="glass-card-admin" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 1.25rem 0", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Heart color="var(--Postora-pink)" size={18} /> Most Liked Publications
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {sortedByLikes.map((p, idx) => (
              <div key={p._id || idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 0.85rem", borderRadius: "8px", background: "var(--bg-secondary)" }}>
                <div style={{ minWidth: 0, paddingRight: "0.5rem" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    0{idx + 1}. {p.title}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>by {p.author?.name || "Author"}</div>
                </div>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--Postora-pink)", display: "flex", alignItems: "center", gap: "0.25rem", flexShrink: 0 }}>
                  <Heart size={13} fill="var(--Postora-pink)" /> {(p.likesCount || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
