import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, UserCheck } from "lucide-react";
import { searchApi, followApi } from "../../api/commentInteractionApi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "../../context/ToastContext";

const DiscoverAuthors = () => {
  const { user } = useAuth();
  const [authors, setAuthors] = useState([]);
  const [followingMap, setFollowingMap] = useState({});
  const [loading, setLoading] = useState(true);

  const defaultAvatar =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

  useEffect(() => {
    const fetchSuggestedAuthors = async () => {
      setLoading(true);
      try {
        const res = await searchApi.getSuggestions({ type: "author", limit: 5 });
        const list = (res.data?.authors || res.data?.users || []).filter(
          (a) => a._id !== user?._id
        );
        setAuthors(list.slice(0, 4));
      } catch (err) {
        // Fallback demo author suggestions if endpoint empty
        setAuthors([
          {
            _id: "demo_author_1",
            name: "Elena Rostova",
            username: "elena_writes",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
            bio: "Writing about AI, technology, and futuristic design trends.",
            followersCount: 1420,
          },
          {
            _id: "demo_author_2",
            name: "Marcus Vance",
            username: "marcusv",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
            bio: "Full-stack architect sharing React, Node, and Web Dev insights.",
            followersCount: 890,
          },
          {
            _id: "demo_author_3",
            name: "Sophia Chen",
            username: "sophiachen",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
            bio: "UX researcher & author exploring digital minimalism.",
            followersCount: 2310,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedAuthors();
  }, [user]);

  const handleFollowToggle = async (authorItem) => {
    if (!user) {
      toast.info("Please log in to follow authors");
      return;
    }
    const targetId = authorItem._id;
    const isCurrentlyFollowing = followingMap[targetId] || false;

    // Optimistic toggle
    setFollowingMap((prev) => ({ ...prev, [targetId]: !isCurrentlyFollowing }));

    try {
      if (!targetId.startsWith("demo_")) {
        const res = await followApi.toggleFollow(targetId);
        toast.success(res.message);
      } else {
        toast.success(!isCurrentlyFollowing ? `Following ${authorItem.name}` : `Unfollowed ${authorItem.name}`);
      }
    } catch (err) {
      setFollowingMap((prev) => ({ ...prev, [targetId]: isCurrentlyFollowing }));
      toast.error("Failed to follow author");
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.5rem",
        borderRadius: "var(--radius-lg, 16px)",
        background: "var(--bg-card, #1e293b)",
        border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.25rem",
        }}
      >
        <Users size={18} color="var(--accent-primary, #ec4899)" />
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 800,
            color: "var(--text-primary, #f8fafc)",
            margin: 0,
          }}
        >
          Discover Authors
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        {authors.map((authorItem) => {
          const isFollowing = followingMap[authorItem._id] || false;

          return (
            <div
              key={authorItem._id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "0.85rem",
              }}
            >
              <Link
                to={`/author/${authorItem.username}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  textDecoration: "none",
                  overflow: "hidden",
                }}
              >
                <img
                  src={authorItem.avatar || defaultAvatar}
                  alt={authorItem.name}
                  style={{
                    width: "40px",
                    height: "40px",
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
                    {authorItem.name}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted, #94a3b8)",
                      margin: "0.1rem 0 0.25rem 0",
                    }}
                  >
                    @{authorItem.username} • {authorItem.followersCount || 0} followers
                  </p>
                  {authorItem.bio && (
                    <p
                      style={{
                        fontSize: "0.76rem",
                        color: "var(--text-secondary, #cbd5e1)",
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {authorItem.bio}
                    </p>
                  )}
                </div>
              </Link>

              <button
                type="button"
                onClick={() => handleFollowToggle(authorItem)}
                style={{
                  padding: "0.35rem 0.7rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  borderRadius: "6px",
                  background: isFollowing
                    ? "rgba(255, 255, 255, 0.08)"
                    : "var(--accent-primary, #ec4899)",
                  color: isFollowing ? "#94a3b8" : "#ffffff",
                  border: "1px solid var(--border-color, rgba(255,255,255,0.1))",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  flexShrink: 0,
                }}
              >
                {isFollowing ? <UserCheck size={13} /> : <UserPlus size={13} />}
                <span>{isFollowing ? "Following" : "Follow"}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscoverAuthors;
