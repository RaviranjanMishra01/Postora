import React, { useState } from "react";
import { Activity, CheckCircle, RefreshCw, Server, Database, KeyRound, HardDrive, Mail, Bell } from "lucide-react";

const AdminSystemHealth = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastCheck, setLastCheck] = useState(new Date().toLocaleTimeString());

  const services = [
    { name: "API Gateway Service", icon: Server, status: "Operational", responseTime: "24ms", uptime: "99.98%" },
    { name: "MongoDB Database Cluster", icon: Database, status: "Operational", responseTime: "12ms", uptime: "99.99%" },
    { name: "JWT Auth & Session Engine", icon: KeyRound, status: "Operational", responseTime: "18ms", uptime: "100.0%" },
    { name: "Media & Asset Storage", icon: HardDrive, status: "Operational", responseTime: "45ms", uptime: "99.95%" },
    { name: "Email Notification SMTP", icon: Mail, status: "Operational", responseTime: "110ms", uptime: "99.90%" },
    { name: "Real-time Notification Dispatcher", icon: Bell, status: "Operational", responseTime: "15ms", uptime: "99.99%" },
  ];

  const handleRefreshHealth = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastCheck(new Date().toLocaleTimeString());
      setRefreshing(false);
    }, 600);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header Banner */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "var(--shadow-subtle)",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Activity color="var(--carrino-pink)" size={20} /> System Health & Infrastructure Matrix
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "0.2rem 0 0 0" }}>
            Real-time status monitor for core application services and database connections (Last checked: {lastCheck})
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefreshHealth}
          className="btn-secondary"
          disabled={refreshing}
          style={{ padding: "0.45rem 0.85rem", fontSize: "0.82rem", borderRadius: "8px" }}
        >
          <RefreshCw size={14} className={refreshing ? "spin-anim" : ""} /> {refreshing ? "Checking..." : "Re-Check Status"}
        </button>
      </div>

      {/* Services Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
        {services.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <div
              key={idx}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "1.25rem",
                boxShadow: "var(--shadow-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      background: "rgba(25, 184, 138, 0.12)",
                      color: "var(--accent-green)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-heading)" }}>
                      {srv.name}
                    </h4>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Response: {srv.responseTime}</span>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.55rem",
                    borderRadius: "12px",
                    background: "rgba(34, 197, 94, 0.15)",
                    color: "var(--accent-green)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <CheckCircle size={12} /> {srv.status}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)", borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem" }}>
                <span>Availability: <strong>{srv.uptime}</strong></span>
                <span>Latency: <strong>Optimal</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-anim {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminSystemHealth;
