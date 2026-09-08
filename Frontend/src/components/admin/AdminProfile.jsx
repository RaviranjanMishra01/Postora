import React, { useState } from "react";
import { User, Key, Save, Camera, Eye, EyeOff, Shield } from "lucide-react";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "../../context/ToastContext";

const AdminProfile = () => {
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authApi.updateProfile({ name, bio, website, location });
      updateUserState(res.data.user);
      toast.success("Admin profile updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please provide both current and new password");
      return;
    }
    setUpdatingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success("Admin password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    outline: "none",
    fontSize: "0.9rem",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--text-secondary)",
    marginBottom: "0.4rem",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* ADMIN IDENTITY HERO CARD */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          boxShadow: "var(--shadow-subtle)",
        }}
      >
        <img
          src={user?.avatar || "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"}
          alt={user?.name}
          style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--carrino-pink)" }}
        />
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.25rem 0", fontFamily: "var(--font-heading)" }}>
            {user?.name}
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: 0 }}>
            @{user?.username} · <span style={{ color: "var(--carrino-pink)", fontWeight: 800 }}>{user?.role?.toUpperCase()}</span>
          </p>
        </div>
      </div>

      {/* EDIT PROFILE FORM */}
      <form
        onSubmit={handleUpdateProfile}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          boxShadow: "var(--shadow-subtle)",
        }}
      >
        <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-heading)" }}>
          Admin Information
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. San Francisco, CA" style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Bio</label>
          <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Admin bio..." style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn-primary" disabled={savingProfile}>
            <Save size={15} /> {savingProfile ? "Saving..." : "Save Admin Profile"}
          </button>
        </div>
      </form>

      {/* SECURITY & PASSWORD FORM */}
      <form
        onSubmit={handleChangePassword}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          boxShadow: "var(--shadow-subtle)",
        }}
      >
        <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-heading)" }}>
          Security & Password
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
          <div>
            <label style={labelStyle}>Current Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showCurrentPass ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                style={{ ...inputStyle, paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ ...inputStyle, paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn-primary" disabled={updatingPassword}>
            <Key size={15} /> {updatingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
