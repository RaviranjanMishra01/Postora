import React from "react";
import { Link } from "react-router-dom";
import { PenTool } from "lucide-react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const DashboardHeader = ({ user }) => {
  const firstName = user?.name ? user.name.split(" ")[0] : "Creator";
  const greeting = getGreeting();

  return (
    <header
      style={{
        padding: "1.75rem 0",
        marginBottom: "2rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.25rem",
        borderBottom: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)",
            fontWeight: 900,
            color: "var(--text-primary, #f8fafc)",
            lineHeight: 1.2,
            fontFamily: "var(--font-heading, sans-serif)",
            letterSpacing: "-0.02em",
            marginBottom: "0.4rem",
          }}
        >
          {greeting}, {firstName} 👋
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary, #94a3b8)",
            fontWeight: 400,
            margin: 0,
          }}
        >
          Ready to share something interesting today?
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Link
          to="/create-post"
          className="btn-primary"
          style={{
            padding: "0.7rem 1.4rem",
            fontSize: "0.92rem",
            fontWeight: 700,
            borderRadius: "var(--radius-md, 10px)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 4px 14px rgba(236, 72, 153, 0.35)",
            textDecoration: "none",
          }}
        >
          <PenTool size={16} /> Write a Story
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;
