import React, { useState } from "react";
import { Mail, Send } from "lucide-react";
import { newsletterApi } from "../api/commentInteractionApi";
import { toast } from "../context/ToastContext";

const NewsletterCTA = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await newsletterApi.subscribe({ email });
      toast.success(res.message || "Subscribed successfully!");
      setEmail("");
    } catch (err) {
      toast.error(err.message || "Failed to subscribe to newsletter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        padding: "2.25rem 2rem",
        margin: "3rem 0",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent-warm)",
              marginBottom: "0.35rem",
            }}
          >
            <Mail size={14} /> EDITORIAL NEWSLETTER
          </div>
          <h3
            style={{
              fontSize: "1.35rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              lineHeight: 1.25,
              marginBottom: "0.4rem",
            }}
          >
            Get the best stories delivered weekly
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Technology, web architecture, design, and software engineering insights straight to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              flexGrow: 1,
              padding: "0.65rem 1rem",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontSize: "0.88rem",
              outline: "none",
            }}
          />
          <button type="submit" className="btn-primary" disabled={loading} style={{ whiteSpace: "nowrap" }}>
            <span>Subscribe</span>
            <Send size={14} />
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterCTA;
