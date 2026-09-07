import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, PenTool, User, ShieldCheck } from "lucide-react";

const DashboardHeader = ({ user }) => {
  if (!user) return null;

  const firstName = user.name ? user.name.split(" ")[0] : "Creator";
  const isAuthor = !!user;

  return (
    <header
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        padding: "1.75rem 2rem",
        marginBottom: "1.75rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.25rem",
      }}
    >
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#FF497C",
            marginBottom: "0.35rem",
          }}
        >
          <Sparkles size={13} /> USER DASHBOARD
        </div>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 900,
            color: "var(--text-primary)",
            lineHeight: 1.2,
            fontFamily: "var(--font-heading)",
          }}
        >
          Welcome back, {firstName}
        </h1>
        <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          Here's an overview of your publication activity, saved stories, and account status.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {isAuthor && (
          <Link to="/create-post" className="btn-primary" style={{ padding: "0.55rem 1.1rem", fontSize: "0.82rem" }}>
            <PenTool size={15} /> Write New Article
          </Link>
        )}
        <Link to="/profile" className="btn-secondary" style={{ padding: "0.55rem 1.1rem", fontSize: "0.82rem" }}>
          <User size={14} /> Profile Settings
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;
