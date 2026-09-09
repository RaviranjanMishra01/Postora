import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Palette, Cpu, Layers, RefreshCw, AlertCircle } from "lucide-react";

// Category icon helper based on category name
const getCategoryIcon = (name = "") => {
  const lower = name.toLowerCase();
  if (lower.includes("ai") || lower.includes("artificial") || lower.includes("intelligence")) {
    return Sparkles;
  }
  if (lower.includes("design") || lower.includes("ux") || lower.includes("ui") || lower.includes("art")) {
    return Palette;
  }
  if (lower.includes("tech") || lower.includes("code") || lower.includes("dev") || lower.includes("software")) {
    return Cpu;
  }
  return Layers;
};

// Category Skeleton Loader matching exact 16/10 aspect ratio and text lines
export const CategorySkeleton = () => (
  <div
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-color)",
      borderRadius: "14px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div
      className="skeleton-shimmer"
      style={{
        width: "100%",
        aspectRatio: "16 / 10",
        background: "var(--bg-surface)",
      }}
    />
    <div style={{ padding: "1.2rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <div className="skeleton-shimmer" style={{ width: "70%", height: "20px", borderRadius: "5px", background: "var(--bg-surface)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem" }}>
        <div className="skeleton-shimmer" style={{ width: "35%", height: "14px", borderRadius: "5px", background: "var(--bg-surface)" }} />
        <div className="skeleton-shimmer" style={{ width: "16px", height: "16px", borderRadius: "50%", background: "var(--bg-surface)" }} />
      </div>
    </div>
  </div>
);

// Individual Category Card Component
export const CategoryCard = ({ category, index = 0 }) => {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const IconComponent = getCategoryIcon(category.name);

  const count = category.postCount ?? category.postsCount ?? 0;
  const articleCountText = count === 1 ? "1 Article" : `${count} Articles`;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="category-card"
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "14px",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        height: "100%",
        position: "relative",
        boxShadow: isHovered
          ? "0 20px 40px -16px rgba(15, 15, 20, 0.28), 0 2px 8px rgba(15, 15, 20, 0.06)"
          : "0 1px 2px rgba(15, 15, 20, 0.04)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        borderColor: isHovered ? "var(--Postora-pink)" : "var(--border-color)",
        transition: "transform 320ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 320ms cubic-bezier(0.16, 1, 0.3, 1), border-color 320ms ease",
        animation: `card-rise 480ms cubic-bezier(0.16, 1, 0.3, 1) both`,
        animationDelay: `${Math.min(index, 6) * 55}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 10",
          overflow: "hidden",
          position: "relative",
          background: "var(--bg-surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {category.image && !imgError ? (
          <>
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              onError={() => setImgError(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
                transform: isHovered ? "scale(1.06)" : "scale(1)",
              }}
            />
            {/* Subtle gradient wash for depth + legibility */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.16) 100%)",
                opacity: isHovered ? 1 : 0.6,
                transition: "opacity 320ms ease",
                pointerEvents: "none",
              }}
            />
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              background: "linear-gradient(155deg, var(--bg-surface) 0%, var(--bg-card) 100%)",
              color: "var(--text-secondary)",
              padding: "1rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                transition: "transform 320ms cubic-bezier(0.16, 1, 0.3, 1)",
                transform: isHovered ? "scale(1.08)" : "scale(1)",
              }}
            >
              <IconComponent size={24} strokeWidth={1.5} color="var(--Postora-pink)" />
            </div>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {category.name}
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
          gap: "0.85rem",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
              lineHeight: 1.3,
              margin: 0,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            {category.name}
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "0.65rem",
            borderTop: "1px solid var(--border-color)",
            marginTop: "0.25rem",
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "var(--text-secondary)",
            }}
          >
            {articleCountText}
          </span>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: isHovered ? "var(--Postora-pink)" : "transparent",
              transition: "background 280ms ease",
            }}
          >
            <ArrowRight
              size={15}
              color={isHovered ? "#fff" : "var(--text-primary)"}
              style={{
                transition: "transform 320ms cubic-bezier(0.16, 1, 0.3, 1), color 280ms ease",
                transform: isHovered ? "translateX(2px)" : "translateX(0)",
              }}
            />
          </span>
        </div>
      </div>
    </Link>
  );
};

// Main Category Section Component
const ExploreCategoriesSection = ({
  categories = [],
  loading = false,
  error = null,
  onRetry = null,
  showViewAll = true,
  viewAllLink = "/categories",
}) => {
  return (
    <section
      style={{
        paddingTop: "48px",
        paddingBottom: "64px",
        width: "100%",
      }}
    >
      <style>{`
        @keyframes card-rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer-sweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-shimmer {
          background-image: linear-gradient(90deg, var(--bg-surface) 0%, var(--bg-card) 50%, var(--bg-surface) 100%) !important;
          background-size: 200% 100%;
          animation: shimmer-sweep 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .category-card, .skeleton-shimmer {
            animation: none !important;
            transition: none !important;
          }
        }
        .category-card:focus-visible {
          outline: 2px solid var(--Postora-pink);
          outline-offset: 3px;
        }
        .view-all-link:focus-visible {
          outline: 2px solid var(--Postora-pink);
          outline-offset: 3px;
          border-radius: 4px;
        }
      `}</style>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--border-color)",
          marginBottom: "2.25rem",
          opacity: 0.8,
        }}
      />

      {/* Section Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "2rem",
          gap: "1.25rem",
        }}
      >
        <div>
          <span
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "0.35rem",
            }}
          >
            EXPLORE
          </span>

          <h2
            style={{
              fontSize: "1.85rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Explore Categories
          </h2>

          <p
            style={{
              fontSize: "0.92rem",
              color: "var(--text-secondary)",
              marginTop: "0.35rem",
              marginBottom: 0,
              lineHeight: 1.5,
              maxWidth: "540px",
            }}
          >
            Discover topics worth exploring across the platform.
          </p>
        </div>

        {showViewAll && viewAllLink && (
          <Link
            to={viewAllLink}
            className="view-all-link"
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-secondary)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              textDecoration: "none",
              transition: "color 200ms ease",
              paddingBottom: "0.2rem",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "var(--brand-warm-accent)";
              const arrow = e.currentTarget.querySelector(".view-all-arrow");
              if (arrow) arrow.style.transform = "translateX(4px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
              const arrow = e.currentTarget.querySelector(".view-all-arrow");
              if (arrow) arrow.style.transform = "translateX(0)";
            }}
          >
            <span>View All</span>
            <ArrowRight size={15} className="view-all-arrow" style={{ transition: "transform 200ms ease" }} />
          </Link>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "22px",
          }}
        >
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
        </div>
      ) : error ? (
        <div
          style={{
            padding: "2.5rem 1.5rem",
            textAlign: "center",
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "14px",
            color: "var(--text-secondary)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <AlertCircle size={28} color="var(--brand-slate-blue)" />
          <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Couldn't load categories.</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1.1rem",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                marginTop: "0.25rem",
                borderRadius: "8px",
                transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <RefreshCw size={14} /> Retry
            </button>
          )}
        </div>
      ) : categories.length === 0 ? (
        <div
          style={{
            padding: "3rem 1.5rem",
            textAlign: "center",
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "14px",
            color: "var(--text-secondary)",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>No categories yet — check back soon.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "22px",
          }}
        >
          {categories.map((cat, i) => (
            <CategoryCard key={cat._id || cat.slug} category={cat} index={i} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ExploreCategoriesSection;