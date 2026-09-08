import React from "react";
import { Link } from "react-router-dom";
import { FileEdit, ArrowRight, CheckCircle2 } from "lucide-react";

const ContinueWritingDraft = ({ drafts = [] }) => {
  const latestDraft = drafts.length > 0 ? drafts[0] : null;

  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FileEdit size={18} color="var(--accent-primary, #ec4899)" />
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "var(--text-primary, #f8fafc)",
              margin: 0,
            }}
          >
            Continue Writing
          </h2>
        </div>
      </div>

      {latestDraft ? (
        <div
          className="glass-card"
          style={{
            padding: "1.5rem 1.75rem",
            borderRadius: "var(--radius-lg, 16px)",
            background: "var(--bg-card, #1e293b)",
            border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.25rem",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#eab308",
                display: "block",
                marginBottom: "0.35rem",
              }}
            >
              Continue Your Draft
            </span>

            <h3
              style={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "var(--text-primary, #f8fafc)",
                margin: "0 0 0.25rem 0",
              }}
            >
              {latestDraft.title || "Untitled Draft"}
            </h3>

            <p style={{ fontSize: "0.85rem", color: "var(--text-muted, #94a3b8)", margin: 0 }}>
              Last edited {new Date(latestDraft.updatedAt || latestDraft.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>

          <Link
            to={`/edit-post/${latestDraft._id}`}
            className="btn-primary"
            style={{
              padding: "0.6rem 1.25rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              borderRadius: "var(--radius-md, 10px)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              textDecoration: "none",
            }}
          >
            <span>Continue Writing</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div
          style={{
            padding: "2rem",
            borderRadius: "var(--radius-lg, 16px)",
            background: "rgba(30, 41, 59, 0.3)",
            border: "1px dashed var(--border-color, rgba(255, 255, 255, 0.1))",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.12)",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={22} />
          </div>

          <div>
            <h4
              style={{
                fontSize: "0.98rem",
                fontWeight: 700,
                color: "var(--text-primary, #f8fafc)",
                margin: "0 0 0.2rem 0",
              }}
            >
              Nothing unfinished
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary, #94a3b8)", margin: 0 }}>
              Your unfinished stories will appear here when you save a draft.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContinueWritingDraft;
