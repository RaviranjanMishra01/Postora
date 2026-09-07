import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SectionHeader = ({ title, viewAllLink, subtitle }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingBottom: "0.65rem",
        marginBottom: "1.5rem",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "1.1rem",
            fontWeight: 800,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--text-primary)",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px", display: "block" }}>
            {subtitle}
          </span>
        )}
      </div>

      {viewAllLink && (
        <Link
          to={viewAllLink}
          style={{
            fontSize: "0.82rem",
            fontWeight: 600,
            color: "var(--text-secondary)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            transition: "color 150ms ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "var(--accent-warm)")}
          onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          View all <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
