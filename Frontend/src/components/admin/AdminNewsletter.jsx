import React from "react";
import { Send, CheckCircle2, Search } from "lucide-react";

const AdminNewsletter = ({ subscribers = [] }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* HEADER */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Send color="var(--Postora-pink)" size={18} /> Newsletter Subscribers ({subscribers.length})
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "0.2rem 0 0 0" }}>
            Manage platform newsletter readership list
          </p>
        </div>
      </div>

      {/* SUBSCRIBERS TABLE */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "1.5rem",
          boxShadow: "var(--shadow-subtle)",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
              <th style={{ padding: "0.75rem" }}>Email Address</th>
              <th style={{ padding: "0.75rem" }}>Subscribed Date</th>
              <th style={{ padding: "0.75rem" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                  No newsletter subscribers registered yet.
                </td>
              </tr>
            ) : (
              subscribers.map((s) => (
                <tr key={s._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "0.85rem 0.75rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    {s.email}
                  </td>
                  <td style={{ padding: "0.85rem 0.75rem", color: "var(--text-secondary)" }}>
                    {new Date(s.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td style={{ padding: "0.85rem 0.75rem" }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                        background: "rgba(25, 184, 138, 0.15)",
                        color: "var(--accent-green)",
                      }}
                    >
                      Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminNewsletter;
