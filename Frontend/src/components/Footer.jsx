import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Share2, Globe, Mail, MessageCircle, Heart } from "lucide-react";
import { categoryApi } from "../api/categoryTagApi";

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getCategories();
        setCategories(res.data?.categories || []);
      } catch (err) {
        console.error("Error fetching categories for footer:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer
      style={{
        background: "var(--bg-primary)",
        borderTop: "1px solid var(--border-color)",
        paddingTop: "3.5rem",
        paddingBottom: "2rem",
        marginTop: "4rem",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2.5rem",
            paddingBottom: "3rem",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          {/* Column 1: Brand Info */}
          <div>
            <Link
              to="/"
              style={{
                fontSize: "2rem",
                fontWeight: 900,
                fontFamily: "var(--font-heading)",
                letterSpacing: "-0.04em",
                color: "#FF497C",
                display: "inline-block",
                marginBottom: "0.85rem",
              }}
            >
              carrino
            </Link>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.6, maxWidth: "280px" }}>
              A modern publishing magazine platform for creative authors who love to read, write, and share ideas.
            </p>
          </div>

          {/* Column 2: Dynamic Database Categories */}
          <div>
            <h4
              style={{
                fontSize: "0.88rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "1.1rem",
              }}
            >
              Categories
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {categories.length > 0 ? (
                categories.slice(0, 6).map((cat) => (
                  <li key={cat._id}>
                    <Link to={`/category/${cat.slug}`}>{cat.name}</Link>
                  </li>
                ))
              ) : (
                <li><Link to="/categories">Browse All Categories</Link></li>
              )}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4
              style={{
                fontSize: "0.88rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "1.1rem",
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/create-post">Write For Us</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 4: Follow Us & Social Icons */}
          <div>
            <h4
              style={{
                fontSize: "0.88rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "1.1rem",
              }}
            >
              Follow Us
            </h4>

            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.5rem" }}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#213448",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Facebook"
              >
                <Globe size={16} />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#213448",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Twitter"
              >
                <MessageCircle size={16} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#213448",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Instagram"
              >
                <Share2 size={16} />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#213448",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Newsletter"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Line */}
        <div
          style={{
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
          }}
        >
          <p>© {new Date().getFullYear()} Carrino. All Rights Reserved.</p>
          <p style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            Designed with <Heart size={13} fill="#FF497C" color="#FF497C" /> by ThemeZaa
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
