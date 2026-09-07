import React from "react";

export const CardSkeleton = () => (
  <div className="editorial-card" style={{ padding: "1rem", display: "flex", flexDirection: "column" }}>
    <div className="skeleton" style={{ height: "180px", marginBottom: "0.85rem", borderRadius: "var(--radius-md)" }} />
    <div className="skeleton" style={{ height: "14px", width: "30%", marginBottom: "0.5rem" }} />
    <div className="skeleton" style={{ height: "20px", width: "90%", marginBottom: "0.5rem" }} />
    <div className="skeleton" style={{ height: "14px", width: "100%", marginBottom: "0.35rem" }} />
    <div className="skeleton" style={{ height: "14px", width: "70%", marginBottom: "1rem" }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
      <div className="skeleton" style={{ height: "14px", width: "80px" }} />
      <div className="skeleton" style={{ height: "14px", width: "50px" }} />
    </div>
  </div>
);

export const HeroSkeleton = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "2rem",
      padding: "2rem 0",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="skeleton" style={{ height: "140px", borderRadius: "var(--radius-md)" }} />
      <div className="skeleton" style={{ height: "140px", borderRadius: "var(--radius-md)" }} />
    </div>
    <div>
      <div className="skeleton" style={{ height: "320px", borderRadius: "var(--radius-md)", marginBottom: "1rem" }} />
      <div className="skeleton" style={{ height: "32px", width: "85%", marginBottom: "0.75rem" }} />
      <div className="skeleton" style={{ height: "16px", width: "100%", marginBottom: "0.5rem" }} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <div className="skeleton" style={{ height: "20px", width: "40%", marginBottom: "0.5rem" }} />
      <div className="skeleton" style={{ height: "50px" }} />
      <div className="skeleton" style={{ height: "50px" }} />
      <div className="skeleton" style={{ height: "50px" }} />
      <div className="skeleton" style={{ height: "50px" }} />
    </div>
  </div>
);

export const PostDetailSkeleton = () => (
  <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
    <div className="skeleton" style={{ height: "20px", width: "20%", marginBottom: "1rem" }} />
    <div className="skeleton" style={{ height: "42px", width: "90%", marginBottom: "1.5rem" }} />
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
      <div className="skeleton" style={{ width: "44px", height: "44px", borderRadius: "50%" }} />
      <div>
        <div className="skeleton" style={{ height: "16px", width: "120px", marginBottom: "0.4rem" }} />
        <div className="skeleton" style={{ height: "12px", width: "180px" }} />
      </div>
    </div>
    <div className="skeleton" style={{ height: "380px", borderRadius: "var(--radius-lg)", marginBottom: "2rem" }} />
    <div className="skeleton" style={{ height: "16px", width: "100%", marginBottom: "0.6rem" }} />
    <div className="skeleton" style={{ height: "16px", width: "95%", marginBottom: "0.6rem" }} />
    <div className="skeleton" style={{ height: "16px", width: "80%", marginBottom: "0.6rem" }} />
  </div>
);
