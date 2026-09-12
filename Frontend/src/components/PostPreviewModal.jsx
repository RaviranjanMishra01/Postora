import React from "react";
import { X, Calendar, User, Tag as TagIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const PostPreviewModal = ({
  isOpen,
  onClose,
  title,
  excerpt,
  content,
  category,
  categories = [],
  selectedTags = [],
  allTags = [],
  featuredImage,
  imageFile,
}) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  // Determine display image URL
  const previewImageUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : featuredImage || null;

  // Determine category display name
  let categoryName = "Uncategorized";
  if (typeof category === "string" && category.trim()) {
    const catObj = categories.find((c) => c._id === category || c.slug === category);
    categoryName = catObj ? catObj.name : category.trim();
  } else if (category && typeof category === "object") {
    categoryName = category.name || "Uncategorized";
  }

  // Determine active topic names
  const activeTopicNames = selectedTags.map((t) => {
    if (typeof t === "string") {
      const foundTag = allTags.find((tag) => tag._id === t);
      return foundTag ? foundTag.name : t;
    }
    return t.name || String(t);
  });

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "var(--bg-card, #FFFFFF)",
          color: "var(--text-primary, #0F172A)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "840px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          border: "1px solid var(--border-color, #E2E8F0)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 1.75rem",
            borderBottom: "1px solid var(--border-color, #E2E8F0)",
            position: "sticky",
            top: 0,
            backgroundColor: "var(--bg-card, #FFFFFF)",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--Postora-pink, #FF3F7F)",
                backgroundColor: "rgba(255, 63, 127, 0.1)",
                padding: "0.25rem 0.6rem",
                borderRadius: "6px",
              }}
            >
              Live Preview
            </span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted, #94A3B8)" }}>
              How your post will appear to readers
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted, #94A3B8)",
              padding: "6px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 150ms ease",
            }}
            aria-label="Close preview"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content Body */}
        <div style={{ padding: "2rem 2.5rem" }}>
          {/* Category Pill */}
          <div style={{ marginBottom: "1rem" }}>
            <span
              style={{
                display: "inline-block",
                backgroundColor: "var(--Postora-pink, #FF3F7F)",
                color: "#FFFFFF",
                fontSize: "0.72rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "0.3rem 0.75rem",
                borderRadius: "6px",
              }}
            >
              {categoryName}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2.25rem",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "var(--text-primary, #0F172A)",
              marginBottom: "1rem",
            }}
          >
            {title || "Untitled Post"}
          </h1>

          {/* Excerpt / Subtitle */}
          {excerpt && (
            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary, #475569)",
                lineHeight: 1.55,
                marginBottom: "1.5rem",
              }}
            >
              {excerpt}
            </p>
          )}

          {/* Author Meta Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              paddingBottom: "1.5rem",
              marginBottom: "2rem",
              borderBottom: "1px solid var(--border-color, #E2E8F0)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 63, 127, 0.15)",
                color: "var(--Postora-pink, #FF3F7F)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
            </div>

            <div>
              <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--text-primary, #0F172A)" }}>
                {user?.name || "Author Name"}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted, #94A3B8)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Calendar size={13} /> {formattedDate}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {previewImageUrl && (
            <div style={{ marginBottom: "2rem", borderRadius: "14px", overflow: "hidden", maxHeight: "420px" }}>
              <img
                src={previewImageUrl}
                alt="Cover Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          )}

          {/* Formatted Content Area (if legacy content exists) */}
          {content ? (
            <div
              className="preview-formatted-content"
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.75,
                color: "var(--text-primary, #0F172A)",
                marginBottom: "2.5rem",
              }}
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          ) : null}

          {/* Topics / Tags */}
          {activeTopicNames.length > 0 && (
            <div style={{ paddingTop: "1.5rem", borderTop: "1px solid var(--border-color, #E2E8F0)", display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <TagIcon size={16} color="var(--text-muted, #94A3B8)" />
              {activeTopicNames.map((tagName, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: "var(--bg-secondary, #F1F5F9)",
                    color: "var(--text-secondary, #475569)",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    padding: "0.3rem 0.7rem",
                    borderRadius: "8px",
                  }}
                >
                  {tagName}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPreviewModal;
