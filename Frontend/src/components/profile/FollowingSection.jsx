import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserCheck, UserPlus, Users, X } from "lucide-react";
import { followApi } from "../../api/commentInteractionApi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "../../context/ToastContext";

const FollowingSection = ({ following = [], onFollowToggleSuccess }) => {
  const { user } = useAuth();
  const [showAllModal, setShowAllModal] = useState(false);
  const [followingMap, setFollowingMap] = useState({});

  const displayList = following.slice(0, 5);

  const handleFollowToggle = async (targetUser) => {
    if (!user) {
      toast.info("Please log in to follow users");
      return;
    }
    try {
      const res = await followApi.toggleFollow(targetUser._id);
      setFollowingMap((prev) => ({
        ...prev,
        [targetUser._id]: res.data.isFollowing,
      }));
      toast.success(res.message);
      if (onFollowToggleSuccess) onFollowToggleSuccess(targetUser._id, res.data.isFollowing);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to toggle follow status");
    }
  };

  const defaultAvatar =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.5rem",
        borderRadius: "var(--radius-lg, 16px)",
        background: "var(--bg-card, #1e293b)",
        border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Users size={18} color="var(--accent-primary, #ec4899)" />
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "var(--text-primary, #f8fafc)",
            }}
          >
            Following ({following.length})
          </h3>
        </div>

        {following.length > 5 && (
          <button
            type="button"
            onClick={() => setShowAllModal(true)}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-primary, #ec4899)",
              fontSize: "0.82rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            View all
          </button>
        )}
      </div>

      {following.length === 0 ? (
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted, #94a3b8)",
            fontStyle: "italic",
            margin: "0.5rem 0",
          }}
        >
          Not following any authors yet.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", flexGrow: 1 }}>
          {displayList.map((item) => {
            const isCurrentlyFollowing =
              followingMap[item._id] !== undefined ? followingMap[item._id] : true;

            return (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                }}
              >
                <Link
                  to={`/author/${item.username}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    textDecoration: "none",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={item.avatar || defaultAvatar}
                    alt={item.name}
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ overflow: "hidden" }}>
                    <h4
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        color: "var(--text-primary, #f8fafc)",
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.name}
                    </h4>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-muted, #94a3b8)",
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      @{item.username}
                    </p>
                  </div>
                </Link>

                {user && user._id !== item._id && (
                  <button
                    type="button"
                    onClick={() => handleFollowToggle(item)}
                    style={{
                      padding: "0.35rem 0.65rem",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      borderRadius: "6px",
                      background: isCurrentlyFollowing
                        ? "rgba(255, 255, 255, 0.08)"
                        : "var(--accent-primary, #ec4899)",
                      color: isCurrentlyFollowing ? "#94a3b8" : "#ffffff",
                      border: "1px solid var(--border-color, rgba(255,255,255,0.1))",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      flexShrink: 0,
                    }}
                  >
                    {isCurrentlyFollowing ? <UserCheck size={13} /> : <UserPlus size={13} />}
                    <span>{isCurrentlyFollowing ? "Following" : "Follow"}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* View All Modal */}
      {showAllModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setShowAllModal(false)}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "460px",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "1.75rem",
              background: "var(--bg-card, #1e293b)",
              borderRadius: "var(--radius-lg, 16px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
                borderBottom: "1px solid var(--border-color, rgba(255,255,255,0.1))",
                paddingBottom: "0.75rem",
              }}
            >
              <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary, #fff)", margin: 0 }}>
                Following ({following.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowAllModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {following.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Link
                    to={`/author/${item.username}`}
                    onClick={() => setShowAllModal(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      textDecoration: "none",
                    }}
                  >
                    <img
                      src={item.avatar || defaultAvatar}
                      alt={item.name}
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <h4
                        style={{
                          fontSize: "0.92rem",
                          fontWeight: 700,
                          color: "var(--text-primary, #fff)",
                          margin: 0,
                        }}
                      >
                        {item.name}
                      </h4>
                      <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: 0 }}>
                        @{item.username}
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleFollowToggle(item)}
                    className="btn-secondary"
                    style={{ padding: "0.4rem 0.75rem", fontSize: "0.78rem" }}
                  >
                    Following
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowingSection;
