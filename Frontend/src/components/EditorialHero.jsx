import React from "react";
import FeaturedPostCard from "./FeaturedPostCard";
import CompactPostCard from "./CompactPostCard";
import LatestPostList from "./LatestPostList";

const EditorialHero = ({ featuredPost, leftPosts = [], latestPosts = [] }) => {
  if (!featuredPost) return null;

  return (
    <section style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
      <div
        className="editorial-hero-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr 280px",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN: 2 Compact Stories */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {leftPosts.slice(0, 2).map((post, index) => (
            <CompactPostCard key={post._id || index} post={post} showImage={true} />
          ))}
        </div>

        {/* CENTER COLUMN: Flagship Featured Story */}
        <div>
          <FeaturedPostCard post={featuredPost} />
        </div>

        {/* RIGHT COLUMN: Latest Editorial List */}
        <div>
          <LatestPostList posts={latestPosts} />
        </div>
      </div>
    </section>
  );
};

export default EditorialHero;
