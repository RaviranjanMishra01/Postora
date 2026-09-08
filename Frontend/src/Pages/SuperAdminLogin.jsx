import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, Mail, Lock, KeyRound, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "../context/ToastContext";

const SuperAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { superAdminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter Super Admin credentials");
      return;
    }

    setLoading(true);
    try {
      const res = await superAdminLogin({ email: email.trim(), password });
      toast.success(res.message || "Super Admin authentication verified!");
      navigate("/super-admin/dashboard");
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#060A12", padding: "1.5rem", position: "relative", overflow: "hidden" }}>
      {/* Ambient background glow for high-level governance entry point */}
      <div style={{ position: "absolute", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(0,0,0,0) 70%)", top: "15%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }}></div>

      <div className="glass-card" style={{ width: "100%", maxWidth: "440px", padding: "2.5rem", background: "#0F172A", border: "1px solid #1E293B", borderRadius: "20px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7)", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "16px", background: "linear-gradient(135deg, #ec4899, #be185d)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem auto", boxShadow: "0 8px 20px rgba(236,72,153,0.35)" }}>
            <ShieldAlert size={30} color="#ffffff" />
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "2px", color: "#f472b6", textTransform: "uppercase" }}>CARRINO</span>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f8fafc", marginTop: "0.25rem", letterSpacing: "-0.5px" }}>SUPER ADMIN</h2>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.25rem 0.75rem", borderRadius: "20px", background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)", marginTop: "0.6rem" }}>
            <Sparkles size={13} color="#f472b6" />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#f472b6" }}>Protected Administrative Area</span>
          </div>
        </div>

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

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#cbd5e1" }}>Secret Password</label>
              <Link to="/super-admin/forgot-password" style={{ fontSize: "0.78rem", color: "#f472b6", textDecoration: "none" }}>Recovery Access</Link>
            </div>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "0.85rem 1rem 0.85rem 2.6rem", borderRadius: "10px", background: "#090D16", border: "1px solid #1E293B", color: "#f8fafc", fontSize: "0.9rem", outline: "none" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "0.9rem", borderRadius: "10px", background: "linear-gradient(135deg, #ec4899, #be185d)", color: "#ffffff", fontWeight: 700, fontSize: "0.95rem", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginTop: "0.5rem", boxShadow: "0 4px 14px rgba(236,72,153,0.35)" }}
          >
            <KeyRound size={18} /> {loading ? "Verifying Credentials..." : "Secure Platform Login"}
          </button>
        </form>

        <div style={{ marginTop: "2.25rem", paddingTop: "1.25rem", borderTop: "1px solid #1E293B", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", color: "#64748b" }}>Highest Privilege Operating Level — All Attempts Audit Logged</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
