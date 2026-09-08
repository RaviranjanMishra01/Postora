import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Globe, Edit3, Share2, UserPlus, UserCheck, Sparkles, Shield, Camera } from "lucide-react";
import { toast } from "../../context/ToastContext";

const UserProfileHeader = ({
  user,
  currentUser,
  isOwnProfile = true,
  isFollowing = false,
  onFollowToggle,
  onEditClick,
}) => {
  if (!user) return null;

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/author/${user.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied to clipboard!");
  };

  const defaultAvatar =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";

  return (
    <div
      className="glass-card"
      style={{
        padding: "2.25rem 2rem",
        borderRadius: "var(--radius-lg, 16px)",
        background: "var(--bg-card, #1e293b)",
        border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
        marginBottom: "1.75rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Top Accent Banner Gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          background: "linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        {/* Left Column: Avatar & Main Identity */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <img
              src={user.avatar || defaultAvatar}
              alt={user.name}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3.5px solid var(--accent-primary, #ec4899)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
              }}
            />
            {user.role === "admin" || user.role === "superadmin" ? (
              <span
                title="Admin Account"
                style={{
                  position: "absolute",
                  bottom: "4px",
                  right: "4px",
                  background: "#ec4899",
                  color: "#ffffff",
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #1e293b",
                }}
              >
                <Shield size={14} />
              </span>
            ) : null}
          </div>

          <div style={{ maxWidth: "520px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
              <h1
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  color: "var(--text-primary, #f8fafc)",
                  fontFamily: "var(--font-heading, sans-serif)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}
              >
                {user.name}
              </h1>

              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "12px",
                  background: "rgba(236, 72, 153, 0.15)",
                  color: "var(--accent-primary, #ec4899)",
                  border: "1px solid rgba(236, 72, 153, 0.3)",
                }}
              >
                {user.role || "Author"}
              </span>
            </div>

            <p style={{ color: "var(--text-muted, #94a3b8)", fontSize: "0.92rem", marginTop: "0.2rem" }}>
              @{user.username}
            </p>

            {/* Bio text */}
            <p
              style={{
                color: "var(--text-secondary, #cbd5e1)",
                fontSize: "0.95rem",
                lineHeight: 1.55,
                marginTop: "0.75rem",
              }}
            >
              {user.bio || "No biography added yet. Update your profile to add a brief bio."}
            </p>

            {/* Metadata Chips (Location & Website) */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginTop: "0.85rem", flexWrap: "wrap" }}>
              {user.location && (
                <span
                  style={{
                    fontSize: "0.83rem",
                    color: "var(--text-muted, #94a3b8)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <MapPin size={15} color="var(--accent-primary, #ec4899)" /> {user.location}
                </span>
              )}

              {user.website && (
                <a
                  href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: "0.83rem",
                    color: "#38bdf8",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    textDecoration: "none",
                  }}
                >
                  <Globe size={15} /> {user.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleShareProfile}
            className="btn-secondary"
            style={{
              padding: "0.6rem 0.95rem",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "var(--bg-secondary, #0f172a)",
              border: "1px solid var(--border-color, #334155)",
              color: "var(--text-primary, #f8fafc)",
              borderRadius: "var(--radius-md, 8px)",
              cursor: "pointer",
            }}
          >
            <Share2 size={15} /> Share
          </button>

          {isOwnProfile ? (
            <button
              type="button"
              onClick={onEditClick}
              className="btn-primary"
              style={{
                padding: "0.6rem 1.15rem",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                borderRadius: "var(--radius-md, 8px)",
              }}
            >
              <Edit3 size={15} /> Edit Profile
            </button>
          ) : (
            <button
              type="button"
              onClick={onFollowToggle}
              className={isFollowing ? "btn-secondary" : "btn-primary"}
              style={{
                padding: "0.6rem 1.15rem",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                borderRadius: "var(--radius-md, 8px)",
              }}
            >
              {isFollowing ? (
                <>
                  <UserCheck size={16} /> Following
                </>
              ) : (
                <>
                  <UserPlus size={16} /> Follow
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
