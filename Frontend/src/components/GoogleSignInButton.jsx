import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "../context/ToastContext";

const GoogleSignInButton = ({ text = "Continue with Google", onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    // 1. Check if Google Identity Services script is already loaded
    if (window.google?.accounts?.id) {
      setGisLoaded(true);
      return;
    }

    // 2. Load official Google Identity Services script dynamically
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGisLoaded(true);
    script.onerror = () => {
      console.warn("Failed to load Google Identity Services SDK");
    };
    document.head.appendChild(script);
  }, []);

  const handleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      toast.error("Google authentication token not received. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const res = await googleLogin({ credential: response.credential });
      toast.success(res.message || "Signed in with Google successfully!");

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
      toast.error(err.response?.data?.message || err.message || "Google sign-in could not be completed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    if (loading) return;

    if (!googleClientId || googleClientId === "your_google_client_id_here") {
      toast.error("Google Client ID is not configured in VITE_GOOGLE_CLIENT_ID.");
      return;
    }

    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Trigger Google One-Tap / OAuth prompt directly from Google
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback: render invisible GIS button to trigger Google popup
            const tempContainer = document.createElement("div");
            tempContainer.style.display = "none";
            document.body.appendChild(tempContainer);

            window.google.accounts.id.renderButton(tempContainer, {
              type: "standard",
              size: "large",
            });

            const clickTarget = tempContainer.querySelector("div[role=button]");
            if (clickTarget) {
              clickTarget.click();
            }
            setTimeout(() => {
              if (document.body.contains(tempContainer)) {
                document.body.removeChild(tempContainer);
              }
            }, 3000);
          }
        });
      } catch (err) {
        console.error("GIS initialization error:", err);
        toast.error("Google authentication service failed to initialize");
      }
    } else {
      toast.error("Google Identity Services script is loading. Please try again in a moment.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      disabled={loading}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "0.8rem 1rem",
        borderRadius: "10px",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-color)",
        fontWeight: "600",
        fontSize: "0.92rem",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        opacity: loading ? 0.7 : 1,
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.borderColor = "var(--Postora-pink, #FF3F7F)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(255, 63, 127, 0.15)";
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.currentTarget.style.borderColor = "var(--border-color)";
          e.currentTarget.style.boxShadow = "none";
        }
      }}
    >
      {/* Official Google Logo */}
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
      <span>{loading ? "Authenticating..." : text}</span>
    </button>
  );
};

export default GoogleSignInButton;
