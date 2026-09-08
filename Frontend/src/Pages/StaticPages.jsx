import React, { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";
import { contactApi } from "../api/commentInteractionApi";
import { toast } from "../context/ToastContext";

export const AboutPage = () => (
  <div className="container" style={{ maxWidth: "800px", paddingTop: "3rem" }}>
    <h1 className="gradient-text" style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>About MERN Blog</h1>
    <div style={{ color: "#e2e8f0", lineHeight: 1.8, fontSize: "1.05rem" }}>
      <p style={{ marginBottom: "1.25rem" }}>
        MERN Blog is an open-source, enterprise-grade publishing platform engineered for developers, technical writers, and content creators. Built using MongoDB, Express.js, React 19, and Node.js.
      </p>
      <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>Platform Highlights</h3>
      <ul style={{ paddingLeft: "1.5rem", marginBottom: "2rem" }}>
        <li>Role-based access control (User, Author, Admin, SuperAdmin)</li>
        <li>JWT security with HTTP-only cookie authentication</li>
        <li>Nested comments, moderation reporting, and spam protection</li>
        <li>Dynamic SEO optimization, dynamic sitemaps, and OpenGraph metadata</li>
        <li>High-performance media handling and CDN distribution</li>
      </ul>
    </div>
  </div>
);

export const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactApi.sendMessage({ name, email, subject, message });
      toast.success("Your message has been sent to our team!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "700px", paddingTop: "3rem" }}>
      <h1 className="gradient-text" style={{ fontSize: "2.3rem", marginBottom: "0.5rem" }}>Contact Us</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Have questions, feedback, or business inquiries? Send us a message below.
      </p>

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-color)", color: "#fff" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-color)", color: "#fff" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>Subject</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-color)", color: "#fff" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>Message</label>
          <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-color)", color: "#fff", resize: "vertical" }} />
        </div>
        <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: "center" }}>
          <Send size={16} /> Send Message
        </button>
      </form>
    </div>
  );
};

export const PrivacyPage = () => (
  <div className="container" style={{ maxWidth: "800px", paddingTop: "3rem", color: "#e2e8f0", lineHeight: 1.8 }}>
    <h1 className="gradient-text" style={{ fontSize: "2.3rem", marginBottom: "1.5rem" }}>Privacy Policy</h1>
    <p>We take your privacy seriously. This document outlines how user information is handled on MERN Blog.</p>
    <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>Data Collection</h3>
    <p>We store user registration data (name, email, hashed password) securely in our MongoDB database. Session tokens are maintained via HTTP-only secure cookies.</p>
  </div>
);

export const TermsPage = () => (
  <div className="container" style={{ maxWidth: "800px", paddingTop: "3rem", color: "#e2e8f0", lineHeight: 1.8 }}>
    <h1 className="gradient-text" style={{ fontSize: "2.3rem", marginBottom: "1.5rem" }}>Terms of Service</h1>
    <p>By accessing MERN Blog, you agree to comply with our community guidelines and moderation policies.</p>
  </div>
);

export const CookiePage = () => (
  <div className="container" style={{ maxWidth: "800px", paddingTop: "3rem", color: "#e2e8f0", lineHeight: 1.8 }}>
    <h1 className="gradient-text" style={{ fontSize: "2.3rem", marginBottom: "1.5rem" }}>Cookie Policy</h1>
    <p>We use essential HTTP-only cookies to keep you safely logged in. We do not sell tracking cookies to third parties.</p>
  </div>
);

export const DisclaimerPage = () => (
  <div className="container" style={{ maxWidth: "800px", paddingTop: "3rem", color: "#e2e8f0", lineHeight: 1.8 }}>
    <h1 className="gradient-text" style={{ fontSize: "2.3rem", marginBottom: "1.5rem" }}>Disclaimer</h1>
    <p>Content published on MERN Blog reflects the opinions of individual authors and does not constitute professional advice.</p>
  </div>
);
