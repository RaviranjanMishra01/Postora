import React, { useState, useEffect } from "react";
import { MessageSquare, Heart, CornerDownRight, Flag, Send, Trash2, SlidersHorizontal } from "lucide-react";
import { commentApi } from "../api/commentInteractionApi";
import { useAuth } from "../context/AuthContext";
import ReportModal from "./ReportModal";
import { toast } from "../context/ToastContext";

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "recently";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

const defaultAvatar =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80";

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [replyToId, setReplyToId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [reportTarget, setReportTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("relevant"); // relevant | newest | oldest
  const [isFocused, setIsFocused] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await commentApi.getPostComments(postId);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
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
        content: commentText.trim(),
        parentComment: parentId,
      });
      toast.success(parentId ? "Reply posted!" : "Response published!");
      if (parentId) {
        setReplyToId(null);
        setReplyContent("");
      } else {
        setContent("");
        setIsFocused(false);
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

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await commentApi.deleteComment(commentId);
      toast.success("Comment deleted");
      fetchComments();
    } catch (err) {
      toast.error(err.message || "Failed to delete comment");
    }
  };

  // Sort comments
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    // Relevant: most likes first, then newest
    return (b.likesCount || 0) - (a.likesCount || 0) || new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <section className="discussion-section">
      {/* Discussion Header */}
      <div className="discussion-header-row">
        <div>
          <h3 className="discussion-title">
            COMMENTS ({comments.length})
          </h3>
          <p className="discussion-subtitle">Join the conversation</p>
        </div>

        {comments.length > 1 && (
          <div className="discussion-sort-wrapper">
            <SlidersHorizontal size={13} style={{ color: "var(--text-muted)" }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="discussion-sort-select"
            >
              <option value="relevant">Most relevant</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        )}
      </div>

      {/* Modern Editorial Composer */}
      {user ? (
        <form
          onSubmit={(e) => handleCreateComment(e, null)}
          className={`comment-composer-card ${isFocused ? "is-focused" : ""}`}
        >
          <div className="composer-row">
            <img
              src={user.avatar || defaultAvatar}
              alt={user.name}
              className="composer-avatar"
            />
            <div className="composer-input-area">
              <textarea
                rows={isFocused || content ? 3 : 2}
                value={content}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What are your thoughts? Write a thoughtful response..."
                className="composer-textarea"
                maxLength={1000}
              />

              {(isFocused || content) && (
                <div className="composer-actions-bar">
                  <span className="char-counter">
                    {content.length} / 1000
                  </span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setContent("");
                        setIsFocused(false);
                      }}
                      className="btn-cancel-composer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !content.trim()}
                      className="btn-publish-comment"
                    >
                      <Send size={13} /> Post Comment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div className="comment-login-notice">
          <p>
            Please <span style={{ fontWeight: 700, color: "var(--accent-primary, #FF497C)" }}>log in</span> to join the conversation and publish a response.
          </p>
        </div>
      )}

      {/* Comment List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="empty-discussion-state">
            <MessageSquare size={26} className="empty-disc-icon" />
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.25rem 0", color: "var(--text-primary)" }}>
              No comments yet
            </h4>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
              Be the first to share your thoughts on this article.
            </p>
          </div>
        ) : (
          sortedComments.map((comment) => {
            const commentUser = comment.user || {};
            const isOwner = user && commentUser._id === user._id;

            return (
              <div key={comment._id} className="comment-item-card">
                <div className="comment-main-row">
                  <img
                    src={commentUser.avatar || defaultAvatar}
                    alt={commentUser.name || "User"}
                    className="comment-user-avatar"
                  />
                  <div className="comment-content-block">
                    <div className="comment-author-header">
                      <div>
                        <span className="comment-author-name">{commentUser.name || "Anonymous"}</span>
                        {commentUser.username && (
                          <span className="comment-author-handle"> @{commentUser.username}</span>
                        )}
                        <span className="comment-time"> · {formatTimeAgo(comment.createdAt)}</span>
                      </div>

                      <div className="comment-more-actions">
                        {isOwner && (
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(comment._id)}
                            className="comment-action-icon-btn delete-btn"
                            title="Delete comment"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setReportTarget(comment._id)}
                          className="comment-action-icon-btn"
                          title="Report comment"
                        >
                          <Flag size={13} />
                        </button>
                      </div>
                    </div>

                    <p className="comment-text-body">{comment.content}</p>

                    <div className="comment-footer-actions">
                      <button
                        type="button"
                        onClick={() => handleLike(comment._id)}
                        className={`btn-comment-like ${comment.likesCount > 0 ? "has-likes" : ""}`}
                      >
                        <Heart
                          size={14}
                          fill={comment.likesCount > 0 ? "var(--accent-primary, #FF497C)" : "none"}
                          color={comment.likesCount > 0 ? "var(--accent-primary, #FF497C)" : "currentColor"}
                        />
                        <span>{comment.likesCount || 0}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReplyToId(replyToId === comment._id ? null : comment._id)}
                        className="btn-comment-reply"
                      >
                        <CornerDownRight size={13} /> Reply
                      </button>
                    </div>

                    {/* Inline Reply Composer */}
                    {replyToId === comment._id && (
                      <form
                        onSubmit={(e) => handleCreateComment(e, comment._id)}
                        className="reply-composer-form"
                      >
                        <textarea
                          rows={2}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={`Replying to ${commentUser.name || "author"}...`}
                          className="reply-textarea"
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setReplyToId(null);
                              setReplyContent("");
                            }}
                            className="btn-cancel-composer"
                          >
                            Cancel
                          </button>
                          <button type="submit" disabled={!replyContent.trim()} className="btn-publish-comment">
                            <Send size={12} /> Reply
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="nested-replies-list">
                        {comment.replies.map((reply) => {
                          const replyUser = reply.user || {};
                          return (
                            <div key={reply._id} className="nested-reply-item">
                              <img
                                src={replyUser.avatar || defaultAvatar}
                                alt={replyUser.name || "User"}
                                className="reply-avatar"
                              />
                              <div style={{ flexGrow: 1 }}>
                                <div className="reply-author-meta">
                                  <span className="reply-author-name">{replyUser.name || "Anonymous"}</span>
                                  {replyUser.username && (
                                    <span className="reply-author-handle"> @{replyUser.username}</span>
                                  )}
                                  <span className="reply-time"> · {formatTimeAgo(reply.createdAt)}</span>
                                </div>
                                <p className="reply-text-body">{reply.content}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ReportModal
        isOpen={!!reportTarget}
        onClose={() => setReportTarget(null)}
        targetType="comment"
        targetId={reportTarget}
      />

      <style>{`
        .discussion-section {
          margin-top: 2.25rem;
          padding-top: 0;
          border-top: none;
        }

        .discussion-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1.75rem;
        }

        .discussion-title {
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--brand-slate-blue, #547792);
          text-transform: uppercase;
          margin: 0 0 0.2rem 0;
        }

        .discussion-subtitle {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary, #213448);
          margin: 0;
          font-family: var(--font-heading);
        }

        .discussion-sort-wrapper {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: var(--bg-secondary, #F9F8F6);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 6px;
          padding: 0.25rem 0.5rem;
        }

        .discussion-sort-select {
          background: transparent;
          border: none;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-secondary, #547792);
          outline: none;
          cursor: pointer;
        }

        /* Composer Card */
        .comment-composer-card {
          background: var(--bg-card, #FFFFFF);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 2.25rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .comment-composer-card.is-focused {
          border-color: var(--accent-primary, #FF497C);
          box-shadow: 0 0 0 3px rgba(255, 73, 124, 0.1);
        }

        .composer-row {
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
        }

        .composer-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .composer-input-area {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .composer-textarea {
          width: 100%;
          border: none;
          background: transparent;
          color: var(--text-primary, #213448);
          font-size: 0.92rem;
          font-family: var(--font-body);
          outline: none;
          resize: vertical;
          line-height: 1.5;
        }

        .composer-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.65rem;
          border-top: 1px solid var(--border-color, #EFE9E3);
          margin-top: 0.5rem;
        }

        .char-counter {
          font-size: 0.72rem;
          color: var(--text-muted, #94B4C1);
        }

        .btn-cancel-composer {
          padding: 0.35rem 0.75rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .btn-publish-comment {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.95rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: #FFFFFF;
          background: var(--accent-primary, #FF497C);
          border: none;
          border-radius: 7px;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }

        .btn-publish-comment:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .comment-login-notice {
          padding: 1.25rem;
          text-align: center;
          background: var(--bg-secondary, #F9F8F6);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 10px;
          margin-bottom: 2.25rem;
          font-size: 0.88rem;
          color: var(--text-secondary);
        }

        /* Comments List */
        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .comment-item-card {
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-color, #EFE9E3);
        }

        .comment-item-card:last-child {
          border-bottom: none;
        }

        .comment-main-row {
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
        }

        .comment-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .comment-content-block {
          flex-grow: 1;
          min-width: 0;
        }

        .comment-author-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.35rem;
        }

        .comment-author-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary, #213448);
        }

        .comment-author-handle {
          font-size: 0.78rem;
          color: var(--text-muted, #94B4C1);
        }

        .comment-time {
          font-size: 0.76rem;
          color: var(--text-muted, #94B4C1);
        }

        .comment-more-actions {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .comment-action-icon-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          border-radius: 4px;
          transition: color 0.15s ease;
        }

        .comment-action-icon-btn:hover {
          color: var(--text-primary);
        }

        .comment-action-icon-btn.delete-btn:hover {
          color: #ef4444;
        }

        .comment-text-body {
          font-size: 0.92rem;
          line-height: 1.55;
          color: var(--text-primary, #213448);
          margin: 0 0 0.6rem 0;
          white-space: pre-line;
        }

        .comment-footer-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.78rem;
        }

        .btn-comment-like {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-weight: 600;
          padding: 0;
        }

        .btn-comment-like.has-likes {
          color: var(--accent-primary, #FF497C);
        }

        .btn-comment-reply {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 600;
          padding: 0;
        }

        .btn-comment-reply:hover {
          color: var(--brand-slate-blue);
        }

        /* Reply Composer */
        .reply-composer-form {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: var(--bg-secondary, #F9F8F6);
          border-left: 3px solid var(--accent-primary, #FF497C);
          border-radius: 0 8px 8px 0;
        }

        .reply-textarea {
          width: 100%;
          padding: 0.5rem;
          font-size: 0.85rem;
          background: var(--bg-primary, #FFFFFF);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 6px;
          color: var(--text-primary);
          outline: none;
          margin-bottom: 0.5rem;
          resize: vertical;
        }

        /* Nested Replies */
        .nested-replies-list {
          margin-top: 0.85rem;
          padding-left: 1rem;
          border-left: 2px solid var(--border-color, #EFE9E3);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .nested-reply-item {
          display: flex;
          gap: 0.65rem;
          align-items: flex-start;
        }

        .reply-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .reply-author-meta {
          margin-bottom: 0.15rem;
        }

        .reply-author-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .reply-author-handle {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .reply-time {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .reply-text-body {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.45;
        }

        .empty-discussion-state {
          text-align: center;
          padding: 2.5rem 1rem;
          background: var(--bg-secondary, #F9F8F6);
          border: 1px dashed var(--border-color, #EFE9E3);
          border-radius: 12px;
        }

        .empty-disc-icon {
          color: var(--text-muted);
          opacity: 0.5;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </section>
  );
};

export default CommentSection;
