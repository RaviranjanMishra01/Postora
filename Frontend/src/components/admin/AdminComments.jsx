import React, { useState } from "react";
import { MessageSquare, Trash2, Search, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const AdminComments = ({ comments = [], onDeleteComment }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredComments = comments.filter((c) => {
    const content = c.content || c.text || "";
    const userName = c.user?.name || c.author?.name || "";
    return (
      content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* SEARCH BAR */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div style={{ position: "relative", width: "100%" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search comments by text content or user..."
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
      </div>

      {/* COMMENTS LIST TABLE */}
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
          Comment Moderation & Supervision ({filteredComments.length})
        </h3>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
              <th style={{ padding: "0.75rem" }}>Comment</th>
              <th style={{ padding: "0.75rem" }}>Author</th>
              <th style={{ padding: "0.75rem" }}>Post</th>
              <th style={{ padding: "0.75rem" }}>Date</th>
              <th style={{ padding: "0.75rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComments.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                  No comments found matching search.
                </td>
              </tr>
            ) : (
              filteredComments.map((c) => (
                <tr key={c._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "0.85rem 0.75rem", color: "var(--text-primary)", maxWidth: "320px", fontWeight: 500 }}>
                    "{c.content || c.text}"
                  </td>

                  <td style={{ padding: "0.85rem 0.75rem", color: "var(--text-secondary)" }}>
                    {c.user?.name || c.author?.name || "User"}
                  </td>

                  <td style={{ padding: "0.85rem 0.75rem", color: "var(--carrino-pink)", fontWeight: 600 }}>
                    {c.post?.title ? (
                      <Link to={`/post/${c.post.slug}`} style={{ color: "inherit" }}>
                        {c.post.title.slice(0, 30)}...
                      </Link>
                    ) : (
                      "Post"
                    )}
                  </td>

                  <td style={{ padding: "0.85rem 0.75rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    {new Date(c.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>

                  <td style={{ padding: "0.85rem 0.75rem", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => onDeleteComment(c._id)}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.3rem" }}
                      title="Delete Comment"
                    >
                      <Trash2 size={15} />
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

export default AdminComments;
