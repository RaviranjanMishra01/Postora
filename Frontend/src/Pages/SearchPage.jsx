import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, User, Clock, Eye, Heart, X, RotateCcw, FileText } from "lucide-react";
import { searchApi } from "../api/commentInteractionApi";
import { categoryApi, tagApi } from "../api/categoryTagApi";
import SEO from "../components/SEO";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [sort, setSort] = useState("latest");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const [results, setResults] = useState({ posts: [], authors: [], categories: [], tags: [] });
  const [allCategories, setAllCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync state with URL params if updated externally
  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [cRes, tRes] = await Promise.all([
          categoryApi.getCategories(),
          tagApi.getTags(),
        ]);
        setAllCategories(cRes.data?.categories || []);
        setAllTags(tRes.data?.tags || []);
      } catch (err) {
        console.error("Error fetching search categories/tags:", err);
      }
    };
    fetchFilters();
  }, []);

  const executeSearch = async () => {
    setLoading(true);
    try {
      const params = {
        q: queryParam,
        category: selectedCategory,
        tag: selectedTag,
        sort,
      };
      if (selectedAuthor?._id) {
        params.author = selectedAuthor._id;
      }

      const res = await searchApi.searchAll(params);
      setResults(res.data || { posts: [], authors: [], categories: [], tags: [] });
    } catch (err) {
      console.error("Error executing search:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, [queryParam, sort, selectedCategory, selectedTag, selectedAuthor]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearQuery = () => {
    setQuery("");
    setSearchParams({});
  };

  const handleClearAllFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setSelectedTag("");
    setSelectedAuthor(null);
    setSort("latest");
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    queryParam || selectedCategory || selectedTag || selectedAuthor || sort !== "latest"
  );

  const postsList = results.posts || [];
  const authorsList = results.authors || [];

  return (
    <div className="search-page-container">
      <SEO
        title={query ? `Search: "${query}"` : "Search Articles"}
        description="Search publications, tech articles, and authors on Postora."
        url="/search"
        noindex={true}
      />
      {/* COMPACT SEARCH & FILTERS HEADER */}
      <div className="search-header-card">
        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search articles, authors (@username), or topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          {query && (
            <button
              type="button"
              onClick={handleClearQuery}
              className="icon-btn-clear"
              title="Clear search query"
            >
              <X size={14} />
            </button>
          )}
        </form>

        {/* Compact Horizontal Filter Controls */}
        <div className="search-controls-row">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="compact-select"
          >
            <option value="">All Categories</option>
            {allCategories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="compact-select"
          >
            <option value="">All Tags</option>
            {allTags.map((t) => (
              <option key={t._id} value={t.slug}>
                #{t.name}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="compact-select"
          >
            <option value="latest">Sort: Latest</option>
            <option value="views">Sort: Most Viewed</option>
            <option value="likes">Sort: Most Liked</option>
          </select>

          {/* Active Author Pill */}
          {selectedAuthor && (
            <div className="active-filter-pill">
              <span>Author: <strong>{selectedAuthor.name}</strong></span>
              <button type="button" onClick={() => setSelectedAuthor(null)} title="Remove author filter">
                <X size={12} />
              </button>
            </div>
          )}

          {/* Clear Filters Link */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="clear-all-link"
            >
              <RotateCcw size={12} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* RESULTS SUMMARY BAR */}
      {hasActiveFilters && !loading && (
        <div className="results-summary">
          <div>
            <h2 className="summary-title">
              {queryParam ? (
                <>Search results for <span className="highlight-query">"{queryParam}"</span></>
              ) : selectedAuthor ? (
                <>Articles by <span className="highlight-query">{selectedAuthor.name}</span></>
              ) : (
                "Search Results"
              )}
            </h2>
            <p className="summary-counts">
              {authorsList.length > 0 && `${authorsList.length} author${authorsList.length > 1 ? "s" : ""} · `}
              {postsList.length} article{postsList.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>
      )}

      {/* LOADING SKELETONS */}
      {loading && (
        <div className="search-skeletons-wrapper">
          <SearchSkeletonItem />
          <SearchSkeletonItem />
          <SearchSkeletonItem />
        </div>
      )}

      {!loading && (
        <>
          {/* AUTHORS FOUND (Shown ONLY if there are matching authors) */}
          {authorsList.length > 0 && (
            <section className="search-section">
              <div className="section-meta-label">
                AUTHORS MATCHED ({authorsList.length})
              </div>
              <div className="authors-grid">
                {authorsList.map((author) => {
                  const isSelected = selectedAuthor?._id === author._id;
                  return (
                    <div
                      key={author._id}
                      className={`author-compact-card ${isSelected ? "is-selected" : ""}`}
                    >
                      <div className="author-card-info">
                        <img
                          src={
                            author.avatar ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                          }
                          alt={author.name}
                          className="author-avatar"
                        />
                        <div className="author-names">
                          <span className="author-fullname">{author.name}</span>
                          <span className="author-handle">@{author.username}</span>
                        </div>
                      </div>

                      <div className="author-card-actions">
                        <button
                          type="button"
                          onClick={() => setSelectedAuthor(isSelected ? null : author)}
                          className={`btn-author-filter ${isSelected ? "active" : ""}`}
                        >
                          {isSelected ? "Showing Posts" : "Posts by this author"}
                        </button>
                        <Link
                          to={`/author/${author.username}`}
                          className="btn-view-profile"
                        >
                          Profile <User size={12} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ARTICLES RESULTS (Shown ONLY if there are posts) */}
          {postsList.length > 0 && (
            <section className="search-section">
              <div className="section-meta-label">
                ARTICLES ({postsList.length})
              </div>
              <div className="posts-vertical-list">
                {postsList.map((post) => (
                  <HorizontalPostCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* CLEAN COMPACT EMPTY STATE (Shown ONLY if no posts AND no authors) */}
          {postsList.length === 0 && authorsList.length === 0 && (
            <div className="compact-empty-state">
              <div className="empty-icon-circle">
                <FileText size={22} />
              </div>
              <h3 className="empty-title">No matching results</h3>
              <p className="empty-desc">
                {queryParam
                  ? `No articles or authors matched "${queryParam}". Try checking for spelling errors or broadening your search.`
                  : "No articles matched your selected category or tag filters."}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="btn-empty-reset"
                >
                  <RotateCcw size={13} /> Reset search & filters
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* COMPACT STYLES (Enforcing 8-Color Palette & Light/Dark Themes) */}
      <style>{`
        .search-page-container {
          max-width: 860px;
          margin: 0 auto;
          padding: 1.5rem 1rem 4rem 1rem;
        }

        .search-header-card {
          background: var(--bg-secondary, #F9F8F6);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: var(--radius-md, 14px);
          padding: 1rem 1.15rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 0.85rem;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted, #94B4C1);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          height: 42px;
          padding: 0 2.4rem 0 2.5rem;
          font-size: 0.92rem;
          font-family: var(--font-body);
          color: var(--text-primary, #213448);
          background: var(--bg-primary, #FFFFFF);
          border: 1px solid var(--border-color, #D9CFC7);
          border-radius: 10px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .search-input:focus {
          border-color: var(--brand-slate-blue, #547792);
          box-shadow: 0 0 0 3px rgba(84, 119, 146, 0.15);
        }

        .icon-btn-clear {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-muted, #94B4C1);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .icon-btn-clear:hover {
          color: var(--text-primary, #213448);
          background: var(--bg-surface, #EFE9E3);
        }

        .search-controls-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
        }

        .compact-select {
          height: 32px;
          padding: 0 0.75rem;
          font-size: 0.8rem;
          font-weight: 500;
          font-family: var(--font-body);
          color: var(--text-primary, #213448);
          background: var(--bg-primary, #FFFFFF);
          border: 1px solid var(--border-color, #D9CFC7);
          border-radius: 7px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s ease;
        }

        .compact-select:hover {
          border-color: var(--brand-slate-blue, #547792);
        }

        .active-filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          height: 32px;
          padding: 0 0.75rem;
          font-size: 0.78rem;
          background: var(--brand-slate-blue, #547792);
          color: #FFFFFF;
          border-radius: 7px;
        }

        .active-filter-pill button {
          background: none;
          border: none;
          color: #FFFFFF;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
          opacity: 0.85;
        }

        .active-filter-pill button:hover {
          opacity: 1;
        }

        .clear-all-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          height: 32px;
          padding: 0 0.65rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--brand-slate-blue, #547792);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }

        .clear-all-link:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        .results-summary {
          margin-bottom: 1.25rem;
          padding: 0 0.25rem;
        }

        .summary-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary, #213448);
          margin: 0 0 0.2rem 0;
          line-height: 1.3;
        }

        .highlight-query {
          color: var(--brand-slate-blue, #547792);
        }

        .summary-counts {
          font-size: 0.82rem;
          color: var(--text-secondary, #547792);
          margin: 0;
        }

        .search-section {
          margin-bottom: 2rem;
        }

        .section-meta-label {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--brand-slate-blue, #547792);
          margin-bottom: 0.65rem;
          padding-left: 0.2rem;
        }

        /* AUTHORS GRID / LIST */
        .authors-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .author-compact-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          background: var(--bg-card, #FFFFFF);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 10px;
          gap: 0.75rem;
          transition: border-color 0.15s ease;
        }

        .author-compact-card.is-selected {
          border-color: var(--brand-slate-blue, #547792);
          background: var(--bg-secondary, #F9F8F6);
        }

        .author-card-info {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          min-width: 0;
        }

        .author-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .author-names {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .author-fullname {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary, #213448);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .author-handle {
          font-size: 0.76rem;
          color: var(--text-muted, #94B4C1);
        }

        .author-card-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .btn-author-filter {
          padding: 0.35rem 0.65rem;
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--brand-navy-dark, #213448);
          background: var(--bg-surface, #EFE9E3);
          border: 1px solid var(--brand-border-light, #D9CFC7);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-author-filter.active, .btn-author-filter:hover {
          background: var(--brand-slate-blue, #547792);
          color: #FFFFFF;
          border-color: var(--brand-slate-blue, #547792);
        }

        .btn-view-profile {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.35rem 0.65rem;
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--text-secondary, #547792);
          text-decoration: none;
          border-radius: 6px;
          transition: background 0.15s ease;
        }

        .btn-view-profile:hover {
          background: var(--bg-surface, #EFE9E3);
        }

        /* POSTS LIST & HORIZONTAL CARD */
        .posts-vertical-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .search-post-card {
          display: flex;
          background: var(--bg-card, #FFFFFF);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 12px;
          padding: 0.85rem;
          gap: 1rem;
          transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
        }

        .search-post-card:hover {
          border-color: var(--brand-slate-blue, #547792);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .search-post-img-link {
          width: 170px;
          height: 110px;
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
          display: block;
        }

        .search-post-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.25s ease;
        }

        .search-post-card:hover .search-post-img {
          transform: scale(1.04);
        }

        .search-post-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-grow: 1;
          min-width: 0;
        }

        .search-post-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.74rem;
          margin-bottom: 0.3rem;
        }

        .search-post-badge {
          font-weight: 700;
          color: var(--brand-slate-blue, #547792);
          background: var(--bg-secondary, #F9F8F6);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          border: 1px solid var(--border-color, #EFE9E3);
        }

        .search-post-date {
          color: var(--text-muted, #94B4C1);
        }

        .search-post-title {
          font-size: 1.02rem;
          font-weight: 700;
          line-height: 1.35;
          margin: 0 0 0.35rem 0;
        }

        .search-post-title a {
          color: var(--text-primary, #213448);
          text-decoration: none;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.15s ease;
        }

        .search-post-title a:hover {
          color: var(--brand-slate-blue, #547792);
        }

        .search-post-excerpt {
          font-size: 0.82rem;
          color: var(--text-secondary, #547792);
          margin: 0 0 0.6rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
        }

        .search-post-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.76rem;
          padding-top: 0.4rem;
          border-top: 1px dashed var(--border-color, #EFE9E3);
          margin-top: auto;
        }

        .search-post-author {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-primary, #213448);
          font-weight: 600;
          text-decoration: none;
        }

        .search-post-author-avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          object-fit: cover;
        }

        .search-post-stats {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-muted, #94B4C1);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        /* EMPTY STATE */
        .compact-empty-state {
          padding: 2.5rem 1.5rem;
          text-align: center;
          background: var(--bg-card, #FFFFFF);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .empty-icon-circle {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: var(--bg-secondary, #F9F8F6);
          color: var(--brand-slate-blue, #547792);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
        }

        .empty-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary, #213448);
          margin: 0 0 0.25rem 0;
        }

        .empty-desc {
          font-size: 0.82rem;
          color: var(--text-secondary, #547792);
          margin: 0 0 1rem 0;
          max-width: 360px;
          line-height: 1.45;
        }

        .btn-empty-reset {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.85rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: #FFFFFF;
          background: var(--brand-slate-blue, #547792);
          border: none;
          border-radius: 7px;
          cursor: pointer;
        }

        /* LOADING SKELETONS */
        .search-skeletons-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .skeleton-horizontal-item {
          display: flex;
          gap: 1rem;
          padding: 0.85rem;
          background: var(--bg-card, #FFFFFF);
          border: 1px solid var(--border-color, #EFE9E3);
          border-radius: 12px;
        }

        .sk-thumb {
          width: 170px;
          height: 105px;
          background: var(--bg-surface, #EFE9E3);
          border-radius: 8px;
          flex-shrink: 0;
          animation: skPulse 1.2s infinite ease-in-out;
        }

        .sk-body {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          justify-content: center;
        }

        .sk-line {
          height: 12px;
          background: var(--bg-surface, #EFE9E3);
          border-radius: 4px;
          animation: skPulse 1.2s infinite ease-in-out;
        }

        @keyframes skPulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 576px) {
          .search-post-card {
            flex-direction: column;
          }
          .search-post-img-link {
            width: 100%;
            height: 160px;
          }
          .skeleton-horizontal-item {
            flex-direction: column;
          }
          .sk-thumb {
            width: 100%;
            height: 140px;
          }
          .author-compact-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .author-card-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

// COMPACT HORIZONTAL POST CARD COMPONENT
const HorizontalPostCard = ({ post }) => {
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <article className="search-post-card">
      <Link to={`/post/${post.slug}`} className="search-post-img-link">
        <img
          src={
            post.featuredImage ||
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=80"
          }
          alt={post.title}
          loading="lazy"
          className="search-post-img"
        />
      </Link>

      <div className="search-post-content">
        <div>
          <div className="search-post-meta">
            {post.category && (
              <span className="search-post-badge">{post.category.name}</span>
            )}
            {formattedDate && (
              <>
                <span style={{ color: "var(--text-muted)" }}>•</span>
                <span className="search-post-date">{formattedDate}</span>
              </>
            )}
          </div>

          <h3 className="search-post-title">
            <Link to={`/post/${post.slug}`}>{post.title}</Link>
          </h3>

          {post.excerpt && <p className="search-post-excerpt">{post.excerpt}</p>}
        </div>

        <div className="search-post-footer">
          {post.author ? (
            <Link to={`/author/${post.author.username}`} className="search-post-author">
              <img
                src={
                  post.author.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                }
                alt={post.author.name}
                className="search-post-author-avatar"
              />
              <span>{post.author.name}</span>
            </Link>
          ) : (
            <span style={{ color: "var(--text-muted)" }}>Anonymous</span>
          )}

          <div className="search-post-stats">
            <span className="stat-item" title="Reading time">
              <Clock size={12} /> {post.readingTime || 3} min
            </span>
            <span className="stat-item" title="Views">
              <Eye size={12} /> {post.views || 0}
            </span>
            {post.likesCount > 0 && (
              <span className="stat-item" title="Likes">
                <Heart size={12} /> {post.likesCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

// SKELETON ITEM COMPONENT
const SearchSkeletonItem = () => (
  <div className="skeleton-horizontal-item">
    <div className="sk-thumb" />
    <div className="sk-body">
      <div className="sk-line" style={{ width: "25%" }} />
      <div className="sk-line" style={{ width: "85%", height: "16px" }} />
      <div className="sk-line" style={{ width: "60%" }} />
      <div className="sk-line" style={{ width: "40%", marginTop: "auto" }} />
    </div>
  </div>
);

export default SearchPage;
