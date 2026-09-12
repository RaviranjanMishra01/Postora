import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, BookOpen, Users, Sparkles, Quote } from "lucide-react";

const AuthSplitLayout = ({ children, title, subtitle }) => {
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "var(--bg-primary, #F8FAFC)",
        color: "var(--text-primary, #0F172A)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <style>{`
        .auth-split-wrapper {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          width: 100%;
          min-height: 100vh;
        }

        .auth-custom-input:focus {
          border-color: var(--Postora-pink, #FF3F7F) !important;
          box-shadow: 0 0 0 4px rgba(255, 63, 127, 0.12) !important;
          background-color: var(--bg-card, #FFFFFF) !important;
        }

        .auth-custom-input:hover:not(:focus) {
          border-color: #CBD5E1 !important;
        }

        .auth-btn-primary {
          background-color: var(--Postora-pink, #FF3F7F) !important;
          color: #FFFFFF !important;
          border: none !important;
          box-shadow: 0 4px 14px rgba(255, 63, 127, 0.25) !important;
        }

        .auth-btn-primary:hover:not(:disabled) {
          background-color: var(--Postora-pink-hover, #E6356F) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 20px rgba(255, 63, 127, 0.35) !important;
        }

        .auth-btn-primary:active:not(:disabled) {
          transform: translateY(0) !important;
          box-shadow: 0 2px 8px rgba(255, 63, 127, 0.25) !important;
        }

        .auth-btn-google:hover:not(:disabled) {
          border-color: rgba(255, 63, 127, 0.4) !important;
          background-color: var(--bg-secondary, #F8FAFC) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
          transform: translateY(-1px) !important;
        }

        .auth-btn-google:active:not(:disabled) {
          transform: translateY(0) !important;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spin-animation {
          animation: spin 1s linear infinite;
        }

        .auth-mobile-header {
          display: none;
        }

        @media (max-width: 960px) {
          .auth-split-wrapper {
            grid-template-columns: 1fr;
          }
          .auth-left-visual {
            display: none !important;
          }
          .auth-mobile-header {
            display: flex !important;
          }
          .auth-right-form {
            padding: 2.5rem 1.25rem !important;
          }
        }
      `}</style>

      <div className="auth-split-wrapper">
        {/* LEFT VISUAL PANEL - BRAND & EDITORIAL SHOWCASE */}
        <div
          className="auth-left-visual"
          style={{
            background: "var(--bg-secondary, #F8FAFC)",
            borderRight: "1px solid var(--border-color, #E2E8F0)",
            padding: "3.5rem 4rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
            minHeight: "100vh",
            boxSizing: "border-box",
          }}
        >
          {/* Subtle Pink Ambient Glow */}
          <div
            style={{
              position: "absolute",
              top: "-12%",
              left: "-12%",
              width: "450px",
              height: "450px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255, 63, 127, 0.12) 0%, rgba(255,255,255,0) 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-10%",
              right: "-10%",
              width: "480px",
              height: "480px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(76, 141, 255, 0.08) 0%, rgba(255,255,255,0) 70%)",
              filter: "blur(70px)",
              pointerEvents: "none",
            }}
          />

          {/* Abstract Light Grid Overlay Pattern */}
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0.35,
              pointerEvents: "none",
            }}
          >
            <pattern id="auth-grid-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="var(--text-muted, #94A3B8)" opacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#auth-grid-dots)" />
          </svg>

          {/* Top Brand Logo Tag */}
          <div style={{ zIndex: 2 }}>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #FF3F7F 0%, #E6356F 100%)",
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
                  fontSize: "1.45rem",
                  fontWeight: 800,
                  color: "var(--text-primary, #0F172A)",
                  letterSpacing: "-0.5px",
                }}
              >
                Postora
              </span>
            </Link>
          </div>

          {/* Middle Content Section */}
          <div style={{ zIndex: 2, margin: "auto 0", padding: "2.5rem 0" }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.4rem 0.95rem",
                  borderRadius: "9999px",
                  background: "rgba(255, 63, 127, 0.08)",
                  border: "1px solid rgba(255, 63, 127, 0.2)",
                  color: "var(--Postora-pink, #FF3F7F)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  marginBottom: "1.5rem",
                }}
              >
                <Sparkles size={14} /> Modern Publishing Platform
              </div>

              {/* Main Headline */}
              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  lineHeight: 1.18,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary, #0F172A)",
                  marginBottom: "1.2rem",
                }}
              >
                Where great ideas find their voice.
              </h1>

              {/* Subtitle / Description */}
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "var(--text-secondary, #475569)",
                  lineHeight: 1.6,
                  maxWidth: "480px",
                  marginBottom: "2.25rem",
                }}
              >
                Write, connect, and build an audience with custom Markdown tools, real-time analytics, and vibrant developer communities.
              </p>
            </motion.div>

            {/* Metric SaaS Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: "480px" }}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: "1.25rem",
                  borderRadius: "14px",
                  background: "var(--bg-card, #FFFFFF)",
                  border: "1px solid var(--border-color, #E2E8F0)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--Postora-pink, #FF3F7F)" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(255, 63, 127, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Users size={16} color="var(--Postora-pink, #FF3F7F)" />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--text-primary, #0F172A)" }}>
                    10,000+
                  </span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748B)", fontWeight: 500 }}>
                  Active Creators & Authors
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: "1.25rem",
                  borderRadius: "14px",
                  background: "var(--bg-card, #FFFFFF)",
                  border: "1px solid var(--border-color, #E2E8F0)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(76, 141, 255, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BookOpen size={16} color="#3B82F6" />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--text-primary, #0F172A)" }}>
                    50,000+
                  </span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748B)", fontWeight: 500 }}>
                  Published Tech Stories
                </div>
              </motion.div>
            </div>
          </div>

          {/* Inspirational Quote Footer */}
          <div
            style={{
              zIndex: 2,
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--border-color, #E2E8F0)",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
            }}
          >
            <Quote size={20} style={{ color: "var(--Postora-pink, #FF3F7F)", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <p
                style={{
                  fontSize: "0.92rem",
                  color: "var(--text-primary, #0F172A)",
                  fontWeight: 500,
                  lineHeight: 1.5,
                  marginBottom: "0.25rem",
                }}
              >
                "Share ideas. Build your audience. Create something worth reading."
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted, #94A3B8)", fontWeight: 500 }}>
                Postora — Modern publishing for creators & developers
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM PANEL - VERTICALLY CENTERED SINGLE COHESIVE UNIT */}
        <div
          className="auth-right-form"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3.5rem 2.5rem",
            background: "var(--bg-card, #FFFFFF)",
            position: "relative",
            minHeight: "100vh",
            boxSizing: "border-box",
          }}
        >
          {/* Centered Max-Width 440px Content Container */}
          <div style={{ width: "100%", maxWidth: "440px", margin: "0 auto" }}>
            {/* Mobile Top Brand Header */}
            <div className="auth-mobile-header" style={{ marginBottom: "2rem", justifyContent: "center" }}>
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
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #FF3F7F 0%, #E6356F 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(255, 63, 127, 0.25)",
                  }}
                >
                  <Feather size={20} color="#ffffff" />
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    color: "var(--text-primary, #0F172A)",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Postora
                </span>
              </Link>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {/* Main Heading & Description */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                  <h2
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.85rem",
                      fontWeight: 800,
                      color: "var(--text-primary, #0F172A)",
                      letterSpacing: "-0.02em",
                      marginBottom: "10px",
                    }}
                  >
                    {title}
                  </h2>
                  <p style={{ color: "var(--text-secondary, #64748B)", fontSize: "0.93rem", lineHeight: 1.55, margin: 0 }}>
                    {subtitle}
                  </p>
                </div>

                {/* Form & Actions (including Primary Button, Account Switch Link, Divider, Google Button) */}
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSplitLayout;
