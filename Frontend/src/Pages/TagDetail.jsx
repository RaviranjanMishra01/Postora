import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { tagApi } from "../api/categoryTagApi";
import PostCard from "../components/PostCard";
import { CardSkeleton } from "../components/SkeletonLoader";
import { Tag as TagIcon } from "lucide-react";
import SEO from "../components/SEO";

const TagDetail = () => {
  const { slug } = useParams();
  const [tag, setTag] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTagData = async () => {
      setLoading(true);
      try {
        const res = await tagApi.getTagBySlug(slug);
        setTag(res.data.tag);
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchTagData();
  }, [slug]);

  if (loading) return <div className="container" style={{ paddingTop: "3rem" }}><CardSkeleton /></div>;
  if (!tag) return <div style={{ textAlign: "center", padding: "5rem", color: "#fff" }}>Tag not found</div>;

  return (
    <div className="container" style={{ paddingTop: "2.5rem" }}>
      <SEO
        title={`#${tag.name} Articles`}
        description={`Explore all articles and publications tagged under #${tag.name} on Postora.`}
        url={`/tag/${tag.slug}`}
      />
      <div className="glass-card" style={{ padding: "2rem", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <TagIcon className="gradient-text" size={28} /> #{tag.name}
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
          Showing all articles tagged under #{tag.name}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default TagDetail;
