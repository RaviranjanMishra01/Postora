import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, BookOpen, Users, Sparkles } from "lucide-react";

const AuthSplitLayout = ({ children, title, subtitle }) => {
  const location = useLocation();
  const isRegister = location.pathname === "/register";
  const isForgotPassword = location.pathname === "/forgot-password";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <style>{`
        .auth-split-wrapper {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          width: 100%;
          min-height: 100vh;
        }

        @media (max-width: 960px) {
          .auth-split-wrapper {
            grid-template-columns: 1fr;
          }
          .auth-left-visual {
            display: none !important;
          }
          .auth-right-form {
            padding: 2.5rem 1.25rem !important;
          }
        }

        .auth-input-focus:focus-within {
          border-color: var(--carrino-pink, #FF3F7F) !important;
          box-shadow: 0 0 0 3px rgba(255, 63, 127, 0.15) !important;
        }
      `}</style>

      <div className="auth-split-wrapper">
        {/* LEFT VISUAL PANEL - BRAND & EDITORIAL SHOWCASE */}
        <div
          className="auth-left-visual"
          style={{
            background: "var(--bg-secondary)",
            borderRight: "1px solid var(--border-color)",
            padding: "3.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ambient Glow Effects */}
          <div
            style={{
              position: "absolute",
              top: "-10%",
              left: "-10%",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255, 63, 127, 0.15) 0%, rgba(0,0,0,0) 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-10%",
              right: "-10%",
              width: "450px",
              height: "450px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(84, 119, 146, 0.18) 0%, rgba(0,0,0,0) 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          {/* Top Brand Tag */}
          <div style={{ zIndex: 2 }}>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "var(--carrino-pink, #FF3F7F)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(255, 63, 127, 0.3)",
                }}
              >
                <Feather size={22} color="#ffffff" />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.5px",
                }}
              >
                Carrino
              </span>
            </Link>
          </div>

          {/* Middle Editorial Illustration Card */}
          <div style={{ zIndex: 2, margin: "auto 0", padding: "2rem 0" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 0.9rem",
                  borderRadius: "var(--radius-full, 9999px)",
                  background: "rgba(255, 63, 127, 0.1)",
                  border: "1px solid rgba(255, 63, 127, 0.25)",
                  color: "var(--carrino-pink, #FF3F7F)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  marginBottom: "1.25rem",
                }}
              >
                <Sparkles size={14} /> Modern Publishing Platform
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                  marginBottom: "1rem",
                }}
              >
                Where great ideas find their voice.
              </h1>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  maxWidth: "480px",
                  marginBottom: "2rem",
                }}
              >
                Write, connect, and build an audience with custom Markdown tools, real-time analytics, and vibrant developer communities.
              </p>
            </motion.div>

            {/* Interactive Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: "460px" }}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  padding: "1.2rem",
                  borderRadius: "var(--radius-md, 14px)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--carrino-pink, #FF3F7F)", marginBottom: "0.4rem" }}>
                  <Users size={18} />
                  <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>10,000+</span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                  Active Creators & Authors
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  padding: "1.2rem",
                  borderRadius: "var(--radius-md, 14px)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--accent-blue, #4C8DFF)", marginBottom: "0.4rem" }}>
                  <BookOpen size={18} />
                  <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>50,000+</span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                  Published Tech Stories
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Statement */}
          <div
            style={{
              zIndex: 2,
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <p
              style={{
                fontStyle: "italic",
                fontSize: "1rem",
                color: "var(--text-primary)",
                fontWeight: 600,
                lineHeight: 1.4,
                marginBottom: "0.3rem",
              }}
            >
              "Share ideas. Build your audience. Create something worth reading."
            </p>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              Carrino — a modern publishing platform for creators and developers.
            </p>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div
          className="auth-right-form"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "3.5rem 4rem",
            background: "var(--bg-card)",
            position: "relative",
          }}
        >
          {/* Top-Right Navigation Link */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2rem" }}>
            <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              {isRegister ? (
                <>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{
                      color: "var(--carrino-pink, #FF3F7F)",
                      fontWeight: 700,
                      textDecoration: "none",
                      marginLeft: "0.3rem",
                    }}
                  >
                    Log in
                  </Link>
                </>
              ) : isForgotPassword ? (
                <>
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    style={{
                      color: "var(--carrino-pink, #FF3F7F)",
                      fontWeight: 700,
                      textDecoration: "none",
                      marginLeft: "0.3rem",
                    }}
                  >
                    Log in
                  </Link>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{
                      color: "var(--carrino-pink, #FF3F7F)",
                      fontWeight: 700,
                      textDecoration: "none",
                      marginLeft: "0.3rem",
                    }}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Form Content Wrapper with Framer Motion Animation */}
          <div style={{ width: "100%", maxWidth: "420px", margin: "0 auto" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: isRegister ? 24 : -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRegister ? -24 : 24 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <div style={{ marginBottom: "2rem" }}>
                  <h2
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.02em",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {title}
                  </h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.5 }}>
                    {subtitle}
                  </p>
                </div>

                {children}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Footer Spacer */}
          <div style={{ marginTop: "2rem" }} />
        </div>
      </div>
    </div>
  );
};

export default AuthSplitLayout;
