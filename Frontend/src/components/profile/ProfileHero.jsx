import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Globe, MapPin, ExternalLink, UserCheck, PenTool } from "lucide-react";
import { authApi } from "../../api/authApi";
import { toast } from "../../context/ToastContext";

const ProfileHero = ({ user, updateUserState }) => {
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  if (!user) return null;

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    setAvatarLoading(true);
    setAvatarError(false);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await authApi.changeAvatar(formData);
      updateUserState(res.data.user);
      toast.success("Avatar image updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to upload avatar");
    } finally {
      setAvatarLoading(false);
    }
  };

  const formattedWebsite = user.website
    ? user.website.startsWith("http")
      ? user.website
      : `https://${user.website}`
    : "";

  return (
    <section
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        padding: "2.25rem 2rem",
        marginBottom: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Avatar Container */}
      <div style={{ position: "relative", marginBottom: "1.25rem" }}>
        <div
          style={{
            width: "104px",
            height: "104px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid var(--border-color)",
            boxShadow: "var(--shadow-subtle)",
            background: "var(--bg-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {user.avatar && !avatarError ? (
            <img
              src={user.avatar}
              alt={user.name}
              onError={() => setAvatarError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "0.05em",
                fontFamily: "var(--font-heading)",
              }}
            >
              {getInitials(user.name)}
            </span>
          )}
        </div>

        {/* Camera Upload Overlay Button */}
        <label
          htmlFor="profile-avatar-input"
          style={{
            position: "absolute",
            bottom: "2px",
            right: "2px",
            background: "var(--btn-primary-bg)",
            color: "var(--btn-primary-text)",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "var(--shadow-subtle)",
            transition: "transform 180ms ease, background-color 180ms ease",
            opacity: avatarLoading ? 0.6 : 1,
          }}
          title="Change profile photo"
        >
          <Camera size={15} />
        </label>
        <input
          id="profile-avatar-input"
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          disabled={avatarLoading}
          style={{ display: "none" }}
        />
      </div>

      {/* Name, Username & Role */}
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "var(--text-primary)",
          lineHeight: 1.25,
          marginBottom: "0.35rem",
          fontFamily: "var(--font-heading)",
        }}
      >
        {user.name}
      </h1>

      <div
        style={{
          fontSize: "0.88rem",
          color: "var(--text-secondary)",
          fontWeight: 600,
          marginBottom: "0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          justifyContent: "center",
        }}
      >
        <span>@{user.username}</span>
        <span>·</span>
        <span
          style={{
            textTransform: "uppercase",
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: "var(--text-primary)",
            background: "var(--bg-primary)",
            padding: "0.15rem 0.6rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-color)",
          }}
        >
          {user.role || "User"}
        </span>
      </div>

      {/* Bio Description */}
      {user.bio && (
        <p
          style={{
            fontSize: "0.92rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            maxWidth: "640px",
            marginBottom: "1rem",
          }}
        >
          {user.bio}
        </p>
      )}

      {/* Meta Row: Location & Website */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          marginBottom: "1.25rem",
        }}
      >
        {user.location && (
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <MapPin size={14} color="var(--accent-warm)" /> {user.location}
          </span>
        )}
        {formattedWebsite && (
          <a
            href={formattedWebsite}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              color: "var(--text-primary)",
              fontWeight: 600,
            }}
          >
            <Globe size={14} color="var(--accent-warm)" /> {formattedWebsite.replace(/^https?:\/\//, "")} <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Header Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <label
          htmlFor="profile-avatar-input"
          className="btn-primary"
          style={{ cursor: "pointer" }}
        >
          <Camera size={14} /> {avatarLoading ? "Uploading..." : "Change Photo"}
        </label>

        <Link to="/create-post" className="btn-secondary">
          <PenTool size={14} /> Create Post
        </Link>

        {user.username && (
          <Link to={`/author/${user.username}`} className="btn-secondary">
            <UserCheck size={14} /> View Public Profile
          </Link>
        )}
      </div>
    </section>
  );
};

export default ProfileHero;
