import React from "react";
import { Activity, Bell, Heart, MessageSquare, Bookmark } from "lucide-react";

const RecentActivity = ({ notifications = [], loading = false }) => {
  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        padding: "1.75rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Activity size={18} color="#FF497C" /> Recent Activity
        </h3>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div className="skeleton" style={{ height: "48px" }} />
          <div className="skeleton" style={{ height: "48px" }} />
          <div className="skeleton" style={{ height: "48px" }} />
        </div>
      ) : notifications.length === 0 ? (
        <div
          style={{
            padding: "2.5rem 1rem",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.88rem",
            margin: "auto 0",
          }}
        >
          <Bell size={28} style={{ marginBottom: "0.5rem", opacity: 0.5 }} />
          <p style={{ color: "var(--text-secondary)", fontWeight: 600 }}>No recent activity yet.</p>
          <span style={{ fontSize: "0.78rem" }}>Interact with stories to build your activity feed.</span>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {notifications.slice(0, 5).map((n) => {
            const timeAgo = n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "";
            return (
              <div
                key={n._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "36px 1fr",
                  gap: "0.75rem",
                  alignItems: "start",
                  paddingBottom: "0.85rem",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FF497C",
                  }}
                >
                  {n.type === "like" ? <Heart size={16} /> : n.type === "comment" ? <MessageSquare size={16} /> : <Bookmark size={16} />}
                </div>

                <div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.4 }}>
                    {n.message || n.sender?.name + " interacted with your post"}
                  </p>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{timeAgo}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
