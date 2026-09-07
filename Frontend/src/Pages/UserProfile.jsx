import React, { useState } from "react";
import { Save, Key, Trash2, Eye, EyeOff, AlertTriangle, User, Shield, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/authApi";
import { toast } from "react-toastify";

import ProfileHero from "../components/profile/ProfileHero";
import ProfileTabs from "../components/profile/ProfileTabs";
import PasswordStrengthIndicator from "../components/profile/PasswordStrengthIndicator";

const UserProfile = () => {
  const { user, updateUserState, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("personal"); // 'personal' | 'security' | 'danger'
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
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      toast.success("Profile changes saved successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please provide both current and new passwords");
      return;
    }

    setUpdatingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await authApi.deleteAccount();
      toast.info("Account permanently deleted");
      logout();
    } catch (err) {
      toast.error(err.message || "Failed to delete account");
      setDeletingAccount(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "var(--radius-md)",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    outline: "none",
    fontSize: "0.9rem",
    transition: "border-color 180ms ease, box-shadow 180ms ease",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "var(--text-secondary)",
    marginBottom: "0.4rem",
  };

  return (
    <div className="container" style={{ maxWidth: "1140px", paddingTop: "2.5rem", paddingBottom: "5rem" }}>
      {/* PAGE HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "clamp(1.8rem, 3vw, 2.3rem)",
            fontWeight: 900,
            color: "var(--text-primary)",
            lineHeight: 1.2,
            fontFamily: "var(--font-heading)",
            letterSpacing: "-0.03em",
            marginBottom: "0.35rem",
          }}
        >
          Account & Profile Settings
        </h1>
        <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>
          Manage your profile, security, and account preferences.
        </p>
      </div>

      {/* PROFILE IDENTITY HEADER HERO */}
      <ProfileHero user={user} updateUserState={updateUserState} />

      {/* SETTINGS NAVIGATION TABS */}
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* PERSONAL INFORMATION SECTION */}
      {activeTab === "personal" && (
        <form
          onSubmit={handleUpdateProfile}
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "2.25rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: "0.25rem" }}>
              Personal Information
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
              Manage the information displayed on your public author profile.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
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
                placeholder="e.g. San Francisco, CA"
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
                  color: bio.length > MAX_BIO_LENGTH ? "#f87171" : "var(--text-muted)",
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
      )}

      {/* SECURITY & PASSWORD SECTION */}
      {activeTab === "security" && (
        <form
          onSubmit={handleChangePassword}
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "2.25rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: "0.25rem" }}>
              Security & Password
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
              Update your password to keep your account secure.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
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
                    color: "var(--text-muted)",
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
                    color: "var(--text-muted)",
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
      )}

      {/* DANGER ZONE */}
      {activeTab === "danger" && (
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "2.25rem 2rem",
          }}
        >
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: "0.35rem" }}>
            Danger Zone
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "1.75rem", maxWidth: "680px" }}>
            Permanently delete your account, published posts, saved bookmarks, and associated personal data from MERN Blog. This action cannot be undone.
          </p>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="btn-secondary"
            style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
          >
            <Trash2 size={15} /> Delete Account
          </button>
        </div>
      )}

      {/* CONFIRMATION DELETE MODAL */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "var(--bg-overlay)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "2.25rem 2rem",
              maxWidth: "440px",
              width: "100%",
              textAlign: "center",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem auto",
                border: "1px solid var(--border-color)",
              }}
            >
              <AlertTriangle size={22} />
            </div>

            <h3 style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.2rem", marginBottom: "0.6rem" }}>
              Delete your account?
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "1.75rem" }}>
              This action is permanent and cannot be undone. All your publications, bookmarks, comments, and personal data will be erased.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "0.85rem" }}>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
                disabled={deletingAccount}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="btn-primary"
              >
                {deletingAccount ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
