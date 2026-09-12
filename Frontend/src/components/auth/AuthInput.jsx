import React from "react";

const AuthInput = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  icon: Icon,
  rightElement,
  autoComplete,
  error,
  disabled = false,
  labelRight,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", width: "100%" }}>
      {(label || labelRight) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {label && (
            <label
              htmlFor={id}
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-primary, #0F172A)",
                letterSpacing: "-0.01em",
              }}
            >
              {label}
              {required && <span style={{ color: "var(--Postora-pink, #FF3F7F)", marginLeft: "3px" }}>*</span>}
            </label>
          )}
          {labelRight && <div>{labelRight}</div>}
        </div>
      )}

      <div
        className="auth-input-container"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {Icon && (
          <div
            style={{
              position: "absolute",
              left: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted, #94A3B8)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <Icon size={18} />
          </div>
        )}

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          style={{
            width: "100%",
            height: "48px",
            paddingLeft: Icon ? "2.6rem" : "1rem",
            paddingRight: rightElement ? "2.75rem" : "1rem",
            fontSize: "0.92rem",
            fontWeight: 500,
            borderRadius: "12px",
            border: error ? "1.5px solid #EF4444" : "1px solid var(--border-color, #E2E8F0)",
            backgroundColor: "var(--bg-secondary, #F8FAFC)",
            color: "var(--text-primary, #0F172A)",
            outline: "none",
            transition: "all 200ms ease",
            boxSizing: "border-box",
          }}
          className="auth-custom-input"
        />

        {rightElement && (
          <div
            style={{
              position: "absolute",
              right: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <span style={{ fontSize: "0.78rem", color: "#EF4444", fontWeight: 500, marginTop: "2px" }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default AuthInput;
