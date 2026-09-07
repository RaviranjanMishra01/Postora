import React, { useState, useEffect } from "react";
import { categoryApi } from "../api/categoryTagApi";
import ExploreCategoriesSection from "../components/ExploreCategoriesSection";
import { CardSkeleton } from "../components/SkeletonLoader";
import { Grid, Sparkles } from "lucide-react";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await categoryApi.getCategories();
        setCategories(res.data?.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
      {/* Hero Banner Header */}
      <div
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "2.5rem 2rem",
          marginBottom: "2.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.75rem",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#FF497C",
            marginBottom: "0.6rem",
            background: "rgba(255, 73, 124, 0.08)",
            padding: "0.3rem 0.85rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid rgba(255, 73, 124, 0.2)",
          }}
        >
          <Sparkles size={14} /> CATEGORY DIRECTORY
        </div>

        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 900,
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
            lineHeight: 1.2,
            marginBottom: "0.75rem",
          }}
        >
          Browse All Topics & Categories
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Explore expert writing across artificial intelligence, design, technology, software engineering, and modern digital trends.
        </p>
      </div>

      {/* Main Categories Section */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <ExploreCategoriesSection
          categories={categories}
          title="All Available Categories"
          subtitle={`Showing all ${categories.length} topics on MERN Blog`}
          showViewAll={false}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
