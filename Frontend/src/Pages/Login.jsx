import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "../context/ToastContext";
import AuthSplitLayout from "../components/auth/AuthSplitLayout";
import GoogleSignInButton from "../components/GoogleSignInButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email: email.trim(), password });
      toast.success(res.message || "Welcome back!");
      const loggedUser = res.user || res.data?.user;
      const role = loggedUser?.role?.toLowerCase();
      if (loggedUser && (role === "admin" || role === "superadmin")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Welcome back"
      subtitle="Sign in to continue to your Carrino account."
    >
      <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Email Field */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "0.4rem",
            }}
          >
            Email Address
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

        {/* Password Field */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              style={{
                fontSize: "0.82rem",
                color: "var(--carrino-pink, #FF3F7F)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Forgot Password?
            </Link>
          </div>
          <div className="auth-input-focus" style={{ position: "relative", borderRadius: "10px", border: "1px solid var(--border-color)", transition: "all 0.2s" }}>
            <Lock
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
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.85rem 2.6rem 0.85rem 2.6rem",
                borderRadius: "10px",
                background: "var(--bg-secondary)",
                border: "none",
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
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Primary CTA Submit Button */}
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
          <LogIn size={18} /> {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0", gap: "0.75rem" }}>
        <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color)" }} />
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.5px" }}>
          OR CONTINUE WITH
        </span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color)" }} />
      </div>

      {/* Google SSO Button */}
      <GoogleSignInButton text="Continue with Google" />
    </AuthSplitLayout>
  );
};

export default Login;