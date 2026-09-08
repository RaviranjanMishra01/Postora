import React, { useState } from "react";
import { Mail, CheckCircle2, Clock, Inbox, MessageSquare } from "lucide-react";
import { contactApi } from "../../api/commentInteractionApi";
import { toast } from "../../context/ToastContext";

const AdminSupport = ({ messages = [], onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredMessages = messages.filter((m) => {
    if (filterStatus === "all") return true;
    return m.status === filterStatus;
  });

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await contactApi.updateMessageStatus(id, { status: newStatus });
      toast.success(`Message marked as ${newStatus}`);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* HEADER BAR */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Mail color="var(--carrino-pink)" size={18} /> Support & Contact Inbox ({filteredMessages.length})
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "0.2rem 0 0 0" }}>
            User feedback, inquiry messages, and support tickets
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.4rem" }}>
          {["all", "new", "in_progress", "resolved"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={filterStatus === st ? "btn-primary" : "btn-secondary"}
              style={{
                padding: "0.45rem 0.85rem",
                fontSize: "0.8rem",
                textTransform: "capitalize",
                borderRadius: "8px",
              }}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* MESSAGES LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {filteredMessages.length === 0 ? (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px dashed var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "3rem 1.5rem",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            <Inbox size={36} style={{ opacity: 0.4, marginBottom: "0.5rem" }} />
            <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              No support messages
            </h4>
            <p style={{ fontSize: "0.85rem", margin: "0.25rem 0 0 0", color: "var(--text-secondary)" }}>
              Your inbox is currently empty.
            </p>
          </div>
        ) : (
          filteredMessages.map((m) => (
            <div
              key={m._id}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "1.35rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.2rem 0", fontFamily: "var(--font-heading)" }}>
                    {m.subject || "Support Inquiry"}
                  </h4>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    From: <strong style={{ color: "var(--text-primary)" }}>{m.name}</strong> ({m.email}) · {new Date(m.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <select
                  value={m.status || "new"}
                  onChange={(e) => handleUpdateStatus(m._id, e.target.value)}
                  style={{
                    padding: "0.35rem 0.65rem",
                    borderRadius: "6px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div style={{ background: "var(--bg-secondary)", padding: "0.85rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <p style={{ fontSize: "0.88rem", color: "var(--text-primary)", margin: 0, lineHeight: 1.5 }}>
                  {m.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminSupport;
