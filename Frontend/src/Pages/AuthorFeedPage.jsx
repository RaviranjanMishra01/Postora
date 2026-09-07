import React, { useState, useEffect } from "react";
import { Rss } from "lucide-react";
import { followApi } from "../api/commentInteractionApi";
import PostCard from "../components/PostCard";
import { CardSkeleton } from "../components/SkeletonLoader";

const AuthorFeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const res = await followApi.getAuthorFeed();
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  return (
    <div className="container" style={{ paddingTop: "2.5rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <Rss className="gradient-text" size={26} /> Following Feed
      </h1>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          <CardSkeleton /><CardSkeleton />
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-secondary)" }}>
          <Rss size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
          <h3>Your feed is quiet</h3>
          <p style={{ marginTop: "0.5rem" }}>Follow authors to see their latest stories pop up here in real time.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorFeedPage;
