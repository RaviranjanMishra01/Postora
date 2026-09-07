import React from "react";
import { Link } from "react-router-dom";
import { FileText, Eye, Heart, Edit3, Plus } from "lucide-react";

const MyPostsPreview = ({ posts = [], loading = false }) => {
  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        padding: "1.75rem",
        marginBottom: "2rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FileText size={18} color="#FF497C" /> My Published Stories
        </h3>

        <Link to="/create-post" className="btn-primary" style={{ padding: "0.4rem 0.85rem", fontSize: "0.75rem" }}>
          <Plus size={13} /> Create Story
        </Link>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div className="skeleton" style={{ height: "40px" }} />
          <div className="skeleton" style={{ height: "40px" }} />
        </div>
      ) : posts.length === 0 ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.88rem" }}>
          <p style={{ color: "var(--text-secondary)", fontWeight: 600, marginBottom: "0.5rem" }}>You haven't published any articles yet.</p>
          <Link to="/create-post" className="btn-primary" style={{ padding: "0.45rem 1rem", fontSize: "0.8rem" }}>
            Write Your First Article
          </Link>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase" }}>
                <th style={{ padding: "0.6rem 0.5rem" }}>Title</th>
                <th style={{ padding: "0.6rem 0.5rem" }}>Views</th>
                <th style={{ padding: "0.6rem 0.5rem" }}>Likes</th>
                <th style={{ padding: "0.6rem 0.5rem" }}>Date</th>
                <th style={{ padding: "0.6rem 0.5rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const formattedDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "";

                return (
                  <tr key={post._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "0.75rem 0.5rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      <Link to={`/post/${post.slug}`} style={{ color: "inherit" }}>
                        {post.title}
                      </Link>
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", color: "var(--text-secondary)" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                        <Eye size={12} /> {post.views || 0}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", color: "var(--text-secondary)" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                        <Heart size={12} color="#FF497C" /> {post.likesCount || 0}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                      {formattedDate}
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", textAlign: "right" }}>
                      <Link
                        to={`/edit-post/${post._id}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.2rem",
                          color: "#FF497C",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                        }}
                      >
                        <Edit3 size={13} /> Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyPostsPreview;
