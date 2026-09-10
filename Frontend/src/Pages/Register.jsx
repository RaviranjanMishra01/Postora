import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, AtSign, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "../context/ToastContext";
import AuthSplitLayout from "../components/auth/AuthSplitLayout";
import GoogleSignInButton from "../components/GoogleSignInButton";

import SEO from "../components/SEO";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username.trim())) {
      toast.error("Username must be 3-30 characters long and contain only letters, numbers, and underscores");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      });
      toast.success(res.message || "Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Create Account" description="Join Postora to publish tech articles, read stories, and connect with authors." url="/register" noindex={true} />
      <AuthSplitLayout
      title="Create your account"
      subtitle="Join Postora and start sharing your ideas with the community."
    >
      <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        {/* Full Name Field */}
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
            Full Name
          </label>
          <div className="auth-input-focus" style={{ position: "relative", borderRadius: "10px", border: "1px solid var(--border-color)", transition: "all 0.2s" }}>
            <User size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Ravi Mishra"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.8rem 1rem 0.8rem 2.6rem",
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

        {/* Username Field */}
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
            Username
          </label>
          <div className="auth-input-focus" style={{ position: "relative", borderRadius: "10px", border: "1px solid var(--border-color)", transition: "all 0.2s" }}>
            <AtSign size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="ravimishra"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.8rem 1rem 0.8rem 2.6rem",
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

        {/* Email Address Field */}
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
            Email Address
          </label>
          <div className="auth-input-focus" style={{ position: "relative", borderRadius: "10px", border: "1px solid var(--border-color)", transition: "all 0.2s" }}>
            <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="email"
              placeholder="ravi@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.8rem 1rem 0.8rem 2.6rem",
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
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
            Password
          </label>
          <div className="auth-input-focus" style={{ position: "relative", borderRadius: "10px", border: "1px solid var(--border-color)", transition: "all 0.2s" }}>
            <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.8rem 2.6rem 0.8rem 2.6rem",
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

        {/* Confirm Password Field */}
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
            Confirm Password
          </label>
          <div className="auth-input-focus" style={{ position: "relative", borderRadius: "10px", border: "1px solid var(--border-color)", transition: "all 0.2s" }}>
            <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.8rem 2.6rem 0.8rem 2.6rem",
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
          <UserPlus size={18} /> {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", margin: "1.25rem 0", gap: "0.75rem" }}>
        <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color)" }} />
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.5px" }}>
          OR CONTINUE WITH
        </span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color)" }} />
      </div>

      {/* Google SSO Button */}
      <GoogleSignInButton text="Continue with Google" />

      {/* Terms & Privacy Disclaimer */}
      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center", marginTop: "1.25rem", lineHeight: 1.4 }}>
        By creating an account, you agree to our{" "}
        <Link to="/terms" style={{ color: "var(--text-secondary)", textDecoration: "underline" }}>
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" style={{ color: "var(--text-secondary)", textDecoration: "underline" }}>
          Privacy Policy
        </Link>
        .
      </p>
    </AuthSplitLayout>
    </>
  );
};

export default Register;
