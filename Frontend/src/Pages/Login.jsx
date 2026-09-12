import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "../context/ToastContext";
import AuthSplitLayout from "../components/auth/AuthSplitLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
import GoogleSignInButton from "../components/GoogleSignInButton";
import SEO from "../components/SEO";

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
    <>
      <SEO title="Sign In" description="Sign in to your Postora account." url="/login" noindex={true} />
      <AuthSplitLayout
        title="Welcome back"
        subtitle="Sign in to continue to your Postora account."
      >
        <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Email Address Input */}
          <AuthInput
            id="login-email"
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={Mail}
            autoComplete="email"
          />

          {/* Password Input */}
          <AuthInput
            id="login-password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={Lock}
            autoComplete="current-password"
            labelRight={
              <Link
                to="/forgot-password"
                style={{
                  fontSize: "0.82rem",
                  color: "var(--Postora-pink, #FF3F7F)",
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "opacity 150ms ease",
                }}
              >
                Forgot Password?
              </Link>
            }
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted, #94A3B8)",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  transition: "color 150ms ease",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {/* Primary CTA Submit Button */}
          <div style={{ marginTop: "6px" }}>
            <AuthButton
              type="submit"
              loading={loading}
              icon={LogIn}
            >
              Sign In
            </AuthButton>
          </div>
        </form>

        {/* Account-Switch Link (Directly below Primary Button) */}
        <div
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "var(--text-secondary, #64748B)",
            marginTop: "16px",
            marginBottom: "24px",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "var(--Postora-pink, #FF3F7F)",
              fontWeight: 600,
              textDecoration: "none",
              marginLeft: "4px",
            }}
          >
            Sign up
          </Link>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "24px", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color, #E2E8F0)" }} />
          <span style={{ fontSize: "11px", color: "var(--text-muted, #94A3B8)", fontWeight: 700, letterSpacing: "0.08em" }}>
            OR CONTINUE WITH
          </span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color, #E2E8F0)" }} />
        </div>

        {/* Google SSO Button */}
        <GoogleSignInButton text="Continue with Google" />
      </AuthSplitLayout>
    </>
  );
};

export default Login;