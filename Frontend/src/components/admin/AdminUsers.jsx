import React, { useState } from "react";
import { Search, Filter, Shield, UserX, UserCheck, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const AdminUsers = ({ users, onRoleChange, onToggleStatus, onDeleteUser, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* FILTER & SEARCH BAR */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", minWidth: "260px", flexGrow: 1 }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search users by name, handle, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 1rem 0.6rem 2.4rem",
              borderRadius: "8px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontSize: "0.88rem",
              outline: "none",
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: "0.6rem 0.85rem",
              borderRadius: "8px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontSize: "0.85rem",
              outline: "none",
            }}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="author">Author</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "0.6rem 0.85rem",
              borderRadius: "8px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontSize: "0.85rem",
              outline: "none",
            }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* USERS TABLE */}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-heading)" }}>
            Registered Platform Users ({filteredUsers.length})
          </h3>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
              <th style={{ padding: "0.75rem" }}>User</th>
              <th style={{ padding: "0.75rem" }}>Handle</th>
              <th style={{ padding: "0.75rem" }}>Email</th>
              <th style={{ padding: "0.75rem" }}>Role</th>
              <th style={{ padding: "0.75rem" }}>Status</th>
              <th style={{ padding: "0.75rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                  No users found matching filters.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "0.85rem 0.75rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                      <img
                        src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                        alt={u.name}
                        style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <span>{u.name}</span>
                    </div>
                  </td>

                  <td style={{ padding: "0.85rem 0.75rem", color: "var(--text-secondary)" }}>
                    @{u.username}
                  </td>

                  <td style={{ padding: "0.85rem 0.75rem", color: "var(--text-secondary)" }}>
                    {u.email}
                  </td>

                  <td style={{ padding: "0.85rem 0.75rem" }}>
                    <select
                      value={u.role}
                      onChange={(e) => onRoleChange(u._id, e.target.value)}
                      style={{
                        padding: "0.3rem 0.6rem",
                        borderRadius: "6px",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        color: "var(--text-primary)",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <option value="user">User</option>
                      <option value="author">Author</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td style={{ padding: "0.85rem 0.75rem" }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                        background: u.status === "suspended" ? "rgba(239, 68, 68, 0.15)" : "rgba(25, 184, 138, 0.15)",
                        color: u.status === "suspended" ? "#EF4444" : "var(--accent-green)",
                      }}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td style={{ padding: "0.85rem 0.75rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <Link to={`/author/${u.username}`} className="btn-secondary" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }} title="View Profile">
                        <ExternalLink size={13} /> Profile
                      </Link>

                      <button
                        type="button"
                        onClick={() => onToggleStatus(u._id)}
                        className="btn-secondary"
                        style={{
                          padding: "0.3rem 0.6rem",
                          fontSize: "0.75rem",
                          color: u.status === "suspended" ? "var(--accent-green)" : "#EF4444",
                          borderColor: u.status === "suspended" ? "var(--accent-green)" : "rgba(239,68,68,0.3)",
                        }}
                      >
                        {u.status === "suspended" ? (
                          <>
                            <UserCheck size={13} /> Activate
                          </>
                        ) : (
                          <>
                            <UserX size={13} /> Suspend
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteUser(u._id)}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.3rem" }}
                        title="Delete User Account"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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

export default AdminUsers;
