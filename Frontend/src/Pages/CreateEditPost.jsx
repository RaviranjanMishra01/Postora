import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PenTool,
  UploadCloud,
  CheckCircle2,
  Eye,
  Save,
  Send,
  ChevronDown,
  ChevronUp,
  X,
  Link2,
  Plus,
} from "lucide-react";
import { postApi } from "../api/postApi";
import { categoryApi, tagApi } from "../api/categoryTagApi";
import PostPreviewModal from "../components/PostPreviewModal";
import { toast } from "../context/ToastContext";
import SEO from "../components/SEO";

const CreateEditPost = () => {
  const { id } = useParams(); // If present, edit mode
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [status, setStatus] = useState("published");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(false);

  // UI state
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [isTopicMenuOpen, setIsTopicMenuOpen] = useState(false);

  const fileInputRef = useRef(null);
  const topicContainerRef = useRef(null);

  useEffect(() => {
    const initData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          categoryApi.getCategories(),
          tagApi.getTags(),
        ]);
        const fetchedCats = catRes.data.categories || [];
        setCategories(fetchedCats);
        setAllTags(tagRes.data.tags || []);

        if (id) {
          // Edit mode: fetch existing post
          setFetchingPost(true);
          try {
            const postRes = await postApi.getPostBySlug(id);
            const post = postRes.data?.post;
            if (post) {
              setTitle(post.title || "");
              setExcerpt(post.excerpt || "");
              setFeaturedImage(post.featuredImage || "");

              // Category initialization
              if (post.customCategory && post.customCategory.trim()) {
                setCategory("Other");
                setCustomCategory(post.customCategory);
              } else if (post.category) {
                const catId = post.category._id || post.category;
                const foundCat = fetchedCats.find((c) => c._id === catId);
                if (foundCat && foundCat.name.toLowerCase() === "other") {
                  setCategory("Other");
                  setCustomCategory(post.customCategory || "");
                } else {
                  setCategory(catId);
                  setCustomCategory("");
                }
              }

              // Topics initialization
              let initialTopics = [];
              if (Array.isArray(post.topics) && post.topics.length > 0) {
                initialTopics = post.topics;
              } else if (Array.isArray(post.tags) && post.tags.length > 0) {
                initialTopics = post.tags.map((t) => (typeof t === "object" ? t.name : t));
              }
              setSelectedTopics(initialTopics);

              setStatus(post.status || "published");
              setSeoTitle(post.seoTitle || "");
              setSeoDescription(post.seoDescription || "");

              if (post.featuredImage && !post.featuredImage.startsWith("data:")) {
                setShowUrlInput(true);
              }
            }
          } catch (err) {
            console.error("Error fetching post details:", err);
            toast.error("Failed to load post for editing");
          } finally {
            setFetchingPost(false);
          }
        } else if (fetchedCats.length > 0) {
          setCategory(fetchedCats[0]._id);
        }
      } catch (err) {
        console.error("Error initializing category & topic data:", err);
      }
    };

    initData();
  }, [id]);

  // Click outside to close topic dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (topicContainerRef.current && !topicContainerRef.current.contains(e.target)) {
        setIsTopicMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryChange = (val) => {
    setCategory(val);
    if (val !== "Other") {
      setCustomCategory("");
    }
  };

  const addTopic = (topicName) => {
    const trimmed = topicName.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    const isDuplicate = selectedTopics.some((t) => t.toLowerCase() === lower);
    if (!isDuplicate) {
      setSelectedTopics((prev) => [...prev, trimmed]);
    }
    setTagSearch("");
    setIsTopicMenuOpen(false);
  };

  const removeTopic = (topicName) => {
    setSelectedTopics((prev) => prev.filter((t) => t.toLowerCase() !== topicName.toLowerCase()));
  };

  const handleTopicKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tagSearch.trim()) {
        addTopic(tagSearch.trim());
      }
    }
  };

  const handleFormSubmit = async (e, targetStatus = status) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      toast.error("Please add a title for your post.");
      return;
    }
    if (!category) {
      toast.error("Please choose a category.");
      return;
    }
    if (category === "Other" && !customCategory.trim()) {
      toast.error("Please enter your category.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("excerpt", excerpt.trim());
      formData.append("category", category);
      formData.append("customCategory", category === "Other" ? customCategory.trim() : "");
      formData.append("status", targetStatus);
      formData.append("seoTitle", seoTitle.trim() || title.trim());
      formData.append("seoDescription", seoDescription.trim() || excerpt.trim());

      selectedTopics.forEach((tName) => {
        formData.append("topics", tName);
        formData.append("tags", tName);
      });

      if (imageFile) {
        formData.append("featuredImage", imageFile);
      } else if (featuredImage) {
        formData.append("featuredImage", featuredImage);
      }

      if (id) {
        const res = await postApi.updatePost(id, formData);
        toast.success(targetStatus === "draft" ? "Draft saved successfully!" : "Post updated successfully!");
        navigate(`/post/${res.data.post.slug}`);
      } else {
        const res = await postApi.createPost(formData);
        toast.success(targetStatus === "draft" ? "Draft saved successfully!" : "Post published successfully!");
        navigate(`/post/${res.data.post.slug}`);
      }
    } catch (err) {
      toast.error(err.message || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setImageFile(file);
      } else {
        toast.error("Please upload a valid image file (JPG, PNG, WebP)");
      }
    }
  };

  // Readiness checklist: Title, Category (and customCategory if Other), Content
  const isTitleFilled = Boolean(title.trim());
  const isCategoryFilled = category === "Other" ? Boolean(customCategory.trim()) : Boolean(category);
  const completedCount = [isTitleFilled, isCategoryFilled].filter(Boolean).length;

  const displayCoverUrl = imageFile ? URL.createObjectURL(imageFile) : featuredImage;

  const filteredExistingTags = allTags.filter(
    (t) =>
      t.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
      !selectedTopics.some((st) => st.toLowerCase() === t.name.toLowerCase())
  );

  const exactMatchExists = allTags.some(
    (t) => t.name.toLowerCase() === tagSearch.trim().toLowerCase()
  ) || selectedTopics.some((st) => st.toLowerCase() === tagSearch.trim().toLowerCase());

  if (fetchingPost) {
    return (
      <div className="container" style={{ paddingTop: "5rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted, #94A3B8)", fontSize: "1.1rem" }}>
          Loading your article...
        </p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={id ? "Edit Post" : "Create Post"}
        description="Write and publish a new post on Postora."
        url={id ? `/edit-post/${id}` : "/create-post"}
        noindex={true}
      />

      <div style={{ backgroundColor: "var(--bg-primary, #F8FAFC)", minHeight: "100vh", paddingBottom: "5rem" }}>
        {/* TOP EDITORIAL HEADER & ACTION BAR */}
        <div
          style={{
            backgroundColor: "var(--bg-primary, #FFFFFF)",
          }}
        >
          <div
            className="container"
            style={{
              maxWidth: "1000px",
              padding: "1rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "1.35rem",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  color: "var(--text-primary, #0F172A)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  margin: 0,
                }}
              >
                <PenTool size={20} color="var(--Postora-pink, #FF3F7F)" />
                {id ? "Edit your post" : "Create a new post"}
              </h1>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748B)", margin: 0, marginTop: "2px" }}>
                Share your ideas, knowledge, and stories with the Postora community.
              </p>
            </div>
          </div>
        </div>

        {/* MAIN EDITORIAL FORM CONTAINER */}
        <div className="container" style={{ maxWidth: "1000px", paddingTop: "2rem" }}>
          <form onSubmit={(e) => handleFormSubmit(e, status)} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* 1. ARTICLE TITLE */}
            <div
              style={{
                backgroundColor: "var(--bg-card, #FFFFFF)",
                borderRadius: "16px",
                padding: "2rem",
                border: "1px solid var(--border-color, #E2E8F0)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                <label
                  htmlFor="post-title-input"
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "var(--text-primary, #0F172A)",
                  }}
                >
                  Title <span style={{ color: "var(--Postora-pink, #FF3F7F)" }}>*</span>
                </label>
              </div>

              <input
                id="post-title-input"
                type="text"
                placeholder="Give your post a clear and engaging title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: "100%",
                  fontSize: "1.75rem",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  color: "var(--text-primary, #0F172A)",
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: "2px solid var(--border-color, #E2E8F0)",
                  paddingBottom: "0.75rem",
                  outline: "none",
                  transition: "border-color 200ms ease",
                  boxSizing: "border-box",
                }}
                className="title-hero-input"
              />

              <p style={{ fontSize: "0.82rem", color: "var(--text-muted, #94A3B8)", marginTop: "0.6rem", margin: 0 }}>
                A good title helps readers understand what your post is about.
              </p>
            </div>

            {/* 2. SHORT DESCRIPTION */}
            <div
              style={{
                backgroundColor: "var(--bg-card, #FFFFFF)",
                borderRadius: "16px",
                padding: "1.75rem 2rem",
                border: "1px solid var(--border-color, #E2E8F0)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
              }}
            >
              <label
                htmlFor="post-excerpt-input"
                style={{
                  display: "block",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--text-primary, #0F172A)",
                  marginBottom: "0.25rem",
                }}
              >
                Short description
              </label>

              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748B)", marginBottom: "0.75rem" }}>
                Give readers a quick idea of what your post is about.
              </p>

              <textarea
                id="post-excerpt-input"
                rows={3}
                placeholder="Write a short description of your post..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "12px",
                  backgroundColor: "var(--bg-secondary, #F8FAFC)",
                  border: "1px solid var(--border-color, #E2E8F0)",
                  color: "var(--text-primary, #0F172A)",
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* 3. COVER IMAGE ZONE */}
            <div
              style={{
                backgroundColor: "var(--bg-card, #FFFFFF)",
                borderRadius: "16px",
                padding: "1.75rem 2rem",
                border: "1px solid var(--border-color, #E2E8F0)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <label
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "var(--text-primary, #0F172A)",
                  }}
                >
                  Cover image
                </label>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--Postora-pink, #FF3F7F)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <Link2 size={14} />
                  {showUrlInput ? "Upload image file instead" : "Use an image URL instead"}
                </button>
              </div>

              {displayCoverUrl ? (
                /* PREVIEW OF COVER IMAGE */
                <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--border-color, #E2E8F0)" }}>
                  <img
                    src={displayCoverUrl}
                    alt="Cover Preview"
                    style={{ width: "100%", maxHeight: "320px", objectFit: "cover", display: "block" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      right: "12px",
                      display: "flex",
                      gap: "0.5rem",
                      backgroundColor: "rgba(15, 23, 42, 0.75)",
                      backdropFilter: "blur(4px)",
                      padding: "0.5rem",
                      borderRadius: "10px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary"
                      style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem", height: "auto" }}
                    >
                      Replace image
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setFeaturedImage("");
                      }}
                      className="btn-secondary"
                      style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem", height: "auto", color: "#EF4444" }}
                    >
                      Remove image
                    </button>
                  </div>
                </div>
              ) : showUrlInput ? (
                /* IMAGE URL FALLBACK INPUT */
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={featuredImage}
                    onChange={(e) => {
                      setFeaturedImage(e.target.value);
                      setImageFile(null);
                    }}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      borderRadius: "12px",
                      backgroundColor: "var(--bg-secondary, #F8FAFC)",
                      border: "1px solid var(--border-color, #E2E8F0)",
                      color: "var(--text-primary, #0F172A)",
                      fontSize: "0.92rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted, #94A3B8)" }}>
                    Paste a direct image URL from Unsplash or any web host.
                  </p>
                </div>
              ) : (
                /* VISUAL DROPZONE */
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: "2px dashed var(--border-color, #CBD5E1)",
                    borderRadius: "14px",
                    padding: "2.5rem 1.5rem",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: "var(--bg-secondary, #F8FAFC)",
                    transition: "all 200ms ease",
                  }}
                  className="image-dropzone"
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      backgroundColor: "rgba(255, 63, 127, 0.1)",
                      color: "var(--Postora-pink, #FF3F7F)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 0.75rem",
                    }}
                  >
                    <UploadCloud size={24} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary, #0F172A)", marginBottom: "0.25rem" }}>
                    Add a cover image
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary, #64748B)", marginBottom: "0.75rem" }}>
                    Drag & drop an image here or <span style={{ color: "var(--Postora-pink, #FF3F7F)", fontWeight: 600 }}>Choose image</span>
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted, #94A3B8)" }}>
                    JPG, PNG or WebP • Max 5MB
                  </p>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                style={{ display: "none" }}
              />
            </div>

            {/* 4. CATEGORY & TOPICS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {/* Category */}
              <div
                style={{
                  backgroundColor: "var(--bg-card, #FFFFFF)",
                  borderRadius: "16px",
                  padding: "1.75rem 2rem",
                  border: "1px solid var(--border-color, #E2E8F0)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                }}
              >
                <label
                  htmlFor="category-select"
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "var(--text-primary, #0F172A)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Category <span style={{ color: "var(--Postora-pink, #FF3F7F)" }}>*</span>
                </label>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748B)", marginBottom: "0.75rem" }}>
                  Choose the topic that best matches your post.
                </p>

                <select
                  id="category-select"
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    borderRadius: "12px",
                    backgroundColor: "var(--bg-secondary, #F8FAFC)",
                    border: "1px solid var(--border-color, #E2E8F0)",
                    color: "var(--text-primary, #0F172A)",
                    fontSize: "0.92rem",
                    fontWeight: 500,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>

                {/* Custom Category Input (shown when "Other" is selected) */}
                {category === "Other" && (
                  <div style={{ marginTop: "1rem" }}>
                    <label
                      htmlFor="custom-category-input"
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--text-primary, #0F172A)",
                        marginBottom: "0.35rem",
                      }}
                    >
                      Other category <span style={{ color: "var(--Postora-pink, #FF3F7F)" }}>*</span>
                    </label>
                    <input
                      id="custom-category-input"
                      type="text"
                      placeholder="Enter your category..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      required={category === "Other"}
                      style={{
                        width: "100%",
                        padding: "0.8rem 1rem",
                        borderRadius: "12px",
                        backgroundColor: "var(--bg-secondary, #F8FAFC)",
                        border: "1px solid var(--border-color, #E2E8F0)",
                        color: "var(--text-primary, #0F172A)",
                        fontSize: "0.92rem",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Topics */}
              <div
                ref={topicContainerRef}
                style={{
                  backgroundColor: "var(--bg-card, #FFFFFF)",
                  borderRadius: "16px",
                  padding: "1.75rem 2rem",
                  border: "1px solid var(--border-color, #E2E8F0)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                  position: "relative",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "var(--text-primary, #0F172A)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Topics
                </label>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748B)", marginBottom: "0.75rem" }}>
                  Add a few topics to help readers discover your post.
                </p>

                {/* Selected Topics Chips */}
                {selectedTopics.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    {selectedTopics.map((topicName, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          backgroundColor: "var(--Postora-pink, #FF3F7F)",
                          color: "#FFFFFF",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          padding: "0.3rem 0.7rem",
                          borderRadius: "9999px",
                        }}
                      >
                        {topicName}
                        <button
                          type="button"
                          onClick={() => removeTopic(topicName)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#FFFFFF",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Topic Search & Add Input */}
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Search or add a topic..."
                    value={tagSearch}
                    onChange={(e) => {
                      setTagSearch(e.target.value);
                      setIsTopicMenuOpen(true);
                    }}
                    onFocus={() => setIsTopicMenuOpen(true)}
                    onKeyDown={handleTopicKeyDown}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.9rem",
                      borderRadius: "10px",
                      backgroundColor: "var(--bg-secondary, #F8FAFC)",
                      border: "1px solid var(--border-color, #E2E8F0)",
                      color: "var(--text-primary, #0F172A)",
                      fontSize: "0.88rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />

                  {/* Topic Dropdown Options */}
                  {isTopicMenuOpen && (tagSearch.trim() || filteredExistingTags.length > 0) && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        marginTop: "4px",
                        backgroundColor: "var(--bg-card, #FFFFFF)",
                        border: "1px solid var(--border-color, #E2E8F0)",
                        borderRadius: "10px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        zIndex: 50,
                        maxHeight: "180px",
                        overflowY: "auto",
                        padding: "0.35rem 0",
                      }}
                    >
                      {/* Custom Topic Add Option if user typed text */}
                      {tagSearch.trim() && !exactMatchExists && (
                        <button
                          type="button"
                          onClick={() => addTopic(tagSearch)}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "0.6rem 1rem",
                            border: "none",
                            background: "transparent",
                            color: "var(--Postora-pink, #FF3F7F)",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                          className="dropdown-item-hover"
                        >
                          <Plus size={15} /> Add "{tagSearch.trim()}"
                        </button>
                      )}

                      {/* Matching Existing Tags */}
                      {filteredExistingTags.map((t) => (
                        <button
                          type="button"
                          key={t._id}
                          onClick={() => addTopic(t.name)}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "0.5rem 1rem",
                            border: "none",
                            background: "transparent",
                            color: "var(--text-primary, #0F172A)",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                          }}
                          className="dropdown-item-hover"
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>



            {/* 6. ADVANCED SETTINGS (COLLAPSIBLE) */}
            <div
              style={{
                backgroundColor: "var(--bg-card, #FFFFFF)",
                borderRadius: "16px",
                border: "1px solid var(--border-color, #E2E8F0)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  width: "100%",
                  padding: "1.25rem 2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "var(--text-primary, #0F172A)",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span>Advanced settings</span>
                {showAdvanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {showAdvanced && (
                <div style={{ padding: "0 2rem 1.75rem", borderTop: "1px solid var(--border-color, #E2E8F0)", paddingTop: "1.25rem" }}>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748B)", marginBottom: "1.25rem" }}>
                    Optional. These settings help search engines understand your article.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {/* SEO Title */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary, #475569)", marginBottom: "0.35rem" }}>
                        SEO Title (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder={title ? `Defaults to: ${title}` : "SEO Title tag"}
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          borderRadius: "10px",
                          backgroundColor: "var(--bg-secondary, #F8FAFC)",
                          border: "1px solid var(--border-color, #E2E8F0)",
                          color: "var(--text-primary, #0F172A)",
                          fontSize: "0.9rem",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {/* SEO Description */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary, #475569)", marginBottom: "0.35rem" }}>
                        SEO Description (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder={excerpt ? `Defaults to: ${excerpt}` : "SEO Meta Description"}
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          borderRadius: "10px",
                          backgroundColor: "var(--bg-secondary, #F8FAFC)",
                          border: "1px solid var(--border-color, #E2E8F0)",
                          color: "var(--text-primary, #0F172A)",
                          fontSize: "0.9rem",
                          outline: "none",
                          resize: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {/* Status Select */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary, #475569)", marginBottom: "0.35rem" }}>
                        Publishing Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{
                          width: "100%",
                          maxWidth: "240px",
                          padding: "0.75rem 1rem",
                          borderRadius: "10px",
                          backgroundColor: "var(--bg-secondary, #F8FAFC)",
                          border: "1px solid var(--border-color, #E2E8F0)",
                          color: "var(--text-primary, #0F172A)",
                          fontSize: "0.9rem",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BOTTOM ACTIONS BAR */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={(e) => handleFormSubmit(e, "draft")}
                disabled={loading}
                className="btn-secondary"
                style={{
                  height: "44px",
                  padding: "0 1.5rem",
                  borderRadius: "12px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                <Save size={17} /> Save Draft
              </button>

              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="btn-secondary"
                style={{
                  height: "44px",
                  padding: "0 1.5rem",
                  borderRadius: "12px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                <Eye size={17} /> Preview
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  height: "44px",
                  padding: "0 1.75rem",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  textTransform: "none",
                  letterSpacing: "normal",
                }}
              >
                <Send size={17} /> {loading ? "Saving..." : id ? "Update post" : "Publish post"}
              </button>
            </div>
          </form>
        </div>

        {/* REAL-TIME PREVIEW MODAL */}
        <PostPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          title={title}
          excerpt={excerpt}
          category={category === "Other" ? (customCategory.trim() || "Other") : category}
          categories={categories}
          selectedTags={selectedTopics}
          allTags={allTags}
          featuredImage={featuredImage}
          imageFile={imageFile}
        />
      </div>
    </>
  );
};

export default CreateEditPost;
