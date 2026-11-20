import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminApi } from "../api.js";
import "../admin.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      <div className="admin-login">
        <div className="admin-login-card">
          <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--acc)" }}>
            PORTFOLIO ADMIN
          </span>
          <h1 style={{ margin: "0.4rem 0 0.5rem", fontSize: "1.75rem" }}>Sign in</h1>
          <p style={{ margin: "0 0 1.5rem", color: "var(--muted)", fontSize: "0.92rem" }}>
            Enter your admin credentials to manage your portfolio.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="admin-field">
              Email
              <input
                type="email"
                className="admin-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </label>
            <label className="admin-field">
              Password
              <input
                type="password"
                className="admin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error && (
              <div style={{ padding: "0.75rem", borderRadius: "0.75rem", background: "#fee2e2", color: "#991b1b", fontSize: "0.88rem", marginBottom: "1rem" }}>
                {error}
              </div>
            )}

            <button type="submit" className="admin-btn admin-btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
            <Link to="/" style={{ color: "var(--muted)", fontSize: "0.88rem", textDecoration: "none" }}>
              ← Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
