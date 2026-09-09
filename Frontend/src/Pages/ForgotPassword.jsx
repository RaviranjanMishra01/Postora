import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Send, ArrowLeft } from "lucide-react";
import { authApi } from "../api/authApi";
import { toast } from "../context/ToastContext";
import AuthSplitLayout from "../components/auth/AuthSplitLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.forgotPassword({ email: email.trim() });
      toast.success(res.data?.message || "Password reset instructions dispatched.");
      setSent(true);
    } catch (err) {
      toast.error(err.message || "Failed to process password recovery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Reset your password"
      subtitle="Enter your registered email address to receive reset instructions."
    >
      {sent ? (
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <p style={{ color: "var(--Postora-pink, #FF3F7F)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.5rem", fontWeight: 500 }}>
            If an account matches <strong>{email}</strong>, a password reset link has been dispatched to your inbox.
          </p>
          <Link
            to="/login"
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              padding: "0.8rem 1.5rem",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Return to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
              Registered Email Address
            </label>
            <div className="auth-input-focus" style={{ position: "relative", borderRadius: "10px", border: "1px solid var(--border-color)", transition: "all 0.2s" }}>
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem 0.85rem 2.6rem",
                  borderRadius: "10px",
                  background: "var(--bg-secondary)",
                  border: "none",
                  color: "var(--text-primary)",
                  fontSize: "0.92rem",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "0.85rem",
              fontSize: "0.95rem",
              fontWeight: 700,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginTop: "0.5rem",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            <Send size={18} /> {loading ? "Dispatching..." : "Send Reset Link"}
          </button>
        </form>
      )}
    </AuthSplitLayout>
  );
};

export default ForgotPassword;
