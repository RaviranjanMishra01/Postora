import React from "react";
import { Bold, Italic, Underline, Heading1, Heading2, Quote, Code, List, Image, Video, Link as LinkIcon } from "lucide-react";

const RichTextEditor = ({ value, onChange }) => {
  const insertFormatting = (tagStart, tagEnd = "") => {
    const textarea = document.getElementById("content-textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = tagStart + selectedText + tagEnd;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);
  };

  const handleInsertImage = () => {
    const url = prompt("Enter Image URL:");
    if (url) {
      insertFormatting(`<img src="${url}" alt="Post image" style="width:100%; border-radius:12px; margin:1.5rem 0;" />\n`);
    }
  };

  const handleInsertYoutube = () => {
    const url = prompt("Enter YouTube Embed Link or Video ID:");
    if (url) {
      const videoId = url.includes("v=") ? url.split("v=")[1].split("&")[0] : url.split("/").pop();
      insertFormatting(`<div style="position:relative; padding-bottom:56.25%; height:0; margin:1.5rem 0; overflow:hidden; border-radius:12px;"><iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;" allowfullscreen></iframe></div>\n`);
    }
  };

  return (
    <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "rgba(15, 23, 42, 0.6)" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", padding: "0.6rem", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border-color)" }}>
        <button type="button" onClick={() => insertFormatting("<h1>", "</h1>")} className="btn-secondary" style={{ padding: "0.35rem 0.6rem" }} title="Heading 1"><Heading1 size={16} /></button>
        <button type="button" onClick={() => insertFormatting("<h2>", "</h2>")} className="btn-secondary" style={{ padding: "0.35rem 0.6rem" }} title="Heading 2"><Heading2 size={16} /></button>
        <button type="button" onClick={() => insertFormatting("<strong>", "</strong>")} className="btn-secondary" style={{ padding: "0.35rem 0.6rem" }} title="Bold"><Bold size={16} /></button>
        <button type="button" onClick={() => insertFormatting("<em>", "</em>")} className="btn-secondary" style={{ padding: "0.35rem 0.6rem" }} title="Italic"><Italic size={16} /></button>
        <button type="button" onClick={() => insertFormatting("<u>", "</u>")} className="btn-secondary" style={{ padding: "0.35rem 0.6rem" }} title="Underline"><Underline size={16} /></button>
        <button type="button" onClick={() => insertFormatting("<blockquote>", "</blockquote>")} className="btn-secondary" style={{ padding: "0.35rem 0.6rem" }} title="Blockquote"><Quote size={16} /></button>
        <button type="button" onClick={() => insertFormatting("<pre><code>", "</code></pre>")} className="btn-secondary" style={{ padding: "0.35rem 0.6rem" }} title="Code Block"><Code size={16} /></button>
        <button type="button" onClick={() => insertFormatting("<ul>\n  <li>", "</li>\n</ul>")} className="btn-secondary" style={{ padding: "0.35rem 0.6rem" }} title="List"><List size={16} /></button>
        <button type="button" onClick={handleInsertImage} className="btn-secondary" style={{ padding: "0.35rem 0.6rem" }} title="Insert Image"><Image size={16} /></button>
        <button type="button" onClick={handleInsertYoutube} className="btn-secondary" style={{ padding: "0.35rem 0.6rem" }} title="YouTube Video"><Video size={16} /></button>
      </div>

      {/* Editor Input */}
      <textarea
        id="content-textarea"
        rows={16}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your article content using HTML formatting or toolbar actions..."
        style={{
          width: "100%",
          padding: "1rem",
          background: "transparent",
          border: "none",
          color: "var(--text-primary)",
          fontSize: "0.95rem",
          fontFamily: "var(--font-body)",
          resize: "vertical",
          outline: "none",
        }}
      />
    </div>
  );
};

export default RichTextEditor;
