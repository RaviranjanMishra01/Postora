import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Send, ArrowLeft } from "lucide-react";
import { authApi } from "../api/authApi";
import { toast } from "../context/ToastContext";
import AuthSplitLayout from "../components/auth/AuthSplitLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.forgotPassword({ email: email.trim() });
      toast.success(res.data?.message || "Password reset instructions dispatched.");
      setSent(true);
    } catch (err) {
      toast.error(err.message || "Failed to process password recovery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Reset your password"
      subtitle="Enter your registered email address to receive reset instructions."
    >
      {sent ? (
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <p style={{ color: "var(--Postora-pink, #FF3F7F)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem", fontWeight: 500 }}>
            If an account matches <strong>{email}</strong>, a password reset link has been dispatched to your inbox.
          </p>
          <Link
            to="/login"
            className="auth-btn auth-btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              textDecoration: "none",
              padding: "0.8rem 1.5rem",
              borderRadius: "12px",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={18} /> Return to Sign In
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <AuthInput
              id="forgot-email"
              label="Registered Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={Mail}
              autoComplete="email"
            />

            <div style={{ marginTop: "0.25rem" }}>
              <AuthButton
                type="submit"
                loading={loading}
                icon={Send}
              >
                Send Reset Link
              </AuthButton>
            </div>
          </form>

          {/* Account Switch Link */}
          <div
            style={{
              textAlign: "center",
              fontSize: "14px",
              color: "var(--text-secondary, #64748B)",
              marginTop: "16px",
            }}
          >
            Remember your password?{" "}
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
        </>
      )}
    </AuthSplitLayout>
  );
};

export default ForgotPassword;
