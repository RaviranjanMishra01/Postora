import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, PenTool, LayoutDashboard, User, Bookmark, LogOut, X, ChevronDown, Sun, Moon, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { notificationApi, searchApi } from "../api/commentInteractionApi";
import { categoryApi } from "../api/categoryTagApi";
import NotificationDrawer from "./NotificationDrawer";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const searchContainerRef = useRef(null);

  // Fetch real database categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getCategories();
        setCategories(res.data?.categories || []);
      } catch (err) {
        console.error("Error fetching categories for navbar:", err);
      }
    };
    fetchCategories();
  }, []);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await notificationApi.getNotifications();
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchModalOpen(false);
  }, [location.pathname]);

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          const res = await searchApi.getSuggestions({ q: searchQuery });
          setSuggestions(res.data.suggestions || []);
          setShowSuggestions(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setIsSearchModalOpen(false);
    }
  };

  const navLinkStyle = (path) => ({
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: location.pathname === path ? "#FF497C" : "var(--text-primary)",
    transition: "color 150ms ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
  });

  const leftNavCategories = categories.slice(0, 3);
  const rightNavCategories = categories.slice(3, 6);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 900,
          background: "var(--bg-primary)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "76px",
          }}
        >
          {/* LEFT GROUP: Hamburger Menu Icon + Dynamic Category Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#FF497C",
                color: "#FFFFFF",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(255, 73, 124, 0.25)",
              }}
              title="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <Link to="/" style={navLinkStyle("/")}>HOME</Link>
              {leftNavCategories.map((cat) => (
                <Link key={cat._id} to={`/category/${cat.slug}`} style={navLinkStyle(`/category/${cat.slug}`)}>
                  {cat.name}
                </Link>
              ))}
              {categories.length > 6 && (
                <Link to="/categories" style={navLinkStyle("/categories")}>
                  MORE <ChevronDown size={12} />
                </Link>
              )}
            </nav>
          </div>

          {/* CENTER: Vibrant Carrino Brand Logo */}
          <Link
            to="/"
            style={{
              fontSize: "2.1rem",
              fontWeight: 900,
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.04em",
              color: "#FF497C",
              lineHeight: 1,
            }}
          >
            carrino
          </Link>

          {/* RIGHT GROUP: Dynamic Category Links + Search Button + Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              {rightNavCategories.map((cat) => (
                <Link key={cat._id} to={`/category/${cat.slug}`} style={navLinkStyle(`/category/${cat.slug}`)}>
                  {cat.name}
                </Link>
              ))}
              <Link to="/tags" style={navLinkStyle("/tags")}>TAGS</Link>
            </nav>

            {/* Circular Search Icon Button */}
            <button
              onClick={() => setIsSearchModalOpen(!isSearchModalOpen)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#FF497C",
                color: "#FFFFFF",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(255, 73, 124, 0.25)",
              }}
              title="Search publication"
            >
              <Search size={18} />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-primary)",
                cursor: "pointer",
                padding: "0.25rem",
                display: "flex",
                alignItems: "center",
              }}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {user ? (
              <>
                {/* Author Create Post */}
                <Link to="/create-post" className="btn-primary" style={{ padding: "0.4rem 0.85rem", fontSize: "0.75rem" }}>
                  <PenTool size={13} /> WRITE
                </Link>

                {/* Notification Bell */}
                <button
                  onClick={() => setIsNotifOpen(true)}
                  style={{
                    position: "relative",
                    background: "none",
                    border: "none",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    padding: "0.25rem",
                  }}
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-2px",
                        right: "-2px",
                        background: "#FF497C",
                        color: "#FFFFFF",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        width: "15px",
                        height: "15px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid #FF497C" }}
                      />
                    ) : (
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#FF497C", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem" }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {isDropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "120%",
                        right: 0,
                        width: "190px",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "12px",
                        padding: "0.4rem 0",
                        zIndex: 1000,
                        boxShadow: "var(--shadow-subtle)",
                      }}
                    >
                      <div style={{ padding: "0.4rem 0.85rem", borderBottom: "1px solid var(--border-color)", marginBottom: "0.2rem" }}>
                        <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>{user.name}</p>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "capitalize" }}>Role: {user.role}</span>
                      </div>

                      <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0.85rem", fontSize: "0.82rem", color: "var(--text-primary)" }}>
                        <LayoutDashboard size={14} color="#FF497C" /> Dashboard
                      </Link>

                      <Link to="/profile" onClick={() => setIsDropdownOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0.85rem", fontSize: "0.82rem", color: "var(--text-primary)" }}>
                        <User size={14} /> Profile Settings
                      </Link>

                      <Link to="/bookmarks" onClick={() => setIsDropdownOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0.85rem", fontSize: "0.82rem", color: "var(--text-primary)" }}>
                        <Bookmark size={14} /> Saved Bookmarks
                      </Link>

                      {["admin", "superadmin"].includes(user.role) && (
                        <Link to="/admin" onClick={() => setIsDropdownOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0.85rem", fontSize: "0.82rem", color: "var(--text-primary)" }}>
                          <LayoutDashboard size={14} /> Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          background: "none",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.45rem 0.85rem",
                          fontSize: "0.82rem",
                          color: "#f87171",
                          cursor: "pointer",
                          borderTop: "1px solid var(--border-color)",
                          marginTop: "0.2rem",
                        }}
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-secondary" style={{ padding: "0.4rem 0.85rem", fontSize: "0.75rem" }}>
                LOG IN
              </Link>
            )}
          </div>
        </div>

        {/* Modal Search Popup Bar */}
        {isSearchModalOpen && (
          <div
            ref={searchContainerRef}
            style={{
              background: "var(--bg-secondary)",
              borderBottom: "1px solid var(--border-color)",
              padding: "0.85rem 1.5rem",
              position: "relative",
            }}
          >
            <div className="container" style={{ position: "relative" }}>
              <form onSubmit={handleSearchSubmit}>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Search size={18} style={{ position: "absolute", left: "14px", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    placeholder="Search articles, categories, authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    style={{
                      width: "100%",
                      padding: "0.7rem 2.5rem 0.7rem 2.6rem",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)",
                      fontSize: "0.95rem",
                      outline: "none",
                    }}
                  />
                  <X
                    size={18}
                    onClick={() => setIsSearchModalOpen(false)}
                    style={{ position: "absolute", right: "14px", color: "var(--text-muted)", cursor: "pointer" }}
                  />
                </div>
              </form>

              {/* Suggestions Popup */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "115%",
                    left: 0,
                    right: 0,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    padding: "0.5rem 0",
                    zIndex: 999,
                    boxShadow: "var(--shadow-subtle)",
                  }}
                >
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        if (item.type === "post") navigate(`/post/${item.slug}`);
                        else navigate(`/search?q=${encodeURIComponent(item.title)}`);
                        setShowSuggestions(false);
                        setIsSearchModalOpen(false);
                      }}
                      style={{
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        display: "flex",
                        justifyContent: "space-between",
                        color: "var(--text-primary)",
                        borderBottom: index < suggestions.length - 1 ? "1px solid var(--border-color)" : "none",
                      }}
                    >
                      <span>{item.title}</span>
                      <span style={{ fontSize: "0.68rem", color: "#FF497C", textTransform: "uppercase", fontWeight: 700 }}>{item.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Slide-Out Drawer */}
        {isMobileMenuOpen && (
          <div
            style={{
              background: "var(--bg-primary)",
              borderBottom: "1px solid var(--border-color)",
              padding: "1rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
            }}
          >
            <Link to="/" style={navLinkStyle("/")}>Home</Link>
            {categories.map((cat) => (
              <Link key={cat._id} to={`/category/${cat.slug}`} style={navLinkStyle(`/category/${cat.slug}`)}>
                {cat.name}
              </Link>
            ))}
            <Link to="/tags" style={navLinkStyle("/tags")}>Tags</Link>
            {user && <Link to="/feed" style={navLinkStyle("/feed")}>Following Feed</Link>}
            {user && (
              <Link to="/create-post" style={navLinkStyle("/create-post")}>Create Post</Link>
            )}
            <Link to="/contact" style={navLinkStyle("/contact")}>Contact</Link>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 992px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>

      {/* Notification Drawer */}
      <NotificationDrawer
        notifications={notifications}
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onRefresh={fetchNotifications}
      />
    </>
  );
};

export default Navbar;