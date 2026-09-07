import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

import GoogleSignInButton from "../components/GoogleSignInButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password });
      toast.success(res.message || "Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "2rem" }}>
      <div className="glass-card" style={{ width: "100%", maxWidth: "420px", padding: "2.5rem", background: "var(--bg-card)" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto" }}>
            <Sparkles size={24} color="var(--text-inverse)" />
          </div>
          <h2 style={{ fontSize: "1.75rem", color: "var(--text-primary)" }}>Welcome Back</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "0.25rem" }}>Log in to manage your posts and settings</p>
        </div>

        {/* Continue with Google Button */}
        <div style={{ marginBottom: "1.25rem" }}>
          <GoogleSignInButton text="Continue with Google" />
        </div>

        <div style={{ display: "flex", alignItems: "center", margin: "1.25rem 0", gap: "0.75rem" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color, #334155)" }}></div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted, #94a3b8)", textTransform: "uppercase" }}>OR</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color, #334155)" }}></div>
        </div>

        <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.4rem", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", outline: "none" }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: "0.78rem", color: "var(--accent-secondary)" }}>Forgot?</Link>
            </div>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.4rem", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", outline: "none" }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}>
            <LogIn size={18} /> {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          Don't have an account? <Link to="/register" style={{ color: "var(--accent-secondary)", fontWeight: 600 }}>Sign up</Link>
        </p>

        {/* Demo Credentials Hint */}
        <div style={{ marginTop: "1.5rem", padding: "0.85rem", borderRadius: "var(--radius-sm)", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          <p style={{ fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Demo Accounts:</p>
          <p>• SuperAdmin: <code>superadmin@blog.com</code> / <code>Password123!</code></p>
          <p>• Author: <code>author@blog.com</code> / <code>Password123!</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;