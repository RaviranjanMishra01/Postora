import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Mail, ArrowLeft, Send } from "lucide-react";
import { authApi } from "../api/authApi";
import { toast } from "../context/ToastContext";

const AdminForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your admin email");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.adminForgotPassword({ email: email.trim() });
      toast.success(res.data?.message || "Password reset request dispatched.");
      setSent(true);
    } catch (err) {
      toast.error(err.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0A101D", padding: "1.5rem" }}>
      <div className="glass-card" style={{ width: "100%", maxWidth: "420px", padding: "2.5rem", background: "#121D2F", border: "1px solid #23344E", borderRadius: "16px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto" }}>
            <ShieldCheck size={26} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f8fafc" }}>Admin Password Reset</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.4rem" }}>Enter your registered administrator email address</p>
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#38bdf8", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              If an administrative account matches <strong>{email}</strong>, a single-use password recovery link has been dispatched to your inbox.
            </p>
            <Link to="/admin/login" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
              <ArrowLeft size={16} /> Return to Admin Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Admin Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input
                  type="email"
                  placeholder="admin@carrino.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: "100%", padding: "0.8rem 1rem 0.8rem 2.6rem", borderRadius: "10px", background: "#0B1321", border: "1px solid #1E2D45", color: "#f8fafc", fontSize: "0.9rem", outline: "none" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#ffffff", fontWeight: 600, fontSize: "0.95rem", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <Send size={18} /> {loading ? "Dispatching..." : "Send Reset Link"}
            </button>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Link to="/admin/login" style={{ color: "#60a5fa", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <ArrowLeft size={16} /> Back to Admin Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminForgotPassword;
