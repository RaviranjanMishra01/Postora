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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#060A12", padding: "1.5rem" }}>
      <div className="glass-card" style={{ width: "100%", maxWidth: "440px", padding: "2.5rem", background: "#0F172A", border: "1px solid #1E293B", borderRadius: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #ec4899, #be185d)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto" }}>
            <ShieldAlert size={28} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f8fafc" }}>Super Admin Recovery</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.4rem" }}>Dispatch a single-use access link to your Super Admin email</p>
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#f472b6", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              If a Super Admin account exists for <strong>{email}</strong>, recovery instructions have been dispatched securely.
            </p>
            <Link to="/super-admin/login" style={{ color: "#ffffff", padding: "0.75rem 1.25rem", borderRadius: "10px", background: "linear-gradient(135deg, #ec4899, #be185d)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
              <ArrowLeft size={16} /> Return to Super Admin Access
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Super Admin Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input
                  type="email"
                  placeholder="superadmin@carrino.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: "100%", padding: "0.85rem 1rem 0.85rem 2.6rem", borderRadius: "10px", background: "#090D16", border: "1px solid #1E293B", color: "#f8fafc", fontSize: "0.9rem", outline: "none" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", background: "linear-gradient(135deg, #ec4899, #be185d)", color: "#ffffff", fontWeight: 700, fontSize: "0.95rem", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <Send size={18} /> {loading ? "Dispatching..." : "Send Reset Link"}
            </button>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Link to="/super-admin/login" style={{ color: "#f472b6", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
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
