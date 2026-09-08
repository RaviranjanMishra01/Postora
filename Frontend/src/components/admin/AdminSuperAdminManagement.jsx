import React, { useState, useEffect } from "react";
import { ShieldCheck, Plus, UserX, UserCheck, Trash2, KeyRound, FileSearch, Lock } from "lucide-react";
import { adminApi } from "../../api/commentInteractionApi";
import { toast } from "../../context/ToastContext";

const AdminSuperAdminManagement = ({ activeSubTab, users = [], onRefresh }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    if (activeSubTab === "audit-logs") {
      adminApi
        .getAuditLogs()
        .then((res) => setAuditLogs(res.data.auditLogs || []))
        .catch((err) => console.error(err));
    }
  }, [activeSubTab]);

  const adminsList = users.filter((u) => u.role === "admin" || u.role === "superadmin");

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Create user and promote to admin
      const res = await adminApi.updateUserRole(adminEmail, { role: "admin" });
      toast.success("New Admin assigned successfully");
      setShowCreateModal(false);
      setAdminName("");
      setAdminUsername("");
      setAdminEmail("");
      setAdminPassword("");
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || "Failed to create Admin");
    } finally {
      setSubmitting(false);
    }
  };

  const rolesMatrix = [
    { role: "USER", permissions: ["Read Articles", "Like & Comment", "Bookmark Stories", "Follow Authors"] },
    { role: "AUTHOR", permissions: ["Create & Edit Own Posts", "Manage Own Profile", "Read & Comment"] },
    { role: "ADMIN", permissions: ["Moderate All Posts & Comments", "Manage Categories & Tags", "Suspend Users", "View Analytics", "Manage Support Inbox"] },
    { role: "SUPER_ADMIN", permissions: ["Full System Ownership", "Manage Admins & Roles", "Inspect Audit Logs", "System Configuration", "Maintenance Mode"] },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* 1. ADMIN MANAGEMENT SUB-TAB */}
      {activeSubTab === "admins" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
                <ShieldCheck color="var(--carrino-pink)" size={18} /> Administrator Roster & Permissions ({adminsList.length})
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "0.2rem 0 0 0" }}>
                Manage administrator credentials and authorization scope
              </p>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowCreateModal(true)}
              style={{ padding: "0.45rem 0.85rem", fontSize: "0.82rem", borderRadius: "8px" }}
            >
              <Plus size={15} /> Promote / Add Admin
            </button>
          </div>

          {/* CREATE ADMIN MODAL */}
          {showCreateModal && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
              onClick={() => setShowCreateModal(false)}
            >
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.75rem",
                  width: "100%",
                  maxWidth: "460px",
                  boxShadow: "var(--shadow-subtle)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 1rem 0", fontFamily: "var(--font-heading)" }}>
                  Assign Administrator Role
                </h3>
                <form onSubmit={handleCreateAdmin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div>
                    <label className="form-label">User Account Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="user@example.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Assign Allowed Permissions</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><input type="checkbox" defaultChecked /> Manage Posts</label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><input type="checkbox" defaultChecked /> Manage Users</label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><input type="checkbox" defaultChecked /> Categories & Tags</label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><input type="checkbox" defaultChecked /> Moderate Comments</label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><input type="checkbox" defaultChecked /> View Analytics</label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><input type="checkbox" defaultChecked /> Manage Reports</label>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                    <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary" disabled={submitting}>
                      {submitting ? "Assigning..." : "Assign Admin Role"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

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
                  <th style={{ padding: "0.75rem" }}>Administrator</th>
                  <th style={{ padding: "0.75rem" }}>Email</th>
                  <th style={{ padding: "0.75rem" }}>Role Level</th>
                  <th style={{ padding: "0.75rem" }}>Status</th>
                  <th style={{ padding: "0.75rem", textAlign: "right" }}>Actions / Protection</th>
                </tr>
              </thead>
              <tbody>
                {adminsList.map((a) => (
                  <tr key={a._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "0.85rem 0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                        <img src={a.avatar || "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80"} alt={a.name} style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
                        <span>{a.name}</span>
                      </div>
                    </td>

                    <td style={{ padding: "0.85rem 0.75rem", color: "var(--text-secondary)" }}>{a.email}</td>

                    <td style={{ padding: "0.85rem 0.75rem" }}>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          padding: "0.15rem 0.5rem",
                          borderRadius: "4px",
                          textTransform: "uppercase",
                          background: a.role === "superadmin" ? "var(--brand-soft)" : "rgba(139, 92, 246, 0.15)",
                          color: a.role === "superadmin" ? "var(--carrino-pink)" : "var(--accent-purple)",
                        }}
                      >
                        {a.role}
                      </span>
                    </td>

                    <td style={{ padding: "0.85rem 0.75rem" }}>
                      <span style={{ fontSize: "0.72rem", fontWeight: 800, color: a.status === "suspended" ? "#EF4444" : "var(--accent-green)", textTransform: "uppercase" }}>
                        {a.status}
                      </span>
                    </td>

                    <td style={{ padding: "0.85rem 0.75rem", textAlign: "right", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                      {a.role === "superadmin" ? (
                        "System Owner (Protected)"
                      ) : (
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const res = await adminApi.toggleUserStatus(a._id);
                              toast.info(res.data.message || `Account ${a.status === "active" ? "suspended" : "activated"}`);
                              if (onRefresh) onRefresh();
                            } catch (err) {
                              toast.error(err.message);
                            }
                          }}
                          style={{
                            background: "none",
                            border: "1px solid var(--border-color)",
                            borderRadius: "6px",
                            padding: "0.25rem 0.55rem",
                            fontSize: "0.75rem",
                            color: a.status === "suspended" ? "var(--accent-green)" : "#EF4444",
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          {a.status === "suspended" ? "Restore Admin" : "Suspend Admin"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. ROLES & PERMISSIONS MATRIX SUB-TAB */}
      {activeSubTab === "roles" && (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 1.25rem 0", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <KeyRound color="var(--carrino-pink)" size={18} /> Role-Based Access Control (RBAC) Matrix
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {rolesMatrix.map((r) => (
              <div
                key={r.role}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  padding: "1.25rem",
                }}
              >
                <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.75rem", fontFamily: "var(--font-heading)" }}>
                  {r.role}
                </div>
                <ul style={{ paddingLeft: "1.2rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {r.permissions.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. AUDIT LOGS SUB-TAB */}
      {activeSubTab === "audit-logs" && (
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
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 1.25rem 0", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileSearch color="var(--carrino-pink)" size={18} /> System Audit Trail & Event Logs
          </h3>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                <th style={{ padding: "0.75rem" }}>Timestamp</th>
                <th style={{ padding: "0.75rem" }}>Actor</th>
                <th style={{ padding: "0.75rem" }}>Action</th>
                <th style={{ padding: "0.75rem" }}>Target / Detail</th>
                <th style={{ padding: "0.75rem" }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "0.75rem", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: "0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {log.actor}
                  </td>
                  <td style={{ padding: "0.75rem", fontWeight: 700, color: "var(--carrino-pink)" }}>
                    {log.action}
                  </td>
                  <td style={{ padding: "0.75rem", color: "var(--text-secondary)" }}>
                    {log.target}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--accent-green)" }}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSuperAdminManagement;
