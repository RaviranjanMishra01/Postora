import React from "react";
import { Loader2 } from "lucide-react";

const AuthButton = ({
  children,
  type = "submit",
  loading = false,
  disabled = false,
  onClick,
  icon: Icon,
  variant = "primary",
  style = {},
}) => {
  const isPrimary = variant === "primary";

  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={`auth-btn ${isPrimary ? "auth-btn-primary" : "auth-btn-secondary"}`}
      style={{
        width: "100%",
        height: "48px",
        padding: "0 1.25rem",
        fontSize: "0.95rem",
        fontWeight: 600,
        borderRadius: "12px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        cursor: loading || disabled ? "not-allowed" : "pointer",
        transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        outline: "none",
        position: "relative",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {loading ? (
        <>
          <Loader2 size={19} className="spin-animation" />
          <span>Please wait...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={19} />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default AuthButton;
