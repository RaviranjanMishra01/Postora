import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Filter, User } from "lucide-react";
import { searchApi } from "../api/commentInteractionApi";
import { categoryApi, tagApi } from "../api/categoryTagApi";
import PostCard from "../components/PostCard";
import SectionHeader from "../components/SectionHeader";
import { CardSkeleton } from "../components/SkeletonLoader";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [sort, setSort] = useState("latest");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const [results, setResults] = useState({ posts: [], authors: [], categories: [], tags: [] });
  const [allCategories, setAllCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [cRes, tRes] = await Promise.all([
          categoryApi.getCategories(),
          tagApi.getTags(),
        ]);
        setAllCategories(cRes.data.categories || []);
        setAllTags(tRes.data.tags || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFilters();
  }, []);

  const executeSearch = async () => {
    setLoading(true);
    try {
      const res = await searchApi.searchAll({
        q: query,
        category: selectedCategory,
        tag: selectedTag,
        sort,
      });
      setResults(res.data || { posts: [], authors: [], categories: [], tags: [] });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, [queryParam, sort, selectedCategory, selectedTag]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: query });
  };

  const selectStyle = {
    padding: "0.5rem 0.85rem",
    borderRadius: "var(--radius-md)",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    fontSize: "0.85rem",
    outline: "none",
  };

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>
      {/* Search Header Form */}
      <form
        onSubmit={handleSearchSubmit}
        style={{
          padding: "1.75rem",
          marginBottom: "2.5rem",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <div style={{ position: "relative", marginBottom: "1.25rem" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search articles, topics, authors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.6rem",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontSize: "1.05rem",
              outline: "none",
            }}
          />
        </div>

        {/* Filter Bar */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600 }}>
            <Filter size={14} /> FILTER BY:
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={selectStyle}
          >
            <option value="">All Categories</option>
            {allCategories.map((c) => (
              <option key={c._id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            style={selectStyle}
          >
            <option value="">All Tags</option>
            {allTags.map((t) => (
              <option key={t._id} value={t.slug}>#{t.name}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={selectStyle}
          >
            <option value="latest">Sort by Latest</option>
            <option value="views">Sort by Popularity (Views)</option>
            <option value="likes">Sort by Likes</option>
          </select>
        </div>
      </form>

      {/* Authors Matches */}
      {results.authors && results.authors.length > 0 && (
        <div style={{ marginBottom: "2.5rem" }}>
          <SectionHeader title="AUTHORS FOUND" />
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {results.authors.map((author) => (
              <Link
                key={author._id}
                to={`/author/${author.username}`}
                style={{
                  padding: "0.85rem 1.1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <img src={author.avatar} alt={author.name} style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <h4 style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 700 }}>{author.name}</h4>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>@{author.username}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Posts Results */}
      <SectionHeader title={`SEARCH RESULTS (${results.posts?.length || 0})`} />

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : results.posts?.length === 0 ? (
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            color: "var(--text-secondary)",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
          }}
        >
          No articles match your search query or filters.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {results.posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
