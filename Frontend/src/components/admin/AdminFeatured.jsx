import React from "react";
import { Star, ExternalLink, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const AdminFeatured = ({ posts = [], onToggleFeature }) => {
  const featuredPosts = posts.filter((p) => p.isFeatured);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Star color="#F59E0B" fill="#F59E0B" size={18} /> Featured Content Manager ({featuredPosts.length})
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "0.2rem 0 0 0" }}>
            Manage hero carousel and homepage featured highlight stories
          </p>
        </div>
      </div>

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "1.5rem",
          boxShadow: "var(--shadow-subtle)",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
              <th style={{ padding: "0.75rem" }}>Article</th>
              <th style={{ padding: "0.75rem" }}>Author</th>
              <th style={{ padding: "0.75rem" }}>Category</th>
              <th style={{ padding: "0.75rem" }}>Views</th>
              <th style={{ padding: "0.75rem", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {featuredPosts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                  No featured articles currently selected. Toggle the star on any post in the Posts tab to feature it on the homepage.
                </td>
              </tr>
            ) : (
              featuredPosts.map((p) => (
                <tr key={p._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "0.85rem 0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {p.featuredImage && (
                        <img src={p.featuredImage} alt={p.title} style={{ width: "42px", height: "34px", borderRadius: "6px", objectFit: "cover" }} />
                      )}
                      <span>{p.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: "0.85rem 0.75rem", color: "var(--text-secondary)" }}>
                    {p.author?.name || "Author"}
                  </td>
                  <td style={{ padding: "0.85rem 0.75rem" }}>
                    <span className="carrino-badge-pill" style={{ margin: 0, fontSize: "0.65rem" }}>
                      {p.category?.name || "General"}
                    </span>
                  </td>
                  <td style={{ padding: "0.85rem 0.75rem", fontWeight: 600 }}>{p.views || 0}</td>
                  <td style={{ padding: "0.85rem 0.75rem", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => onToggleFeature(p._id)}
                      className="btn-secondary"
                      style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem" }}
                    >
                      Remove Feature
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFeatured;
