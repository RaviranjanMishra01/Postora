import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, PenTool, LayoutDashboard, User, Bookmark, LogOut, X, Sun, Moon, Menu, ExternalLink } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { notificationApi, searchApi } from "../api/commentInteractionApi";
import NotificationDrawer from "./NotificationDrawer";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Body scroll lock when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Notifications polling
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

  // Close menus on location/route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchModalOpen(false);
    setIsDropdownOpen(false);
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
    fontSize: "0.82rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: location.pathname === path ? "#FF497C" : "var(--text-primary)",
    textDecoration: "none",
    transition: "color 150ms ease",
  });

  return (
    <>
      <header className="site-header">
        <div className="container header-container">
          
          {/* LEFT GROUP (Desktop Essential Links + Mobile Hamburger Icon) */}
          <div className="header-left-group">
            {/* Mobile Hamburger Button - HIDDEN ON DESKTOP VIA CSS */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-hamburger-btn"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Desktop Navigation Links */}
            <nav className="desktop-nav-links">
              <Link to="/" style={navLinkStyle("/")}>HOME</Link>
              {user && (
                <Link to="/feed" style={navLinkStyle("/feed")}>FOLLOWING FEED</Link>
              )}
              <Link to="/contact" style={navLinkStyle("/contact")}>CONTACT</Link>
            </nav>
          </div>

          {/* CENTER: Brand Logo */}
          <Link to="/" className="header-brand-logo">
            Postora
          </Link>

          {/* RIGHT GROUP: Header Controls */}
          <div className="header-right-group">
            {/* Search Icon Button */}
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(!isSearchModalOpen)}
              className="header-action-circle-btn"
              title="Search publication"
            >
              <Search size={18} />
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="header-icon-btn"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {user ? (
              <>
                {/* Author Write Button */}
                <Link to="/create-post" className="btn-primary write-post-btn">
                  <PenTool size={13} /> WRITE
                </Link>

                {/* Notification Bell */}
                <button
                  type="button"
                  onClick={() => setIsNotifOpen(true)}
                  className="header-icon-btn notif-btn"
                  title="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount}</span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="avatar-dropdown-btn"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="nav-avatar-img"
                      />
                    ) : (
                      <div className="nav-avatar-fallback">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {isDropdownOpen && (
                    <div className="nav-dropdown-menu">
                      <div className="dropdown-user-header">
                        <p className="dropdown-user-name">{user.name}</p>
                        <span className="dropdown-user-role">Role: {user.role}</span>
                      </div>

                      {["admin", "superadmin"].includes(user.role) ? (
                        <>
                          <Link to="/admin/dashboard" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            <LayoutDashboard size={14} color="var(--Postora-pink)" /> {user.role === "superadmin" ? "Super Admin Dashboard" : "Admin Dashboard"}
                          </Link>

                          <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            <User size={14} /> Profile Settings
                          </Link>

                          <Link to="/" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            <ExternalLink size={14} /> View Public Website ↗
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to="/dashboard" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            <LayoutDashboard size={14} color="var(--Postora-pink)" /> Dashboard
                          </Link>

                          <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            <User size={14} /> Profile Settings
                          </Link>

                          <Link to="/bookmarks" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            <Bookmark size={14} /> Saved Bookmarks
                          </Link>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="dropdown-item dropdown-logout-btn"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-secondary nav-login-btn">
                LOG IN
              </Link>
            )}
          </div>
        </div>

        {/* Modal Search Popup Bar */}
        {isSearchModalOpen && (
          <div ref={searchContainerRef} className="nav-search-bar-modal">
            <div className="container" style={{ position: "relative" }}>
              <form onSubmit={handleSearchSubmit}>
                <div className="search-input-wrapper">
                  <Search size={18} className="search-input-icon" />
                  <input
                    type="text"
                    placeholder="Search articles, categories, authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="search-modal-input"
                  />
                  <X
                    size={18}
                    onClick={() => setIsSearchModalOpen(false)}
                    className="search-close-icon"
                  />
                </div>
              </form>

              {/* Suggestions Popup */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions-box">
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        if (item.type === "post") navigate(`/post/${item.slug}`);
                        else navigate(`/search?q=${encodeURIComponent(item.title)}`);
                        setShowSuggestions(false);
                        setIsSearchModalOpen(false);
                      }}
                      className="suggestion-row-item"
                    >
                      <span>{item.title}</span>
                      <span className="suggestion-type-tag">{item.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MOBILE SLIDE-OUT MENU DRAWER */}
        {isMobileMenuOpen && (
          <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-drawer-header">
                <span className="drawer-title">Navigation</span>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-drawer-close-btn"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="mobile-drawer-links">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`mobile-menu-item ${location.pathname === "/" ? "active" : ""}`}
                >
                  HOME
                </Link>

                {user && (
                  <Link
                    to="/feed"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`mobile-menu-item ${location.pathname === "/feed" ? "active" : ""}`}
                  >
                    FOLLOWING FEED
                  </Link>
                )}

                {user && (
                  <Link
                    to="/create-post"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`mobile-menu-item ${location.pathname === "/create-post" ? "active" : ""}`}
                  >
                    CREATE POST
                  </Link>
                )}

                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`mobile-menu-item ${location.pathname === "/contact" ? "active" : ""}`}
                >
                  CONTACT
                </Link>

                {!user && (
                  <div className="mobile-auth-buttons">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-secondary mobile-auth-btn"
                    >
                      LOG IN
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-primary mobile-auth-btn"
                    >
                      REGISTER
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* STYLES (Enforcing Responsive Navigation, Mobile Drawer & No Desktop Hamburger) */}
      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 900;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 76px;
        }

        .header-left-group {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .desktop-nav-links {
          display: flex;
          align-items: center;
          gap: 1.75rem;
        }

        .header-brand-logo {
          font-size: 2.1rem;
          font-weight: 900;
          font-family: var(--font-heading);
          letter-spacing: -0.04em;
          color: #FF497C;
          line-height: 1;
          text-decoration: none;
        }

        .header-right-group {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .mobile-hamburger-btn {
          display: none; /* Default hidden on Desktop */
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #FF497C;
          color: #FFFFFF;
          border: none;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(255, 73, 124, 0.25);
          transition: transform 0.15s ease;
        }

        .mobile-hamburger-btn:active {
          transform: scale(0.95);
        }

        .header-action-circle-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #FF497C;
          color: #FFFFFF;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(255, 73, 124, 0.25);
        }

        .header-icon-btn {
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          position: relative;
        }

        .notif-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #FF497C;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 800;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .write-post-btn {
          padding: 0.4rem 0.85rem;
          font-size: 0.75rem;
        }

        .nav-login-btn {
          padding: 0.4rem 0.85rem;
          font-size: 0.75rem;
        }

        .avatar-dropdown-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: none;
          border: none;
          cursor: pointer;
        }

        .nav-avatar-img {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid #FF497C;
        }

        .nav-avatar-fallback {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #FF497C;
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .nav-dropdown-menu {
          position: absolute;
          top: 120%;
          right: 0;
          width: 190px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0.4rem 0;
          z-index: 1000;
          box-shadow: var(--shadow-subtle);
        }

        .dropdown-user-header {
          padding: 0.4rem 0.85rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 0.2rem;
        }

        .dropdown-user-name {
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-primary);
          margin: 0;
        }

        .dropdown-user-role {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: capitalize;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.85rem;
          font-size: 0.82rem;
          color: var(--text-primary);
          text-decoration: none;
          transition: background 0.15s ease;
        }

        .dropdown-item:hover {
          background: var(--bg-secondary);
        }

        .dropdown-logout-btn {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          color: #f87171;
          cursor: pointer;
          border-top: 1px solid var(--border-color);
          margin-top: 0.2rem;
        }

        /* SEARCH MODAL */
        .nav-search-bar-modal {
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          padding: 0.85rem 1.5rem;
          position: relative;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }

        .search-close-icon {
          position: absolute;
          right: 14px;
          color: var(--text-muted);
          cursor: pointer;
        }

        .search-modal-input {
          width: 100%;
          padding: 0.7rem 2.5rem 0.7rem 2.6rem;
          border-radius: var(--radius-sm);
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-size: 0.95rem;
          outline: none;
        }

        .search-suggestions-box {
          position: absolute;
          top: 115%;
          left: 0;
          right: 0;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0.5rem 0;
          z-index: 999;
          box-shadow: var(--shadow-subtle);
        }

        .suggestion-row-item {
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-size: 0.85rem;
          display: flex;
          justify-content: space-between;
          color: var(--text-primary);
        }

        .suggestion-type-tag {
          font-size: 0.68rem;
          color: #FF497C;
          text-transform: uppercase;
          font-weight: 700;
        }

        /* MOBILE DRAWER OVERLAY */
        .mobile-drawer-overlay {
          position: fixed;
          top: 76px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 999;
          display: flex;
          flex-direction: column;
        }

        .mobile-drawer-content {
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          padding: 1.25rem 1.5rem 2rem 1.5rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          animation: drawerSlideDown 0.2s ease-out;
        }

        @keyframes drawerSlideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .mobile-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-color);
        }

        .drawer-title {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .mobile-drawer-close-btn {
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }

        .mobile-drawer-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-menu-item {
          display: flex;
          align-items: center;
          min-height: 48px;
          padding: 0 0.85rem;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--text-primary);
          text-decoration: none;
          border-radius: 8px;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .mobile-menu-item:hover, .mobile-menu-item.active {
          background: var(--bg-secondary);
          color: #FF497C;
        }

        .mobile-auth-buttons {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .mobile-auth-btn {
          flex: 1;
          text-align: center;
          justify-content: center;
          min-height: 44px;
          display: flex;
          align-items: center;
        }

        /* MEDIA QUERIES: DESKTOP VS MOBILE */
        @media (max-width: 991px) {
          .desktop-nav-links {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }

        @media (max-width: 576px) {
          .write-post-btn {
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