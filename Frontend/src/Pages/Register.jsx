import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, AtSign, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "../context/ToastContext";
import GoogleSignInButton from "../components/GoogleSignInButton";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !email.trim() || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username.trim())) {
      toast.error("Username must be 3-30 characters long and contain only letters, numbers, and underscores");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await register({ name: name.trim(), username: username.trim(), email: email.trim(), password });
      toast.success(res.message || "Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "2rem" }}>
      <div className="glass-card" style={{ width: "100%", maxWidth: "460px", padding: "2.5rem", background: "var(--bg-card)" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto" }}>
            <Sparkles size={24} color="var(--text-inverse)" />
          </div>
          <h2 style={{ fontSize: "1.75rem", color: "var(--text-primary)" }}>Create Account</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "0.25rem" }}>Join our community of authors and readers</p>
        </div>

        {/* Continue with Google Button */}
        <div style={{ marginBottom: "1.25rem" }}>
          <GoogleSignInButton text="Sign up with Google" />
        </div>

        <div style={{ display: "flex", alignItems: "center", margin: "1.25rem 0", gap: "0.75rem" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color, #334155)" }}></div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted, #94a3b8)", textTransform: "uppercase" }}>OR</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color, #334155)" }}></div>
        </div>

        <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>Full Name</label>
            <div style={{ position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Ravi Mishra"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.4rem", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", outline: "none" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>Username</label>
            <div style={{ position: "relative" }}>
              <AtSign size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="ravimishra"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.4rem", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", outline: "none" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="email"
                placeholder="ravi@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.4rem", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", outline: "none" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.4rem", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", outline: "none" }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "0.75rem", marginTop: "0.5rem" }}>
            <UserPlus size={18} /> {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--accent-secondary)", fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
