import React, { useState, useEffect } from "react";
import { LayoutDashboard, Users, FileText, AlertTriangle, Eye, Heart, Shield, CheckCircle, XCircle, Trash2, Star } from "lucide-react";
import { adminApi, reportApi, contactApi } from "../api/commentInteractionApi";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await adminApi.getStats();
      setStats(res.data.stats || null);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await adminApi.getUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await adminApi.getAdminPosts();
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await reportApi.getReports();
      setReports(res.data.reports || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await contactApi.getMessages();
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchUsers(), fetchPosts(), fetchReports(), fetchMessages()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminApi.updateUserRole(userId, { role: newRole });
      toast.success("User role updated");
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await adminApi.toggleUserStatus(userId);
      toast.info(res.message);
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleFeature = async (postId) => {
    try {
      const res = await adminApi.toggleFeaturedPost(postId);
      toast.success(res.message);
      fetchPosts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleResolveReport = async (reportId, action) => {
    try {
      await reportApi.resolveReport(reportId, { action });
      toast.success("Report processed successfully");
      fetchReports();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "2.5rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <LayoutDashboard className="gradient-text" size={28} /> Admin Control Panel
      </h1>

      {/* Stats Cards Row */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Total Users</span>
            <h2 style={{ fontSize: "1.8rem", marginTop: "0.25rem" }}>{stats.totalUsers}</h2>
          </div>
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Published Articles</span>
            <h2 style={{ fontSize: "1.8rem", marginTop: "0.25rem", color: "#10b981" }}>{stats.publishedPosts}</h2>
          </div>
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Total Page Views</span>
            <h2 style={{ fontSize: "1.8rem", marginTop: "0.25rem", color: "#6366f1" }}>{stats.totalViews}</h2>
          </div>
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Pending Moderation</span>
            <h2 style={{ fontSize: "1.8rem", marginTop: "0.25rem", color: "#f87171" }}>{stats.pendingReports}</h2>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.75rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem", marginBottom: "2rem" }}>
        {["overview", "users", "posts", "reports", "messages"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "btn-primary" : "btn-secondary"}
            style={{ padding: "0.45rem 1rem", fontSize: "0.88rem", textTransform: "capitalize" }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Users Management */}
      {activeTab === "users" && (
        <div className="glass-card" style={{ padding: "1.5rem", overflowX: "auto" }}>
          <h3 style={{ marginBottom: "1.25rem", fontSize: "1.2rem" }}>User Account Management</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                <th style={{ padding: "0.75rem" }}>User</th>
                <th style={{ padding: "0.75rem" }}>Email</th>
                <th style={{ padding: "0.75rem" }}>Role</th>
                <th style={{ padding: "0.75rem" }}>Status</th>
                <th style={{ padding: "0.75rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "0.75rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <img src={u.avatar} alt={u.name} style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
                    <span>{u.name}</span>
                  </td>
                  <td style={{ padding: "0.75rem", color: "var(--text-secondary)" }}>{u.email}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      style={{ background: "#1e293b", color: "#fff", border: "1px solid var(--border-color)", padding: "0.3rem", borderRadius: "4px" }}
                    >
                      <option value="user">User</option>
                      <option value="author">Author</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">SuperAdmin</option>
                    </select>
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <span style={{ color: u.status === "suspended" ? "#f87171" : "#10b981", fontWeight: 600 }}>{u.status}</span>
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <button
                      onClick={() => handleToggleStatus(u._id)}
                      className="btn-secondary"
                      style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem" }}
                    >
                      {u.status === "suspended" ? "Activate" : "Suspend"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Posts Management */}
      {activeTab === "posts" && (
        <div className="glass-card" style={{ padding: "1.5rem", overflowX: "auto" }}>
          <h3 style={{ marginBottom: "1.25rem", fontSize: "1.2rem" }}>Post Content Moderation</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                <th style={{ padding: "0.75rem" }}>Article Title</th>
                <th style={{ padding: "0.75rem" }}>Author</th>
                <th style={{ padding: "0.75rem" }}>Status</th>
                <th style={{ padding: "0.75rem" }}>Views</th>
                <th style={{ padding: "0.75rem" }}>Featured</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 500 }}>{p.title}</td>
                  <td style={{ padding: "0.75rem", color: "var(--text-secondary)" }}>{p.author?.name}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <span className="badge-category">{p.status}</span>
                  </td>
                  <td style={{ padding: "0.75rem" }}>{p.views}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <button
                      onClick={() => handleToggleFeature(p._id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: p.isFeatured ? "#f59e0b" : "#6b7280" }}
                    >
                      <Star size={18} fill={p.isFeatured ? "#f59e0b" : "none"} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Moderation Reports */}
      {activeTab === "reports" && (
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.25rem", fontSize: "1.2rem" }}>Report Moderation Queue</h3>
          {reports.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>No pending reports.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {reports.map((r) => (
                <div key={r._id} style={{ padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <p><strong>Reason:</strong> {r.reason} | <strong>Target:</strong> {r.targetType}</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Reported by: {r.reporter?.name}</p>
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                    <button onClick={() => handleResolveReport(r._id, "remove_content")} className="btn-danger" style={{ padding: "0.3rem 0.65rem", fontSize: "0.78rem" }}>
                      Remove Content
                    </button>
                    <button onClick={() => handleResolveReport(r._id, "dismiss")} className="btn-secondary" style={{ padding: "0.3rem 0.65rem", fontSize: "0.78rem" }}>
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Inbox */}
      {activeTab === "messages" && (
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.25rem", fontSize: "1.2rem" }}>Contact Form Inbox</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {messages.map((m) => (
              <div key={m._id} style={{ padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <h4>{m.subject}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>From: {m.name} ({m.email})</p>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
