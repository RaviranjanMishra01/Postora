import React from "react";
import { Edit3, ShieldCheck, Send } from "lucide-react";

const FeatureHighlightsBar = () => {
  return (
    <section
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "1.75rem 2rem",
        margin: "3.5rem 0 2rem 0",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        {/* Highlight 1 */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.1rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--carrino-pink)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Edit3 size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.2rem" }}>
              Quality Content
            </h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
              Well researched and insightful articles
            </p>
          </div>
        </div>

        {/* Highlight 2 */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.1rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--accent-purple)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.2rem" }}>
              Trusted by Readers
            </h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
              Join thousands of readers who love our content
            </p>
          </div>
        </div>

        {/* Highlight 3 */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.1rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--accent-blue)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Send size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.2rem" }}>
              Join Our Community
            </h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
              Be part of the conversation and share your thoughts
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlightsBar;
