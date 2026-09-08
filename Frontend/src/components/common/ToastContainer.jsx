import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastItem = ({ toast, onRemove }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.duration]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 250); // Match exit animation duration
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle2 size={20} color="#10B981" />;
      case "error":
        return <XCircle size={20} color="#EF4444" />;
      case "warning":
        return <AlertTriangle size={20} color="#F59E0B" />;
      case "info":
      default:
        return <Info size={20} color="#3B82F6" />;
    }
  };

  const getIconBg = () => {
    switch (toast.type) {
      case "success":
        return "rgba(16, 185, 129, 0.12)";
      case "error":
        return "rgba(239, 68, 68, 0.12)";
      case "warning":
        return "rgba(245, 158, 11, 0.12)";
      case "info":
      default:
        return "rgba(59, 130, 246, 0.12)";
    }
  };

  return (
    <div
      style={{
        pointerEvents: "auto",
        width: "360px",
        maxWidth: "90vw",
        backgroundColor: "var(--bg-card, #182A3D)",
        border: "1px solid var(--border-color, #2D465D)",
        borderRadius: "var(--radius-lg, 12px)",
        padding: "0.85rem 1rem",
        boxShadow: "0 12px 28px -4px rgba(0, 0, 0, 0.35), 0 4px 12px -2px rgba(0, 0, 0, 0.15)",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        color: "var(--text-primary, #F8FAFC)",
        transition: "all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
        transform: exiting ? "translateX(120%) scale(0.95)" : "translateX(0) scale(1)",
        opacity: exiting ? 0 : 1,
        marginBottom: "10px",
      }}
      role="alert"
      aria-live="polite"
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          backgroundColor: getIconBg(),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {getIcon()}
      </div>

      <div style={{ flexGrow: 1, minWidth: 0, paddingTop: "2px" }}>
        <h4
          style={{
            fontSize: "0.88rem",
            fontWeight: 600,
            lineHeight: 1.3,
            color: "var(--text-primary, #F8FAFC)",
            margin: 0,
          }}
        >
          {toast.title}
        </h4>
        {toast.message && (
          <p
            style={{
              fontSize: "0.81rem",
              lineHeight: 1.4,
              color: "var(--text-secondary, #94A3B8)",
              margin: "0.2rem 0 0 0",
              wordBreak: "break-word",
            }}
          >
            {toast.message}
          </p>
        )}
      </div>

      <button
        onClick={handleClose}
        aria-label="Close notification"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-muted, #64748B)",
          cursor: "pointer",
          padding: "4px",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "color 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary, #F8FAFC)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted, #64748B)")}
      >
        <X size={16} />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 999999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

export default ToastContainer;
