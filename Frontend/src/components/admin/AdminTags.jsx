import React, { useState } from "react";
import { Tag as TagIcon, Plus, Trash2 } from "lucide-react";
import { tagApi } from "../../api/categoryTagApi";
import { toast } from "../../context/ToastContext";

const AdminTags = ({ tags = [], onRefresh }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await tagApi.createTag({ name });
      toast.success("Tag created successfully");
      setShowAddModal(false);
      setName("");
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || "Failed to create tag");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTag = async (id) => {
    if (window.confirm("Delete this tag?")) {
      try {
        await tagApi.deleteTag(id);
        toast.success("Tag deleted");
        if (onRefresh) onRefresh();
      } catch (err) {
        toast.error(err.message || "Failed to delete tag");
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* HEADER BAR */}
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
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-heading)" }}>
            Tag Taxonomy Management ({tags.length})
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "0.2rem 0 0 0" }}>
            Manage platform tags and story topic associations
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ padding: "0.5rem 1rem", fontSize: "0.82rem" }}
        >
          <Plus size={15} /> Add Tag
        </button>
      </div>

      {/* TAGS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {tags.map((t) => (
          <div
            key={t._id}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <TagIcon size={16} color="var(--Postora-pink)" />
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  #{t.name}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  {t.postCount || 0} stories
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleDeleteTag(t._id)}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.2rem" }}
              title="Delete Tag"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* CREATE TAG MODAL */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <form
            onSubmit={handleCreateTag}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "1.75rem 2rem",
              maxWidth: "380px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1.1rem",
            }}
          >
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Create New Tag
            </h3>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                Tag Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. MERN Stack"
                required
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  fontSize: "0.88rem",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : "Create Tag"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminTags;
