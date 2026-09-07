import React from "react";
import { Link } from "react-router-dom";
import { Bell, Check, Trash2, X } from "lucide-react";
import { notificationApi } from "../api/commentInteractionApi";
import { toast } from "react-toastify";

const NotificationDrawer = ({ notifications, isOpen, onClose, onRefresh }) => {
  if (!isOpen) return null;

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      toast.success("All notifications marked as read");
      onRefresh();
    } catch (err) {
      toast.error("Failed to update notifications");
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationApi.deleteNotification(id);
      onRefresh();
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "360px",
        background: "var(--bg-card)",
        borderLeft: "1px solid var(--border-color)",
        zIndex: 1000,
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        boxShadow: "var(--shadow-subtle)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h3 style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)" }}>
          <Bell size={18} /> Notifications
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button onClick={handleMarkAllRead} className="btn-secondary" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }} title="Mark all read">
            <Check size={14} /> Read all
          </button>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div style={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {notifications.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", textAlign: "center", marginTop: "3rem", fontSize: "0.9rem" }}>
            No new notifications yet.
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              style={{
                padding: "0.85rem",
                borderRadius: "var(--radius-md)",
                background: n.isRead ? "var(--bg-secondary)" : "var(--bg-surface-secondary)",
                border: "1px solid var(--border-color)",
                display: "flex",
                gap: "0.75rem",
                position: "relative",
              }}
            >
              <img
                src={n.sender?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                alt={n.sender?.name}
                style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div style={{ flexGrow: 1, fontSize: "0.85rem" }}>
                <p style={{ color: "var(--text-primary)" }}>
                  <strong>{n.sender?.name}</strong>{" "}
                  {n.type === "comment" && "commented on your post"}
                  {n.type === "reply" && "replied to your comment"}
                  {n.type === "like" && "liked your post"}
                  {n.type === "follow" && "started following you"}
                </p>
                {n.post && (
                  <Link to={`/post/${n.post.slug}`} onClick={onClose} style={{ color: "var(--accent-secondary)", display: "block", marginTop: "0.25rem", textDecoration: "underline" }}>
                    {n.post.title}
                  </Link>
                )}
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => handleDelete(n._id)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", alignSelf: "flex-start" }}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDrawer;
