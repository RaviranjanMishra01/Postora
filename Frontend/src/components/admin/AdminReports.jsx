import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, XCircle, Trash2 } from "lucide-react";
import { reportApi } from "../../api/commentInteractionApi";
import { toast } from "../../context/ToastContext";

const AdminReports = ({ reports = [], onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState("pending");

  const filteredReports = reports.filter((r) => {
    if (filterStatus === "all") return true;
    return r.status === filterStatus;
  });

  const handleResolve = async (id, action) => {
    try {
      await reportApi.resolveReport(id, { action });
      toast.success("Report resolved successfully");
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || "Failed to resolve report");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* HEADER & FILTER */}
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
            <AlertTriangle color="var(--Postora-pink)" size={18} /> Moderation Queue ({filteredReports.length})
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "0.2rem 0 0 0" }}>
            Review user reports on posts, comments, or user conduct
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.4rem" }}>
          {["pending", "resolved", "all"].map((st) => (
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
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* REPORTS QUEUE CONTAINER */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {filteredReports.length === 0 ? (
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
            <CheckCircle2 size={36} color="var(--accent-green)" style={{ marginBottom: "0.5rem" }} />
            <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              No {filterStatus} reports
            </h4>
            <p style={{ fontSize: "0.85rem", margin: "0.25rem 0 0 0", color: "var(--text-secondary)" }}>
              The platform moderation queue is currently clear.
            </p>
          </div>
        ) : (
          filteredReports.map((r) => (
            <div
              key={r._id}
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
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      padding: "0.15rem 0.5rem",
                      borderRadius: "4px",
                      textTransform: "uppercase",
                      background: "rgba(239, 68, 68, 0.15)",
                      color: "#EF4444",
                      marginRight: "0.6rem",
                    }}
                  >
                    Target: {r.targetType || "Post"}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Reported by: <strong style={{ color: "var(--text-primary)" }}>{r.reporter?.name || "User"}</strong> · {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    color: r.status === "pending" ? "#EF4444" : "var(--accent-green)",
                  }}
                >
                  Status: {r.status}
                </span>
              </div>

              <div style={{ background: "var(--bg-secondary)", padding: "0.85rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.2rem" }}>
                  Reason Provided:
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", margin: 0, fontWeight: 600 }}>
                  "{r.reason}"
                </p>
              </div>

              {r.status === "pending" && (
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.25rem" }}>
                  <button
                    type="button"
                    onClick={() => handleResolve(r._id, "remove_content")}
                    className="btn-primary"
                    style={{ background: "#EF4444", border: "none", fontSize: "0.78rem", padding: "0.4rem 0.85rem", textTransform: "none" }}
                  >
                    Remove Content
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResolve(r._id, "dismiss")}
                    className="btn-secondary"
                    style={{ fontSize: "0.78rem", padding: "0.4rem 0.85rem" }}
                  >
                    Dismiss Report
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReports;
