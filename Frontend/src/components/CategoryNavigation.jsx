import React from "react";
import { Link, useLocation } from "react-router-dom";

const CategoryNavigation = ({ categories = [] }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div
      style={{
        borderBottom: "1px solid var(--border-color)",
        background: "var(--bg-primary)",
        padding: "0.5rem 0",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            whiteSpace: "nowrap",
            padding: "0.25rem 0",
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: "0.82rem",
              fontWeight: currentPath === "/" ? 700 : 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: currentPath === "/" ? "var(--text-primary)" : "var(--text-secondary)",
              borderBottom: currentPath === "/" ? "2px solid var(--accent-warm)" : "2px solid transparent",
              paddingBottom: "4px",
              transition: "all 150ms ease",
            }}
          >
            All Stories
          </Link>

          {categories.map((cat) => {
            const catPath = `/category/${cat.slug}`;
            const isActive = currentPath === catPath;

            return (
              <Link
                key={cat._id || cat.slug}
                to={catPath}
                style={{
                  fontSize: "0.82rem",
                  fontWeight: isActive ? 700 : 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  borderBottom: isActive ? "2px solid var(--accent-warm)" : "2px solid transparent",
                  paddingBottom: "4px",
                  transition: "all 150ms ease",
                }}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;
