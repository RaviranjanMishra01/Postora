import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import OverlayPostCard from "./OverlayPostCard";
import { useAuth } from "../context/AuthContext";
import { interactionApi } from "../api/commentInteractionApi";
import { toast } from "../context/ToastContext";

const CarrinoHero = ({ featuredPosts = [], rightPosts = [] }) => {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!featuredPosts || featuredPosts.length === 0) return null;

  const currentPost = featuredPosts[currentIndex] || featuredPosts[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredPosts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info("Please log in to bookmark stories");
      return;
    }
    try {
      const res = await interactionApi.toggleBookmark(currentPost._id);
      setIsBookmarked(res.data.isBookmarked);
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message || "Failed to update bookmark");
    }
  };

  const formattedDate = currentPost.createdAt
    ? new Date(currentPost.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const commentsCount = typeof currentPost.commentsCount === "number"
    ? currentPost.commentsCount
    : currentPost.comments?.length || 0;

  return (
    <section style={{ paddingTop: "1.5rem", paddingBottom: "2.5rem" }}>
      <div
        className="carrino-hero-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: "1.5rem",
          alignItems: "stretch",
        }}
      >
        {/* LEFT COLUMN: Main Hero Slider Card */}
        <div
          className="carrino-card"
          style={{
            height: "410px",
            position: "relative",
          }}
        >
          <Link to={`/post/${currentPost.slug}`} style={{ display: "block", width: "100%", height: "100%" }}>
            {currentPost.featuredImage && (
              <img
                src={currentPost.featuredImage}
                alt={currentPost.title}
                className="carrino-card-img"
              />
            )}
            <div className="carrino-gradient-overlay" />

            {/* Top Category Badge & Save Button */}
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                right: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 3,
              }}
            >
              {currentPost.category && (
                <span className="carrino-badge-pill" style={{ margin: 0 }}>
                  {currentPost.category.name}
                </span>
              )}

              <button
                onClick={handleBookmark}
                style={{
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isBookmarked ? "var(--carrino-pink)" : "#FFFFFF",
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                  marginLeft: "auto",
                }}
                title="Save story"
              >
                <Bookmark size={16} fill={isBookmarked ? "var(--carrino-pink)" : "none"} />
              </button>
            </div>

            {/* Carousel Navigation Arrows */}
            {featuredPosts.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePrev();
                  }}
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "var(--bg-card)",
                    color: "var(--text-primary)",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 4,
                    boxShadow: "var(--shadow-subtle)",
                  }}
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNext();
                  }}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "var(--bg-card)",
                    color: "var(--text-primary)",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 4,
                    boxShadow: "var(--shadow-subtle)",
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Bottom Content Overlay */}
            <div className="carrino-card-content" style={{ padding: "2rem 2rem 1.5rem 2rem" }}>
              <h1
                style={{
                  fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: "#FFFFFF",
                  marginBottom: "0.85rem",
                  fontFamily: "var(--font-heading)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)",
                }}
              >
                {currentPost.title}
              </h1>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: 500,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  {currentPost.author && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {currentPost.author.avatar && (
                        <img
                          src={currentPost.author.avatar}
                          alt={currentPost.author.name}
                          style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid #FFFFFF" }}
                        />
                      )}
                      <span style={{ fontWeight: 600 }}>by {currentPost.author.name}</span>
                    </div>
                  )}
                  {currentPost.author && formattedDate && <span>·</span>}
                  {formattedDate && <span>{formattedDate}</span>}
                  {commentsCount > 0 && <span>·</span>}
                  {commentsCount > 0 && <span>{commentsCount} {commentsCount === 1 ? "Comment" : "Comments"}</span>}
                </div>

                {/* Carousel Pagination Dots */}
                {featuredPosts.length > 1 && (
                  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                    {featuredPosts.slice(0, 5).map((_, idx) => (
                      <span
                        key={idx}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCurrentIndex(idx);
                        }}
                        style={{
                          width: idx === currentIndex ? "16px" : "8px",
                          height: "8px",
                          borderRadius: "4px",
                          background: idx === currentIndex ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)",
                          cursor: "pointer",
                          transition: "all 200ms ease",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* RIGHT COLUMN: 2 Stacked Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {rightPosts.slice(0, 2).map((post, idx) => (
            <OverlayPostCard key={post._id || idx} post={post} height="195px" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarrinoHero;
