import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, Mail, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "../context/ToastContext";

const SuperAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-primary)", padding: "1.5rem" }}>
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "960px",
          minHeight: "560px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          borderRadius: "var(--radius-xl, 20px)",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-card)",
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        {/* Left Panel: Form */}
        <div style={{ padding: "3rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0.75rem", borderRadius: "20px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", marginBottom: "1rem" }}>
              <ShieldAlert size={16} color="var(--carrino-pink, #547792)" />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1.5px", color: "var(--text-primary)", textTransform: "uppercase" }}>SUPER ADMIN PORTAL</span>
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Login</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.4rem" }}>Enter your secure platform administrator credentials</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Email / Username</label>
              <div style={{ position: "relative" }}>
                <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="superadmin@carrino.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem 0.85rem 2.6rem",
                    borderRadius: "var(--radius-md, 10px)",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    fontSize: "0.92rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-secondary)" }}>Password</label>
                <Link to="/super-admin/forgot-password" style={{ fontSize: "0.8rem", color: "var(--carrino-pink, #547792)", textDecoration: "none", fontWeight: 600 }}>Forgot Password?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.85rem 2.6rem 0.85rem 2.6rem",
                    borderRadius: "var(--radius-md, 10px)",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    fontSize: "0.92rem",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.9rem",
                justifyContent: "center",
                fontSize: "0.95rem",
                marginTop: "0.5rem",
              }}
            >
              <KeyRound size={18} /> {loading ? "Verifying Credentials..." : "Secure Login"}
            </button>
          </form>

          <div style={{ marginTop: "2.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-color)", textAlign: "center" }}>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0 }}>Highest Privilege Operating Level • All Attempts Audit Logged</p>
          </div>
        </div>

        {/* Right Panel: Branded Visual Area */}
        <div
          style={{
            background: "var(--bg-secondary)",
            borderLeft: "1px solid var(--border-color)",
            padding: "3rem 2.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Graphic Artwork */}
          <div style={{ width: "180px", height: "180px", marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="160" height="160" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="80" stroke="var(--border-color)" strokeWidth="3" fill="var(--bg-card)" />
              <circle cx="100" cy="100" r="55" stroke="var(--carrino-pink)" strokeWidth="2" strokeDasharray="6 6" />
              <path d="M100 60V140M60 100H140" stroke="var(--border-color)" strokeWidth="2" />
              <rect x="82" y="82" width="36" height="36" rx="8" fill="var(--carrino-pink)" opacity="0.3" stroke="var(--carrino-pink)" strokeWidth="2" />
              <circle cx="100" cy="100" r="6" fill="var(--text-primary)" />
            </svg>
          </div>

          <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            Welcome to <br />
            <span style={{ color: "var(--carrino-pink, #547792)" }}>Super Admin Portal</span>
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "300px", lineHeight: 1.5 }}>
            Secure access to the Carrino platform control center for governance, infrastructure matrix, and audit oversight.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
