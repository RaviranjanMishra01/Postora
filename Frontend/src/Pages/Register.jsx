import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, AtSign, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "../context/ToastContext";
import AuthSplitLayout from "../components/auth/AuthSplitLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
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
        <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Full Name Field */}
          <AuthInput
            id="register-name"
            label="Full Name"
            type="text"
            placeholder="e.g. Alex Morgan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            icon={User}
            autoComplete="name"
          />

          {/* Username Field */}
          <AuthInput
            id="register-username"
            label="Username"
            type="text"
            placeholder="e.g. alexmorgan"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            icon={AtSign}
            autoComplete="username"
          />

          {/* Email Address Field */}
          <AuthInput
            id="register-email"
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={Mail}
            autoComplete="email"
          />

          {/* Password Field */}
          <AuthInput
            id="register-password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={Lock}
            autoComplete="new-password"
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

          {/* Confirm Password Field */}
          <AuthInput
            id="register-confirm-password"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            icon={Lock}
            autoComplete="new-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {/* Primary CTA Submit Button */}
          <div style={{ marginTop: "6px" }}>
            <AuthButton
              type="submit"
              loading={loading}
              icon={UserPlus}
            >
              Create Account
            </AuthButton>
          </div>
        </form>

        {/* Account-Switch Link */}
        <div
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "var(--text-secondary, #64748B)",
            marginTop: "16px",
            marginBottom: "24px",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--Postora-pink, #FF3F7F)",
              fontWeight: 600,
              textDecoration: "none",
              marginLeft: "4px",
            }}
          >
            Log in
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

        {/* Terms & Privacy Disclaimer */}
        <p style={{ fontSize: "13px", color: "var(--text-muted, #94A3B8)", textAlign: "center", marginTop: "18px", lineHeight: 1.5 }}>
          By creating an account, you agree to our{" "}
          <Link to="/terms" style={{ color: "var(--text-secondary, #475569)", textDecoration: "underline", fontWeight: 500 }}>
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" style={{ color: "var(--text-secondary, #475569)", textDecoration: "underline", fontWeight: 500 }}>
            Privacy Policy
          </Link>
          .
        </p>
      </AuthSplitLayout>
    </>
  );
};

export default Register;
