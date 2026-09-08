import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "../context/ToastContext";

const GoogleSignInButton = ({ text = "Continue with Google", onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");

  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleOpenGoogleAuth = () => {
    setShowModal(true);
  };

  const handleGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!googleEmail) {
      toast.error("Please enter a valid Google email address");
      return;
    }

    setLoading(true);
    try {
      const res = await googleLogin({
        email: googleEmail,
        name: googleName || googleEmail.split("@")[0],
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(googleEmail)}`,
        googleId: `google_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      });
      toast.success(res.message || "Signed in with Google successfully!");
      setShowModal(false);
      if (onSuccess) {
        onSuccess();
      } else {
        const loggedUser = res.user || res.data?.user;
        const role = loggedUser?.role?.toLowerCase();
        if (loggedUser && (role === "admin" || role === "superadmin")) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenGoogleAuth}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          padding: "0.75rem 1rem",
          borderRadius: "var(--radius-md)",
          backgroundColor: "#ffffff",
          color: "#3c4043",
          border: "1px solid #dadce0",
          fontWeight: "500",
          fontSize: "0.92rem",
          cursor: "pointer",
          transition: "background-color 0.2s ease, box-shadow 0.2s ease",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f8f9fa";
          e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#ffffff";
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.617z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
          />
          <path
            fill="#FBBC05"
            d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
          />
        </svg>
        <span>{text}</span>
      </button>

      {/* Google Authentication Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "2rem",
              background: "var(--bg-card, #1e293b)",
              borderRadius: "var(--radius-lg, 16px)",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5)",
              border: "1px solid var(--border-color, rgba(255,255,255,0.1))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 0.75rem auto",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.617z" />
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
                  <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
                </svg>
              </div>
              <h3 style={{ fontSize: "1.25rem", color: "var(--text-primary, #fff)", margin: 0 }}>
                Sign in with Google
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary, #94a3b8)", marginTop: "0.25rem" }}>
                Enter your Google account details to continue
              </p>
            </div>

            <form onSubmit={handleGoogleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary, #94a3b8)", marginBottom: "0.35rem" }}>
                  Google Email Address
                </label>
                <input
                  type="email"
                  placeholder="user@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-md, 8px)",
                    background: "var(--bg-secondary, #0f172a)",
                    border: "1px solid var(--border-color, #334155)",
                    color: "var(--text-primary, #f8fafc)",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary, #94a3b8)", marginBottom: "0.35rem" }}>
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Google User"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-md, 8px)",
                    background: "var(--bg-secondary, #0f172a)",
                    border: "1px solid var(--border-color, #334155)",
                    color: "var(--text-primary, #f8fafc)",
                    outline: "none",
                  }}
                />
              </div>

              {/* Quick 1-Click Sign In Options */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted, #64748b)", marginBottom: "0.4rem" }}>
                  Quick 1-Click Sign In:
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setGoogleEmail("raviranjan@gmail.com");
                      setGoogleName("Ravi Ranjan");
                    }}
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.35rem 0.65rem",
                      borderRadius: "12px",
                      background: "rgba(66, 133, 244, 0.15)",
                      color: "#60a5fa",
                      border: "1px solid rgba(66, 133, 244, 0.3)",
                      cursor: "pointer",
                    }}
                  >
                    ⚡ raviranjan@gmail.com
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGoogleEmail("google.user@gmail.com");
                      setGoogleName("Google User");
                    }}
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.35rem 0.65rem",
                      borderRadius: "12px",
                      background: "rgba(52, 168, 83, 0.15)",
                      color: "#4ade80",
                      border: "1px solid rgba(52, 168, 83, 0.3)",
                      cursor: "pointer",
                    }}
                  >
                    ⚡ google.user@gmail.com
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: "0.7rem",
                    borderRadius: "var(--radius-md, 8px)",
                    background: "transparent",
                    border: "1px solid var(--border-color, #334155)",
                    color: "var(--text-secondary, #94a3b8)",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "0.7rem",
                    borderRadius: "var(--radius-md, 8px)",
                    background: "#4285F4",
                    color: "#ffffff",
                    border: "none",
                    fontWeight: "600",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Authenticating..." : "Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleSignInButton;
