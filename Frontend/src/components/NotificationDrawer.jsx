import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Check, Trash2, X, UserPlus, MessageSquare, Heart, FileText } from "lucide-react";
import { notificationApi } from "../api/commentInteractionApi";
import { toast } from "../context/ToastContext";

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "recently";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) === 1 ? "" : "s"} ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) === 1 ? "" : "s"} ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
};

const defaultAvatar =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80";

const NotificationDrawer = ({ notifications = [], isOpen, onClose, onRefresh }) => {
  const navigate = useNavigate();

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

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationApi.deleteNotification(id);
      onRefresh();
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  const handleItemClick = async (n) => {
    if (!n.isRead) {
      try {
        await notificationApi.markAsRead(n._id);
        onRefresh();
      } catch (err) {
        console.error("Error marking notification read:", err);
      }
    }

    onClose();

    if (n.type === "follow") {
      if (n.sender?.username) {
        navigate(`/author/${n.sender.username}`);
      } else if (n.sender?._id) {
        navigate(`/author/${n.sender._id}`);
      }
    } else if (n.post?.slug) {
      navigate(`/post/${n.post.slug}`);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "380px",
        maxWidth: "100vw",
        background: "var(--bg-card, #FFFFFF)",
        borderLeft: "1px solid var(--border-color, #EFE9E3)",
        zIndex: 1000,
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        boxShadow: "var(--shadow-subtle, 0 4px 20px rgba(0,0,0,0.08))",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)" }}>
          <Bell size={18} color="var(--accent-primary, #FF497C)" /> Notifications
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="btn-secondary"
            style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem", borderRadius: "6px", cursor: "pointer" }}
            title="Mark all read"
          >
            <Check size={14} /> Read all
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "4rem", color: "var(--text-muted)" }}>
            <Bell size={32} style={{ opacity: 0.3, marginBottom: "0.5rem" }} />
            <p style={{ fontSize: "0.88rem", margin: 0 }}>No new notifications yet.</p>
          </div>
        ) : (
          notifications.map((n) => {
            const senderName = n.sender?.name || "Someone";
            const senderAvatar = n.sender?.avatar || defaultAvatar;
            const senderHandle = n.sender?.username ? `@${n.sender.username}` : "";

            return (
              <div
                key={n._id}
                onClick={() => handleItemClick(n)}
                style={{
                  padding: "0.85rem 0.95rem",
                  borderRadius: "var(--radius-md, 12px)",
                  background: n.isRead ? "var(--bg-secondary, #F9F8F6)" : "var(--bg-surface, #EFE9E3)",
                  border: n.isRead
                    ? "1px solid var(--border-color, #EFE9E3)"
                    : "1px solid var(--accent-primary, #FF497C)",
                  display: "flex",
                  gap: "0.75rem",
                  position: "relative",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, background 0.15s ease",
                }}
              >
                {/* Unread Pink Dot Badge */}
                {!n.isRead && (
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--accent-primary, #FF497C)",
                    }}
                  />
                )}

                {/* Avatar with type badge overlay */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <img
                    src={senderAvatar}
                    alt={senderName}
                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      right: "-2px",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: n.type === "follow" ? "#8b5cf6" : "#FF497C",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {n.type === "follow" && <UserPlus size={10} />}
                    {n.type === "comment" && <MessageSquare size={10} />}
                    {n.type === "reply" && <MessageSquare size={10} />}
                    {n.type === "like" && <Heart size={10} />}
                    {n.type === "post_publish" && <FileText size={10} />}
                  </div>
                </div>

                {/* Content */}
                <div style={{ flexGrow: 1, minWidth: 0, fontSize: "0.85rem", paddingRight: "1rem" }}>
                  <p style={{ color: "var(--text-primary)", margin: 0, lineHeight: 1.35, fontWeight: n.isRead ? 400 : 600 }}>
                    <strong style={{ fontWeight: 700 }}>{senderName}</strong>{" "}
                    {senderHandle && <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{senderHandle} </span>}
                    {n.type === "comment" && "commented on your post"}
                    {n.type === "reply" && "replied to your comment"}
                    {n.type === "like" && "liked your post"}
                    {n.type === "follow" && "started following you"}
                  </p>

                  {n.post?.title && (
                    <span
                      style={{
                        color: "var(--brand-slate-blue, #547792)",
                        display: "block",
                        marginTop: "0.2rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "0.8rem",
                      }}
                    >
                      "{n.post.title}"
                    </span>
                  )}

                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
                    {formatTimeAgo(n.createdAt)}
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, n._id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    alignSelf: "flex-start",
                    padding: "2px",
                  }}
                  title="Delete notification"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationDrawer;
