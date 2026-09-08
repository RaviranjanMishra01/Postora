import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "../context/ToastContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter admin email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await adminLogin({ email: email.trim(), password });
      toast.success(res.message || "Admin login successful!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0A101D", padding: "1.5rem" }}>
      <div className="glass-card" style={{ width: "100%", maxWidth: "420px", padding: "2.5rem", background: "#121D2F", border: "1px solid #23344E", borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem auto", boxShadow: "0 8px 16px rgba(37,99,235,0.3)" }}>
            <ShieldCheck size={28} color="#ffffff" />
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1.5px", color: "#60a5fa", textTransform: "uppercase" }}>CARRINO</span>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#f8fafc", marginTop: "0.25rem" }}>ADMIN CONSOLE</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.4rem" }}>Sign in with your administrator credentials</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>Administrator Email</label>
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

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#cbd5e1" }}>Password</label>
              <Link to="/admin/forgot-password" style={{ fontSize: "0.78rem", color: "#60a5fa", textDecoration: "none" }}>Forgot Password?</Link>
            </div>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "0.8rem 1rem 0.8rem 2.6rem", borderRadius: "10px", background: "#0B1321", border: "1px solid #1E2D45", color: "#f8fafc", fontSize: "0.9rem", outline: "none" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#ffffff", fontWeight: 600, fontSize: "0.95rem", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "0.5rem", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}
          >
            {loading ? "Authenticating..." : "Secure Login"} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: "2rem", paddingTop: "1.25rem", borderTop: "1px solid #1E2D45", textAlign: "center" }}>
          <p style={{ fontSize: "0.78rem", color: "#64748b" }}>Restricted Administrative Gateway</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
