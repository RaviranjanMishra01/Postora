import React, { useState, useEffect } from "react";
import { Settings, Lock, Wrench, Save, CheckCircle, AlertTriangle } from "lucide-react";
import { adminApi } from "../../api/commentInteractionApi";
import { toast } from "../../context/ToastContext";

const AdminSystemSettings = ({ activeSubTab }) => {
  const [settings, setSettings] = useState({
    siteName: "carrino",
    allowUserRegistrations: true,
    requireEmailVerification: true,
    maxFeaturedPosts: 5,
    maintenanceMode: false,
    enforce2FA: false,
    sessionTimeoutMinutes: 60,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminApi
      .getSettings()
      .then((res) => {
        if (res.data.systemSettings) {
          setSettings((prev) => ({ ...prev, ...res.data.systemSettings }));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await adminApi.updateSettings(settings);
      toast.success("System configuration saved successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* 1. SITE SETTINGS */}
      {activeSubTab === "system-settings" && (
        <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 1.25rem 0", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Settings color="var(--carrino-pink)" size={18} /> Global Platform Settings
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              <div className="form-group">
                <label className="form-label">Platform Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Featured Carousel Posts</label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.maxFeaturedPosts}
                  onChange={(e) => handleChange("maxFeaturedPosts", Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                <input
                  type="checkbox"
                  checked={settings.allowUserRegistrations}
                  onChange={(e) => handleChange("allowUserRegistrations", e.target.checked)}
                  style={{ accentColor: "var(--carrino-pink)", width: "18px", height: "18px" }}
                />
                <span>Allow New User Registrations</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => handleChange("requireEmailVerification", e.target.checked)}
                  style={{ accentColor: "var(--carrino-pink)", width: "18px", height: "18px" }}
                />
                <span>Require Email Verification for New Authors</span>
              </label>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "1.5rem", width: "auto" }}>
              <Save size={16} /> Save Platform Settings
            </button>
          </div>
        </form>
      )}

      {/* 2. SECURITY SETTINGS */}
      {activeSubTab === "security-settings" && (
        <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 1.25rem 0", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Lock color="var(--carrino-pink)" size={18} /> System Security Policies
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                <input
                  type="checkbox"
                  checked={settings.enforce2FA}
                  onChange={(e) => handleChange("enforce2FA", e.target.checked)}
                  style={{ accentColor: "var(--carrino-pink)", width: "18px", height: "18px" }}
                />
                <span>Enforce Two-Factor Authentication (2FA) for All Administrators</span>
              </label>

              <div className="form-group" style={{ maxWidth: "300px" }}>
                <label className="form-label">Admin Session Timeout (Minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.sessionTimeoutMinutes}
                  onChange={(e) => handleChange("sessionTimeoutMinutes", Number(e.target.value))}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "1.5rem", width: "auto" }}>
              <Save size={16} /> Save Security Policies
            </button>
          </div>
        </form>
      )}

      {/* 3. MAINTENANCE MODE */}
      {activeSubTab === "maintenance" && (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 1.25rem 0", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Wrench color="var(--carrino-pink)" size={18} /> Platform Maintenance Control
          </h3>

          <div
            style={{
              padding: "1.25rem",
              borderRadius: "8px",
              background: settings.maintenanceMode ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
              border: `1px solid ${settings.maintenanceMode ? "#EF4444" : "#22C55E"}`,
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {settings.maintenanceMode ? <AlertTriangle color="#EF4444" size={24} /> : <CheckCircle color="#22C55E" size={24} />}
            <div>
              <div style={{ fontWeight: 800, color: settings.maintenanceMode ? "#EF4444" : "#22C55E", fontSize: "0.95rem" }}>
                Platform Status: {settings.maintenanceMode ? "MAINTENANCE MODE ACTIVE" : "OPERATIONAL & ONLINE"}
              </div>
              <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                {settings.maintenanceMode
                  ? "Public access is paused. Only Super Admins can access the system."
                  : "All platform systems are fully operational and open to users."}
              </p>
            </div>
          </div>

          <button
            type="button"
            className={settings.maintenanceMode ? "btn-secondary" : "btn-primary"}
            onClick={() => {
              const newMode = !settings.maintenanceMode;
              handleChange("maintenanceMode", newMode);
              adminApi
                .updateSettings({ maintenanceMode: newMode })
                .then(() => toast.success(`Maintenance Mode ${newMode ? "Enabled" : "Disabled"}`))
                .catch((err) => toast.error(err.message));
            }}
            style={{
              background: settings.maintenanceMode ? "var(--accent-green)" : "#EF4444",
              borderColor: "transparent",
              color: "#FFFFFF",
              fontWeight: 800,
            }}
          >
            {settings.maintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSystemSettings;
