import React, { useState } from "react";
import { Save, Key, Eye, EyeOff, User, MapPin, Globe, Shield, Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/authApi";
import { toast } from "../../context/ToastContext";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

const InlineProfileSettings = () => {
  const { user, updateUserState } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [location, setLocation] = useState(user?.location || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const MAX_BIO_LENGTH = 500;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (bio.length > MAX_BIO_LENGTH) {
      toast.error(`Bio cannot exceed ${MAX_BIO_LENGTH} characters`);
      return;
    }

    setSavingProfile(true);
    try {
      const res = await authApi.updateProfile({ name, bio, website, location });
      updateUserState(res.data.user);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please enter both current and new password");
      return;
    }

    setUpdatingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setUploadingAvatar(true);
    try {
      const res = await authApi.changeAvatar(formData);
      updateUserState(res.data.user);
      toast.success("Avatar updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "var(--radius-md, 8px)",
    background: "var(--bg-secondary, #0f172a)",
    border: "1px solid var(--border-color, #334155)",
    color: "var(--text-primary, #f8fafc)",
    outline: "none",
    fontSize: "0.9rem",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--text-secondary, #94a3b8)",
    marginBottom: "0.4rem",
  };

  const defaultAvatar =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header Info */}
      <div>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            color: "var(--text-primary, #f8fafc)",
            margin: "0 0 0.35rem 0",
          }}
        >
          Profile Settings
        </h2>
        <p style={{ fontSize: "0.92rem", color: "var(--text-secondary, #94a3b8)", margin: 0 }}>
          Manage your public profile information, bio, location, and account security.
        </p>
      </div>

      {/* Profile Avatar Card */}
      <div
        className="glass-card"
        style={{
          padding: "1.75rem",
          borderRadius: "var(--radius-lg, 16px)",
          background: "var(--bg-card, #1e293b)",
          border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={user?.avatar || defaultAvatar}
            alt={user?.name}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid var(--accent-primary, #ec4899)",
            }}
          />
          <label
            htmlFor="inline-avatar-upload"
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              background: "var(--accent-primary, #ec4899)",
              color: "#ffffff",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "2px solid #1e293b",
            }}
          >
            <Camera size={14} />
          </label>
          <input
            id="inline-avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
        </div>

        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary, #f8fafc)", margin: 0 }}>
            {user?.name}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted, #94a3b8)", margin: "0.15rem 0 0.5rem 0" }}>
            @{user?.username} • {user?.email}
          </p>
          <label
            htmlFor="inline-avatar-upload"
            className="btn-secondary"
            style={{
              padding: "0.4rem 0.85rem",
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "inline-block",
            }}
          >
            {uploadingAvatar ? "Uploading..." : "Change Photo"}
          </label>
        </div>
      </div>

      {/* Personal Info Form */}
      <form
        onSubmit={handleUpdateProfile}
        className="glass-card"
        style={{
          padding: "1.75rem",
          borderRadius: "var(--radius-lg, 16px)",
          background: "var(--bg-card, #1e293b)",
          border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary, #f8fafc)", margin: 0 }}>
          Personal Information
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. New Delhi, India"
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={labelStyle}>Bio</label>
            <span
              style={{
                fontSize: "0.75rem",
                color: bio.length > MAX_BIO_LENGTH ? "#f87171" : "var(--text-muted, #94a3b8)",
                fontWeight: 600,
              }}
            >
              {bio.length} / {MAX_BIO_LENGTH}
            </span>
          </div>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a brief description about your background and interests..."
            maxLength={MAX_BIO_LENGTH}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div>
          <label style={labelStyle}>Personal Website</label>
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
          <button type="submit" className="btn-primary" disabled={savingProfile}>
            <Save size={15} />
            <span>{savingProfile ? "Saving..." : "Save Profile Changes"}</span>
          </button>
        </div>
      </form>

      {/* Security & Password Form */}
      <form
        onSubmit={handleChangePassword}
        className="glass-card"
        style={{
          padding: "1.75rem",
          borderRadius: "var(--radius-lg, 16px)",
          background: "var(--bg-card, #1e293b)",
          border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary, #f8fafc)", margin: 0 }}>
          Security & Password
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          <div>
            <label style={labelStyle}>Current Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showCurrentPass ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
                style={{ ...inputStyle, paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted, #94a3b8)",
                  cursor: "pointer",
                }}
              >
                {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label style={labelStyle}>New Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showNewPass ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
                style={{ ...inputStyle, paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted, #94a3b8)",
                  cursor: "pointer",
                }}
              >
                {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <PasswordStrengthIndicator password={newPassword} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
          <button type="submit" className="btn-primary" disabled={updatingPassword}>
            <Key size={15} />
            <span>{updatingPassword ? "Updating..." : "Update Password"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default InlineProfileSettings;
