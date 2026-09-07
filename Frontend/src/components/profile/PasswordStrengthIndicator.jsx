import React from "react";

const PasswordStrengthIndicator = ({ password = "" }) => {
  if (!password) return null;

  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { label: "Weak", percent: 33, color: "var(--brand-slate-blue)" };
    if (score <= 4) return { label: "Medium", percent: 66, color: "var(--brand-accent-soft)" };
    return { label: "Strong", percent: 100, color: "var(--accent-warm)" };
  };

  const strength = getStrength(password);

  return (
    <div style={{ marginTop: "0.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          marginBottom: "0.25rem",
          fontWeight: 600,
        }}
      >
        <span>Password strength:</span>
        <span style={{ color: strength.color }}>{strength.label}</span>
      </div>

      <div
        style={{
          height: "4px",
          width: "100%",
          background: "var(--border-color)",
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${strength.percent}%`,
            background: strength.color,
            transition: "width 250ms ease, background-color 250ms ease",
          }}
        />
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
