import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star, ExternalLink, Edit3, Trash2, CheckCircle2, Clock } from "lucide-react";

const AdminPosts = ({ posts, onToggleFeature, onDeletePost }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPosts = posts.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || p.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === "featured") return matchesSearch && p.isFeatured;
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && p.status === statusFilter;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* SEARCH & STATUS TABS */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div style={{ position: "relative", minWidth: "260px", flexGrow: 1 }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search posts by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 1rem 0.6rem 2.4rem",
              borderRadius: "8px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontSize: "0.88rem",
              outline: "none",
            }}
          />
        </div>

        {/* Filter Buttons */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {["all", "published", "draft", "featured"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={statusFilter === st ? "btn-primary" : "btn-secondary"}
              style={{
                padding: "0.45rem 0.85rem",
                fontSize: "0.8rem",
                textTransform: "capitalize",
                borderRadius: "8px",
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* POSTS TABLE */}
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
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 1.25rem 0", fontFamily: "var(--font-heading)" }}>
          Article Content Moderation ({filteredPosts.length})
        </h3>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
              <th style={{ padding: "0.75rem" }}>Article</th>
              <th style={{ padding: "0.75rem" }}>Author</th>
              <th style={{ padding: "0.75rem" }}>Category</th>
              <th style={{ padding: "0.75rem" }}>Status</th>
              <th style={{ padding: "0.75rem" }}>Views</th>
              <th style={{ padding: "0.75rem" }}>Featured</th>
              <th style={{ padding: "0.75rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                  No articles found matching filters.
                </td>
              </tr>
            ) : (
              filteredPosts.map((p) => (
                <tr key={p._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "0.85rem 0.75rem", fontWeight: 700, color: "var(--text-primary)", maxWidth: "240px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {p.featuredImage && (
                        <img
                          src={p.featuredImage}
                          alt={p.title}
                          style={{ width: "42px", height: "34px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }}
                        />
                      )}
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</span>
                    </div>
                  </td>

                  <td style={{ padding: "0.85rem 0.75rem", color: "var(--text-secondary)" }}>
                    {p.author?.name || "Unknown"}
                  </td>

                  <td style={{ padding: "0.85rem 0.75rem" }}>
                    <span className="carrino-badge-pill" style={{ margin: 0, fontSize: "0.65rem" }}>
                      {p.category?.name || "General"}
                    </span>
                  </td>

                  <td style={{ padding: "0.85rem 0.75rem" }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                        background: p.status === "published" ? "rgba(25, 184, 138, 0.15)" : "var(--bg-secondary)",
                        color: p.status === "published" ? "var(--accent-green)" : "var(--text-muted)",
                      }}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td style={{ padding: "0.85rem 0.75rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    {p.views || 0}
                  </td>

                  <td style={{ padding: "0.85rem 0.75rem" }}>
                    <button
                      type="button"
                      onClick={() => onToggleFeature(p._id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: p.isFeatured ? "#F59E0B" : "var(--text-muted)" }}
                      title="Toggle Featured"
                    >
                      <Star size={18} fill={p.isFeatured ? "#F59E0B" : "none"} />
                    </button>
                  </td>

                  <td style={{ padding: "0.85rem 0.75rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <Link to={`/post/${p.slug}`} className="btn-secondary" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }} title="View Post">
                        <ExternalLink size={13} />
                      </Link>
                      <Link to={`/edit-post/${p._id}`} className="btn-secondary" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }} title="Edit Post">
                        <Edit3 size={13} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDeletePost(p._id)}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.3rem" }}
                        title="Delete Post"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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

export default AdminPosts;
