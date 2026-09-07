import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { interactionApi } from "../api/commentInteractionApi";
import PostCard from "../components/PostCard";
import { CardSkeleton } from "../components/SkeletonLoader";

const BookmarksPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const res = await interactionApi.getBookmarks();
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="container" style={{ paddingTop: "2.5rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <Bookmark className="gradient-text" size={26} /> Saved Articles ({posts.length})
      </h1>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          <CardSkeleton /><CardSkeleton />
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-secondary)" }}>
          <Bookmark size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
          <h3>No saved bookmarks yet</h3>
          <p style={{ marginTop: "0.5rem" }}>Click the bookmark icon on any article card to save it for reading later.</p>
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

export default BookmarksPage;
