import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserPlus, UserCheck, Globe, MapPin } from "lucide-react";
import { authApi } from "../api/authApi";
import { followApi } from "../api/commentInteractionApi";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import { CardSkeleton } from "../components/SkeletonLoader";
import { toast } from "react-toastify";

const AuthorProfile = () => {
  const { username } = useParams();
  const { user } = useAuth();

  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true);
      try {
        const res = await authApi.getPublicAuthor(username);
        setAuthor(res.data.author);
        setPosts(res.data.posts || []);
        setIsFollowing(res.data.isFollowing || false);
        setFollowersCount(res.data.author.followersCount || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchAuthor();
  }, [username]);

  const handleFollowToggle = async () => {
    if (!user) {
      toast.info("Please log in to follow authors");
      return;
    }
    try {
      const res = await followApi.toggleFollow(author._id);
      setIsFollowing(res.data.isFollowing);
      setFollowersCount((prev) => (res.data.isFollowing ? prev + 1 : prev - 1));
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="container" style={{ paddingTop: "3rem" }}><CardSkeleton /></div>;
  if (!author) return <div style={{ textAlign: "center", padding: "5rem", color: "#fff" }}>Author not found</div>;

  return (
    <div className="container" style={{ paddingTop: "2.5rem" }}>
      {/* Author Card Banner */}
      <div className="glass-card" style={{ padding: "2.5rem", marginBottom: "3rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <img
              src={author.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
              alt={author.name}
              style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: "3px solid var(--accent-primary)" }}
            />
            <div>
              <h1 style={{ fontSize: "1.8rem" }}>{author.name}</h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>@{author.username} • {author.role}</p>

              {author.location && (
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.25rem" }}>
                  <MapPin size={14} /> {author.location}
                </span>
              )}
            </div>
          </div>

          {user && user._id !== author._id && (
            <button onClick={handleFollowToggle} className={isFollowing ? "btn-secondary" : "btn-primary"}>
              {isFollowing ? <><UserCheck size={16} /> Following</> : <><UserPlus size={16} /> Follow Author</>}
            </button>
          )}
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6 }}>
          {author.bio || "No biography provided yet."}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
          <div style={{ display: "flex", gap: "2rem", fontSize: "0.95rem" }}>
            <span><strong>{posts.length}</strong> Published Posts</span>
            <span><strong>{followersCount}</strong> Followers</span>
            <span><strong>{author.followingCount || 0}</strong> Following</span>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", color: "var(--text-secondary)" }}>
            {author.website && <a href={author.website} target="_blank" rel="noreferrer"><Globe size={18} /></a>}
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: "1.35rem", marginBottom: "1.5rem" }}>Published Articles ({posts.length})</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default AuthorProfile;
