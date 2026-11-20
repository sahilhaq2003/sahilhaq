import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminApi } from "../api.js";
import "../admin.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminApi.login(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin">
      <div className="admin-login-split">
        <div className="admin-login-showcase">
          <div className="admin-login-orb" aria-hidden="true" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <span className="admin-pill-badge">SAHIL HAQ · PORTFOLIO CMS</span>
            <h2 className="admin-showcase-title">
              Manage every pixel, project &amp; insight in one place.
            </h2>
            <p className="admin-showcase-sub">
              Update your experience, certifications, projects, and MongoDB-backed media without touching code.
            </p>
            <div className="admin-showcase-grid">
              {[
                ["Projects & Media", "MongoDB-stored screenshots"],
                ["Live Content", "Hero, About, Education"],
                ["Inbox", "Contact messages & replies"],
                ["Protected", "httpOnly JWT · Rate-limited"],
              ].map(([title, desc]) => (
                <div key={title} className="admin-showcase-item">
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-login-panel">
          <div className="admin-login-card">
            <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "#b15f2c" }}>
              ADMIN ACCESS
            </span>
            <h1 style={{ margin: "0.4rem 0 0.45rem", fontSize: "1.85rem", color: "#171412" }}>Welcome back</h1>
            <p style={{ margin: "0 0 1.75rem", color: "#6b645e", fontSize: "0.92rem", lineHeight: 1.5 }}>
              Sign in with your administrator credentials to continue.
            </p>

            <form onSubmit={handleSubmit}>
              <label className="admin-field" style={{ color: "#171412" }}>
                <span>Email address</span>
                <input
                  type="email"
                  className="admin-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </label>

              <label className="admin-field" style={{ color: "#171412" }}>
                <span>Password</span>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="admin-input"
                    style={{ paddingRight: "4.2rem" }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#6b645e",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              {error && (
                <div
                  style={{
                    padding: "0.75rem 0.9rem",
                    borderRadius: "0.85rem",
                    background: "#fee2e2",
                    color: "#991b1b",
                    fontSize: "0.86rem",
                    marginBottom: "1rem",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "0.85rem 1.25rem", fontSize: "0.95rem" }}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In to Dashboard →"}
              </button>
            </form>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <Link to="/" style={{ color: "#6b645e", fontSize: "0.88rem", textDecoration: "none", fontWeight: 500 }}>
                ← Back to Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
