import React, { useState } from "react";
import { Mail } from "lucide-react";
import { newsletterApi } from "../api/commentInteractionApi";
import { toast } from "../context/ToastContext";

const SidebarNewsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await newsletterApi.subscribe({ email });
      toast.success(res.message || "Thank you for subscribing!");
      setEmail("");
    } catch (err) {
      toast.error(err.message || "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "1.75rem 1.25rem",
        textAlign: "center",
      }}
    >
      <h3
        style={{
          fontSize: "1.15rem",
          fontWeight: 800,
          color: "var(--text-primary)",
          marginBottom: "0.5rem",
          fontFamily: "var(--font-heading)",
        }}
      >
        Stay in the loop
      </h3>
      <p
        style={{
          fontSize: "0.82rem",
          color: "var(--text-secondary)",
          lineHeight: 1.5,
          marginBottom: "1.25rem",
        }}
      >
        Subscribe to the weekly newsletter for all the latest updates
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.7rem 1rem",
            borderRadius: "var(--radius-sm)",
            background: "var(--bg-primary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
            fontSize: "0.85rem",
            outline: "none",
          }}
        />

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {loading ? "SUBSCRIBING..." : "SIGN UP"}
        </button>
      </form>
    </div>
  );
};

export default SidebarNewsletter;
