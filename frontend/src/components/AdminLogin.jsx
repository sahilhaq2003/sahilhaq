import { useState } from "react";
import { api } from "../api/client.js";

export default function AdminLogin({ onNavigate }) {
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!key.trim()) {
      setError("Please enter your admin key.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.verifyAdmin(key.trim());
      sessionStorage.setItem("admin_key", key.trim());
      onNavigate("/admin");
    } catch (err) {
      setError(err.message || "Invalid admin key");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.badge}>ADMIN ACCESS</span>
          <h1 style={styles.title}>Portfolio CMS</h1>
          <p style={styles.subtitle}>Sign in with your admin key to manage projects, site config, and messages.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Admin Key
            <div style={styles.inputWrap}>
              <input
                type={show ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter ADMIN_KEY from backend/.env"
                style={styles.input}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                style={styles.toggleBtn}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Verifying..." : "Sign In to Dashboard"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => onNavigate("/")}
          style={styles.backLink}
        >
          ← Back to Portfolio
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0f",
    color: "#f4f4f5",
    padding: "24px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#13131a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
  },
  header: { marginBottom: "24px" },
  badge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#38bdf8",
    background: "rgba(56,189,248,0.12)",
    padding: "4px 10px",
    borderRadius: "999px",
    marginBottom: "12px",
  },
  title: { margin: "0 0 8px", fontSize: "24px", fontWeight: 700 },
  subtitle: { margin: 0, fontSize: "14px", color: "#a1a1aa", lineHeight: 1.5 },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  label: { display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", fontWeight: 500, color: "#d4d4d8" },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  input: {
    width: "100%",
    padding: "12px 64px 12px 14px",
    background: "#0a0a0f",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  },
  toggleBtn: {
    position: "absolute",
    right: "10px",
    background: "transparent",
    border: "none",
    color: "#a1a1aa",
    fontSize: "12px",
    cursor: "pointer",
    padding: "4px 8px",
  },
  error: {
    padding: "10px 12px",
    borderRadius: "8px",
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#fca5a5",
    fontSize: "13px",
  },
  submitBtn: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#38bdf8",
    color: "#09090b",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "4px",
  },
  backLink: {
    marginTop: "20px",
    background: "transparent",
    border: "none",
    color: "#a1a1aa",
    fontSize: "13px",
    cursor: "pointer",
    padding: 0,
    display: "block",
  },
};
