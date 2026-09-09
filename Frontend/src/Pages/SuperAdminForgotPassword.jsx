import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Mail, ArrowLeft, Send } from "lucide-react";
import { authApi } from "../api/authApi";
import { toast } from "../context/ToastContext";

const SuperAdminForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter Super Admin email");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.superAdminForgotPassword({ email: email.trim() });
      toast.success(res.data?.message || "Password recovery dispatched.");
      setSent(true);
    } catch (err) {
      toast.error(err.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-primary)", padding: "1.5rem" }}>
      <div className="glass-card" style={{ width: "100%", maxWidth: "440px", padding: "2.5rem", background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl, 16px)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto" }}>
            <ShieldAlert size={26} color="var(--Postora-pink, #547792)" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>Super Admin Recovery</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.4rem" }}>Dispatch a single-use access link to your Super Admin email</p>
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "var(--Postora-pink, #547792)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              If a Super Admin account exists for <strong>{email}</strong>, recovery instructions have been dispatched securely.
            </p>
            <Link to="/super-admin/login" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
              <ArrowLeft size={16} /> Return to Super Admin Access
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Super Admin Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="email"
                  placeholder="superadmin@Postora.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: "100%", padding: "0.8rem 1rem 0.8rem 2.6rem", borderRadius: "10px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontSize: "0.9rem", outline: "none" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", padding: "0.85rem", justifyContent: "center", fontSize: "0.95rem" }}
            >
              <Send size={18} /> {loading ? "Dispatching..." : "Send Reset Link"}
            </button>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Link to="/super-admin/login" style={{ color: "var(--Postora-pink, #547792)", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: 600 }}>
                <ArrowLeft size={16} /> Back to Super Admin Access
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SuperAdminForgotPassword;
