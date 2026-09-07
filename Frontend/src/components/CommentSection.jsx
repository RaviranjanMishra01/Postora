import React, { useState, useEffect } from "react";
import { MessageSquare, Heart, CornerDownRight, Flag, Send } from "lucide-react";
import { commentApi } from "../api/commentInteractionApi";
import { useAuth } from "../context/AuthContext";
import ReportModal from "./ReportModal";
import { toast } from "react-toastify";

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [replyToId, setReplyToId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [reportTarget, setReportTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await commentApi.getPostComments(postId);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const handleCreateComment = async (e, parentId = null) => {
    e.preventDefault();
    const commentText = parentId ? replyContent : content;
    if (!commentText.trim()) return;

    if (!user) {
      toast.info("Please log in to leave a comment");
      return;
    }

    setLoading(true);
    try {
      await commentApi.createComment({
        post: postId,
        content: commentText,
        parentComment: parentId,
      });
      toast.success(parentId ? "Reply posted!" : "Comment posted!");
      if (parentId) {
        setReplyToId(null);
        setReplyContent("");
      } else {
        setContent("");
      }
      fetchComments();
    } catch (err) {
      toast.error(err.message || "Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId) => {
    if (!user) {
      toast.info("Please log in to like comments");
      return;
    }
    try {
      await commentApi.likeComment(commentId);
      fetchComments();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{ marginTop: "3.5rem", paddingTop: "2.5rem", borderTop: "1px solid var(--border-color)" }}>
      <h3 style={{ fontSize: "1.35rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--text-primary)" }}>
        <MessageSquare size={22} /> Discussion ({comments.length})
      </h3>

      {/* Main Comment Form */}
      {user ? (
        <form onSubmit={(e) => handleCreateComment(e, null)} style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <img
              src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
              alt={user.name}
              style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
            />
            <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What are your thoughts on this article?"
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  outline: "none",
                  resize: "vertical",
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn-primary" disabled={loading} style={{ padding: "0.5rem 1.25rem" }}>
                  <Send size={15} /> Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Please log in to join the conversation and leave a comment.
          </p>
        </div>
      )}

      {/* Comment List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {comments.map((comment) => (
          <div key={comment._id} className="glass-card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <img
                  src={comment.user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                  alt={comment.user?.name}
                  style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <h4 style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>{comment.user?.name || "Anonymous"}</h4>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setReportTarget(comment._id)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                title="Report Comment"
              >
                <Flag size={14} />
              </button>
            </div>

            <p style={{ margin: "0.85rem 0", color: "var(--text-primary)", fontSize: "0.92rem", lineHeight: 1.5 }}>
              {comment.content}
            </p>

            <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              <button
                onClick={() => handleLike(comment._id)}
                style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}
              >
                <Heart size={14} fill="var(--brand-slate-blue)" color="var(--brand-slate-blue)" /> {comment.likesCount || 0}
              </button>

              <button
                onClick={() => setReplyToId(replyToId === comment._id ? null : comment._id)}
                style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}
              >
                <CornerDownRight size={14} /> Reply
              </button>
            </div>

            {/* Inline Reply Form */}
            {replyToId === comment._id && (
              <form onSubmit={(e) => handleCreateComment(e, comment._id)} style={{ marginTop: "1rem", paddingLeft: "1rem", borderLeft: "2px solid var(--accent-primary)" }}>
                <textarea
                  rows={2}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Replying to ${comment.user?.name}...`}
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    marginBottom: "0.5rem",
                  }}
                />
                <button type="submit" className="btn-primary" style={{ padding: "0.35rem 0.85rem", fontSize: "0.8rem" }}>
                  Submit Reply
                </button>
              </form>
            )}

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div style={{ marginTop: "1rem", paddingLeft: "1.5rem", borderLeft: "2px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {comment.replies.map((reply) => (
                  <div key={reply._id} style={{ background: "var(--bg-secondary)", padding: "0.85rem", borderRadius: "var(--radius-md)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
                      <img
                        src={reply.user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                        alt={reply.user?.name}
                        style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>{reply.user?.name}</span>
                    </div>
                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <ReportModal
        isOpen={!!reportTarget}
        onClose={() => setReportTarget(null)}
        targetType="comment"
        targetId={reportTarget}
      />
    </div>
  );
};

export default CommentSection;
