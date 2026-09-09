import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  FileText,
  Eye,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  Activity,
  CheckCircle,
  Award,
  Heart,
  MessageSquare,
  KeyRound,
  FileSearch,
  Settings,
  UserCheck,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const AdminOverview = ({ stats, recentPosts = [], reports = [], users = [], onSelectTab }) => {
  const [growthTimeframe, setGrowthTimeframe] = useState("30D");
  const [performanceTab, setPerformanceTab] = useState("views");

  if (!stats) return null;

  const activeAdminsList = users.filter(
    (u) => (u.role === "admin" || u.role === "superadmin") && u.status !== "suspended"
  );
  const activeAdminsCount = activeAdminsList.length || 1;
  const pendingReportsCount = stats.pendingReports || 0;
  const pendingReportsList = reports.filter((r) => r.status === "pending");

  // KPI Cards Configuration
  const kpis = [
    {
      title: "Total Users",
      value: (stats.totalUsers || 0).toLocaleString(),
      trend: "+8.4%",
      period: "this month",
      icon: Users,
      color: "var(--accent-blue)",
      bgColor: "rgba(76, 141, 255, 0.12)",
    },
    {
      title: "Published Posts",
      value: (stats.publishedPosts || 0).toLocaleString(),
      trend: "+5.2%",
      period: "this month",
      icon: FileText,
      color: "var(--accent-purple)",
      bgColor: "rgba(139, 92, 246, 0.12)",
    },
    {
      title: "Total Views",
      value: (stats.totalViews || 0).toLocaleString(),
      trend: "+12.1%",
      period: "this month",
      icon: Eye,
      color: "var(--Postora-pink)",
      bgColor: "var(--brand-soft)",
    },
    {
      title: "Pending Reports",
      value: pendingReportsCount,
      trend: pendingReportsCount > 0 ? "Action required" : "All clear",
      period: pendingReportsCount > 0 ? "urgent" : "healthy",
      icon: AlertTriangle,
      color: pendingReportsCount > 0 ? "#EF4444" : "var(--accent-green)",
      bgColor: pendingReportsCount > 0 ? "rgba(239, 68, 68, 0.12)" : "rgba(25, 184, 138, 0.12)",
    },
    {
      title: "Active Admins",
      value: activeAdminsCount,
      trend: "Protected",
      period: "system roster",
      icon: ShieldCheck,
      color: "var(--accent-green)",
      bgColor: "rgba(34, 197, 94, 0.12)",
    },
  ];

  // Content Performance Sorting
  const sortedPosts = [...recentPosts];
  if (performanceTab === "views") {
    sortedPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else if (performanceTab === "likes") {
    sortedPosts.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* 1. DASHBOARD OVERVIEW HEADER */}
      <div
        className="glass-card-admin"
        style={{
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "1.35rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              margin: 0,
              fontFamily: "var(--font-heading)",
              lineHeight: 1.2,
            }}
          >
            Dashboard Overview
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: "0.25rem 0 0 0" }}>
            Platform health, content performance and administration overview.
          </p>
        </div>

        <Link
          to="/"
          className="btn-secondary"
          style={{
            padding: "0.5rem 0.95rem",
            fontSize: "0.82rem",
            fontWeight: 700,
            borderRadius: "8px",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            textDecoration: "none",
          }}
        >
          <span>View Public Website</span>
          <ExternalLink size={14} />
        </Link>
      </div>

      {/* 2. COMPACT KPI CARDS ROW */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="glass-card-admin"
              style={{
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {kpi.title}
                </span>
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    background: kpi.bgColor,
                    color: kpi.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={17} />
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 900,
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-heading)",
                    lineHeight: 1.1,
                    marginBottom: "0.4rem",
                  }}
                >
                  {kpi.value}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.74rem" }}>
                  <span style={{ fontWeight: 800, color: kpi.color, display: "inline-flex", alignItems: "center" }}>
                    <TrendingUp size={12} style={{ marginRight: "2px" }} /> {kpi.trend}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>{kpi.period}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. PLATFORM GROWTH CHART & SYSTEM STATUS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        {/* PLATFORM GROWTH WIDGET */}
        <div className="glass-card-admin" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-heading)" }}>
                Platform Growth
              </h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "0.15rem 0 0 0" }}>
                Users, posts and readership growth.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.3rem" }}>
              {["7D", "30D", "90D", "1Y"].map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setGrowthTimeframe(tf)}
                  style={{
                    padding: "0.25rem 0.55rem",
                    borderRadius: "6px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    background: growthTimeframe === tf ? "var(--Postora-pink)" : "var(--bg-secondary)",
                    color: growthTimeframe === tf ? "#FFFFFF" : "var(--text-secondary)",
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Area Chart */}
          <div style={{ width: "100%", height: "160px", marginTop: "0.5rem" }}>
            <svg width="100%" height="100%" viewBox="0 0 400 140" preserveAspectRatio="none">
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M0,110 Q80,20 160,70 T320,30 L400,10 L400,140 L0,140 Z" fill="url(#growthGrad)" />
              <path d="M0,110 Q80,20 160,70 T320,30 L400,10" fill="none" stroke="var(--accent-blue)" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>

        {/* SYSTEM STATUS WIDGET */}
        <div className="glass-card-admin" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Activity size={18} color="var(--accent-green)" /> System Status
              </h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "0.15rem 0 0 0" }}>
                Operational state across core services
              </p>
            </div>
            <button onClick={() => onSelectTab("system-health")} className="btn-secondary" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", borderRadius: "6px" }}>
              Full Matrix →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flexGrow: 1, justifyContent: "center" }}>
            {[
              { name: "API Gateway", status: "Operational" },
              { name: "Database Cluster (MongoDB)", status: "Operational" },
              { name: "Authentication Engine", status: "Operational" },
              { name: "File & Asset Storage", status: "Operational" },
              { name: "Email Transporter Service", status: "Operational" },
            ].map((s, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 0.85rem", borderRadius: "8px", background: "var(--bg-secondary)" }}>
                <span style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--text-primary)" }}>{s.name}</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--accent-green)", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                  <CheckCircle size={12} /> {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. CONTENT PERFORMANCE & NEEDS ATTENTION ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        {/* CONTENT PERFORMANCE CARD */}
        <div className="glass-card-admin" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-heading)" }}>
                Content Performance
              </h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "0.15rem 0 0 0" }}>
                Ranked articles by readership engagement
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button
                type="button"
                onClick={() => setPerformanceTab("views")}
                style={{
                  padding: "0.25rem 0.55rem",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  background: performanceTab === "views" ? "var(--Postora-pink)" : "var(--bg-secondary)",
                  color: performanceTab === "views" ? "#FFFFFF" : "var(--text-secondary)",
                }}
              >
                Views
              </button>
              <button
                type="button"
                onClick={() => setPerformanceTab("likes")}
                style={{
                  padding: "0.25rem 0.55rem",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  background: performanceTab === "likes" ? "var(--Postora-pink)" : "var(--bg-secondary)",
                  color: performanceTab === "likes" ? "#FFFFFF" : "var(--text-secondary)",
                }}
              >
                Likes
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {sortedPosts.slice(0, 5).map((post, idx) => (
              <div
                key={post._id || idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  background: "var(--bg-secondary)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 900, color: "var(--Postora-pink)", width: "20px" }}>
                    0{idx + 1}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {post.title}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      by {post.author?.name || "Author"}
                    </div>
                  </div>
                </div>

                <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--accent-blue)", flexShrink: 0 }}>
                  {performanceTab === "views" ? `${(post.views || 0).toLocaleString()} views` : `${(post.likesCount || 0).toLocaleString()} likes`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* NEEDS ATTENTION / MODERATION WIDGET */}
        <div className="glass-card-admin" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <ShieldAlert size={18} color="var(--Postora-pink)" /> Needs Attention
              </h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "0.15rem 0 0 0" }}>
                Actionable moderation items requiring review
              </p>
            </div>

            <button onClick={() => onSelectTab("reports")} className="btn-secondary" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", borderRadius: "6px" }}>
              Review All →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", flexGrow: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", borderRadius: "8px", background: "var(--bg-secondary)" }}>
              <div>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", display: "block" }}>
                  {pendingReportsCount} Pending User Reports
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Flagged articles & comments</span>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab("reports")}
                className="btn-primary"
                style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem", borderRadius: "6px" }}
              >
                Review
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", borderRadius: "8px", background: "var(--bg-secondary)" }}>
              <div>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", display: "block" }}>
                  Support Inbox Messages
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Unresolved contact form submissions</span>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab("support")}
                className="btn-secondary"
                style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem", borderRadius: "6px" }}
              >
                Inspect
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", borderRadius: "8px", background: "var(--bg-secondary)" }}>
              <div>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", display: "block" }}>
                  Comment Discussion Queue
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Community conversation oversight</span>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab("comments")}
                className="btn-secondary"
                style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem", borderRadius: "6px" }}
              >
                Moderate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. QUICK GOVERNANCE ACTIONS & USER ACTIVITY ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {/* QUICK GOVERNANCE ACTIONS */}
        <div className="glass-card-admin" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 1.25rem 0", fontFamily: "var(--font-heading)" }}>
            Quick Governance Actions
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem" }}>
            {[
              { label: "Manage Admins", tab: "admins", icon: ShieldCheck, color: "var(--Postora-pink)" },
              { label: "Manage Permissions", tab: "roles", icon: KeyRound, color: "var(--accent-purple)" },
              { label: "Review Reports", tab: "reports", icon: AlertTriangle, color: "#EF4444" },
              { label: "View Audit Logs", tab: "audit-logs", icon: FileSearch, color: "var(--accent-blue)" },
              { label: "System Settings", tab: "system-settings", icon: Settings, color: "var(--accent-green)" },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectTab(action.tab)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "1rem 0.75rem",
                    borderRadius: "10px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  <Icon size={20} color={action.color} />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* USER ACTIVITY BREAKDOWN */}
        <div className="glass-card-admin" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 1.25rem 0", fontFamily: "var(--font-heading)" }}>
            User Activity & Account Roster
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ padding: "0.85rem", borderRadius: "8px", background: "var(--bg-secondary)" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800 }}>Total Accounts</span>
              <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--text-primary)" }}>{stats.totalUsers || 0}</div>
            </div>

            <div style={{ padding: "0.85rem", borderRadius: "8px", background: "var(--bg-secondary)" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800 }}>Active Members</span>
              <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--accent-green)" }}>{users.filter(u => u.status !== "suspended").length || 0}</div>
            </div>

            <div style={{ padding: "0.85rem", borderRadius: "8px", background: "var(--bg-secondary)" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800 }}>Suspended Users</span>
              <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#EF4444" }}>{users.filter(u => u.status === "suspended").length || 0}</div>
            </div>

            <div style={{ padding: "0.85rem", borderRadius: "8px", background: "var(--bg-secondary)" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800 }}>System Admins</span>
              <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--Postora-pink)" }}>{activeAdminsCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
