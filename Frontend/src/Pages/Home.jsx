import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { postApi } from "../api/postApi";
import { categoryApi } from "../api/categoryTagApi";

import CarrinoHero from "../components/CarrinoHero";
import OverlayPostCard from "../components/OverlayPostCard";
import ExploreCategoriesSection from "../components/ExploreCategoriesSection";
import SidebarCompactList from "../components/SidebarCompactList";
import SidebarNewsletter from "../components/SidebarNewsletter";
import FeatureHighlightsBar from "../components/FeatureHighlightsBar";
import { HeroSkeleton, CardSkeleton } from "../components/SkeletonLoader";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsRes, catRes] = await Promise.all([
          postApi.getPosts({ page, limit: 16 }),
          categoryApi.getCategories(),
        ]);
        const fetchedPosts = postsRes.data.posts || [];
        setPosts(fetchedPosts);
        setTotalPages(postsRes.data.pagination?.pages || 1);
        setCategories(catRes.data?.categories || []);
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  // Data Partitioning for Carrino Layout
  const featuredPosts = posts.filter((p) => p.isFeatured).length > 0
    ? posts.filter((p) => p.isFeatured)
    : posts.slice(0, 3);

  const heroRightPosts = posts.filter((p) => !featuredPosts.includes(p)).slice(0, 2);

  // Editors Picks Section
  const editorsPicksPosts = posts.filter((p) => p.isFeatured).length > 0
    ? posts.filter((p) => p.isFeatured).slice(0, 3)
    : (posts.length > 3 ? posts.slice(3, 6) : posts.slice(0, 3));

  // Latest Posts Grid: Always renders the latest posts (starts from posts[0])
  const latestGridPosts = posts.length > 0 ? posts.slice(0, 8) : [];

  // Sidebar Compact List
  const sidebarCompactPosts = posts.length > 0 ? posts.slice(0, 4) : [];

  return (
    <main className="container" style={{ paddingBottom: "2rem" }}>
      {loading ? (
        <>
          <HeroSkeleton />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem", margin: "2rem 0" }}>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </>
      ) : posts.length === 0 ? (
        <div
          style={{
            padding: "4rem 2rem",
            textAlign: "center",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            background: "var(--bg-secondary)",
            margin: "3rem 0",
          }}
        >
          <h3 style={{ fontSize: "1.25rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            No Publications Available
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Check back soon for the latest articles.
          </p>
        </div>
      ) : (
        <>
          {/* 1. HERO SECTION: Carousel + Stacked Right Cards */}
          <CarrinoHero featuredPosts={featuredPosts} rightPosts={heroRightPosts} />

          {/* 2. EDITORS PICKS SECTION */}
          {editorsPicksPosts.length > 0 && (
            <section style={{ margin: "2.5rem 0 3.5rem 0" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                }}
              >
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
                  Editors Picks
                </h2>
                <Link
                  to="/categories"
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#FF497C",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {editorsPicksPosts.map((post, idx) => (
                  <OverlayPostCard key={post._id} post={post} height="260px" showBadgeIcon={idx === 2} />
                ))}
              </div>
            </section>
          )}

          {/* 3. EXPLORE CATEGORIES SECTION */}
          {categories.length > 0 && (
            <ExploreCategoriesSection categories={categories} /> 
          )}


          {/* 3. LATEST POSTS SECTION WITH SIDEBAR */}
          <section style={{ margin: "2.5rem 0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
              }}
            >
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
                Latest Posts
              </h2>
              <Link
                to="/categories"
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "#FF497C",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div
              className="carrino-latest-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 340px",
                gap: "2rem",
                alignItems: "start",
              }}
            >
              {/* LEFT: 2-Column Grid of Overlay Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {latestGridPosts.map((post) => (
                  <OverlayPostCard key={post._id} post={post} height="260px" />
                ))}

                {/* Pagination Controls if available */}
                {totalPages > 1 && (
                  <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "2rem" }}>
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="btn-secondary"
                    >
                      Previous
                    </button>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      disabled={page === totalPages}
                      className="btn-secondary"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT SIDEBAR: Compact List + Stay in the Loop Newsletter Widget */}
              <div>
                <SidebarCompactList posts={sidebarCompactPosts.length > 0 ? sidebarCompactPosts : posts.slice(0, 4)} />
                <SidebarNewsletter />
              </div>
            </div>
          </section>

          {/* 4. FEATURE HIGHLIGHTS BAR */}
          <FeatureHighlightsBar />
        </>
      )}
    </main>
  );
};

export default Home;