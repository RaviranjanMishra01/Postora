import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { categoryApi } from "../api/categoryTagApi";
import PostCard from "../components/PostCard";
import { CardSkeleton } from "../components/SkeletonLoader";

const CategoryDetail = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await categoryApi.getCategoryBySlug(slug);
        setCategory(res.data.category);
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchCategory();
  }, [slug]);

  if (loading) return <div className="container" style={{ paddingTop: "3rem" }}><CardSkeleton /></div>;
  if (!category) return <div style={{ textAlign: "center", padding: "5rem", color: "#fff" }}>Category not found</div>;

  return (
    <div className="container" style={{ paddingTop: "2.5rem" }}>
      {/* Category Hero Header */}
      <div
        className="glass-card"
        style={{
          padding: "2.5rem",
          marginBottom: "3rem",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15,23,42,0.9) 100%)",
        }}
      >
        {category.image && (
          <img
            src={category.image}
            alt={category.name}
            style={{ width: "100px", height: "100px", borderRadius: "18px", objectFit: "cover" }}
          />
        )}
        <div>
          <span className="badge-category" style={{ marginBottom: "0.5rem", display: "inline-block" }}>
            Category Overview
          </span>
          <h1 style={{ fontSize: "2.2rem" }}>{category.name}</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>{category.description || "Discover the latest stories in this category."}</p>
        </div>
      </div>

      {/* Posts in Category */}
      <h3 style={{ fontSize: "1.35rem", marginBottom: "1.5rem" }}>Articles ({posts.length})</h3>

      {posts.length === 0 ? (
        <div className="glass-card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
          No published articles in this category yet.
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

export default CategoryDetail;
