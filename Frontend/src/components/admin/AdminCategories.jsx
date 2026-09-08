import React, { useState } from "react";
import { FolderTree, Plus, Trash2, Edit3, Image as ImageIcon, Check } from "lucide-react";
import { categoryApi } from "../../api/categoryTagApi";
import { toast } from "../../context/ToastContext";

const AdminCategories = ({ categories = [], onRefresh }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setSubmitting(true);
    try {
      await categoryApi.createCategory({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description,
        image,
      });
      toast.success("Category created successfully");
      setShowAddModal(false);
      setName("");
      setSlug("");
      setDescription("");
      setImage("");
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id, postCount) => {
    if (postCount > 0) {
      toast.warning(`Cannot delete category with ${postCount} active articles. Please reassign posts first.`);
      return;
    }
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoryApi.deleteCategory(id);
        toast.success("Category deleted");
        if (onRefresh) onRefresh();
      } catch (err) {
        toast.error(err.message || "Failed to delete category");
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
            Category Management ({categories.length})
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "0.2rem 0 0 0" }}>
            Organize platform topics and article taxonomy
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ padding: "0.5rem 1rem", fontSize: "0.82rem" }}
        >
          <Plus size={15} /> Add Category
        </button>
      </div>

      {/* CATEGORIES GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat._id}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            {cat.image ? (
              <div style={{ height: "130px", width: "100%", overflow: "hidden", position: "relative" }}>
                <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div
                style={{
                  height: "130px",
                  width: "100%",
                  background: "var(--bg-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                }}
              >
                <FolderTree size={32} />
              </div>
            )}

            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-heading)" }}>
                    {cat.name}
                  </h4>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>
                    {cat.postCount || cat.postsCount || 0} Articles
                  </span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.45 }}>
                  {cat.description || "No description provided."}
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-color)" }}>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat._id, cat.postCount || cat.postsCount || 0)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.3rem" }}
                  title="Delete Category"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
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
            onSubmit={handleCreateCategory}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              maxWidth: "460px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1.1rem",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Create New Category
            </h3>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Artificial Intelligence"
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

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of category topic..."
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  fontSize: "0.88rem",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                Image URL
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
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
                {submitting ? "Creating..." : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
