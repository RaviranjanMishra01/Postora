import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PenTool, Globe, Save } from "lucide-react";
import { postApi } from "../api/postApi";
import { categoryApi, tagApi } from "../api/categoryTagApi";
import RichTextEditor from "../components/RichTextEditor";
import { toast } from "react-toastify";

const CreateEditPost = () => {
  const { id } = useParams(); // If present, edit mode
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [status, setStatus] = useState("published");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(false);

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
              setContent(post.content || "");
              setFeaturedImage(post.featuredImage || "");
              setCategory(post.category?._id || post.category || "");
              setSelectedTags(post.tags ? post.tags.map((t) => t._id || t) : []);
              setStatus(post.status || "published");
              setSeoTitle(post.seoTitle || "");
              setSeoDescription(post.seoDescription || "");
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
        console.error("Error initializing dropdowns:", err);
      }
    };

    initData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a post title");
      return;
    }
    if (!content || !content.replace(/<[^>]*>/g, "").trim()) {
      toast.error("Please enter article body content");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("status", status);
      formData.append("seoTitle", seoTitle || title);
      formData.append("seoDescription", seoDescription || excerpt);

      selectedTags.forEach((tId) => formData.append("tags", tId));

      if (imageFile) {
        formData.append("featuredImage", imageFile);
      } else if (featuredImage) {
        formData.append("featuredImage", featuredImage);
      }

      if (id) {
        const res = await postApi.updatePost(id, formData);
        toast.success("Post updated successfully!");
        navigate(`/post/${res.data.post.slug}`);
      } else {
        const res = await postApi.createPost(formData);
        toast.success("Post published successfully!");
        navigate(`/post/${res.data.post.slug}`);
      }
    } catch (err) {
      toast.error(err.message || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "var(--radius-md)",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    outline: "none",
    fontSize: "1rem",
  };

  if (fetchingPost) {
    return (
      <div className="container" style={{ paddingTop: "5rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Loading article details...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: "1000px", paddingTop: "2.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--text-primary)" }}>
          <PenTool size={26} /> {id ? "Edit Post" : "Create New Post"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        {/* Title */}
        <div>
          <label style={{ display: "block", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
            Post Title *
          </label>
          <input
            type="text"
            placeholder="Enter article title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        {/* Excerpt */}
        <div>
          <label style={{ display: "block", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
            Summary / Excerpt
          </label>
          <textarea
            rows={2}
            placeholder="Brief overview of what this article covers..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            style={{ ...inputStyle, resize: "none" }}
          />
        </div>

        {/* Category & Status Selection */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={inputStyle}
              required
            >
              <option value="">-- Select a Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
              Publishing Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="published">Published</option>
              <option value="draft">Save as Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label style={{ display: "block", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
            Featured Image (Upload file or URL)
          </label>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={featuredImage}
              onChange={(e) => {
                setFeaturedImage(e.target.value);
                setImageFile(null);
              }}
              style={{ ...inputStyle, flexGrow: 1 }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
              style={{ color: "var(--text-secondary)", padding: "0.5rem 0" }}
            />
          </div>
        </div>

        {/* Tags Selection */}
        <div>
          <label style={{ display: "block", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
            Select Tags
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {allTags.map((t) => {
              const isSelected = selectedTags.includes(t._id);
              return (
                <button
                  type="button"
                  key={t._id}
                  onClick={() => handleTagToggle(t._id)}
                  style={{
                    padding: "0.35rem 0.75rem",
                    borderRadius: "var(--radius-sm)",
                    background: isSelected ? "var(--btn-primary-bg)" : "var(--bg-secondary)",
                    color: isSelected ? "var(--btn-primary-text)" : "var(--text-secondary)",
                    border: "1px solid var(--border-color)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  #{t.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <label style={{ display: "block", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
            Article Body Content *
          </label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        {/* SEO Metadata Box */}
        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <h4 style={{ fontSize: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)" }}>
            <Globe size={18} /> SEO & Meta Configuration
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="text"
              placeholder="SEO Title tag (defaults to post title)"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              style={inputStyle}
            />
            <textarea
              rows={2}
              placeholder="SEO Meta Description (defaults to summary excerpt)"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>
        </div>

        {/* Submit Action */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginBottom: "3rem" }}>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            <Save size={18} /> {loading ? "Saving..." : id ? "Update Post" : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditPost;
