import { useEffect, useState } from "react";
import { api } from "../api/client.js";

const EMPTY_PROJECT = {
  title: "",
  slug: "",
  label: "",
  cats: "",
  desc: "",
  prob: "",
  sol: "",
  arch: "",
  contrib: "",
  features: "",
  tech: "",
  github: "",
  demo: "",
  published: true,
};

export default function AdminDashboard({ onNavigate }) {
  const adminKey = sessionStorage.getItem("admin_key") || "";
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [config, setConfig] = useState({
    github: "", email: "", linkedin: "", fiverr: "", instagram: "", x: "", categories: "",
  });
  const [editing, setEditing] = useState(null); // null | { ...project, _id? }
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminKey) {
      onNavigate("/login");
      return;
    }
    loadAll();
  }, [adminKey]);

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [portfolio, msgs] = await Promise.all([
        api.getPortfolio(),
        api.getMessages(adminKey),
      ]);
      setProjects(portfolio.projects || []);
      setMessages(msgs || []);
      setConfig({
        ...portfolio.config,
        categories: (portfolio.categories || []).join(", "),
      });
    } catch (err) {
      if (err.status === 401) {
        sessionStorage.removeItem("admin_key");
        onNavigate("/login");
        return;
      }
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  function flash(msg) {
    setStatus(msg);
    setTimeout(() => setStatus(""), 3000);
  }

  function openNewProject() {
    setEditing({ ...EMPTY_PROJECT });
  }

  function openEditProject(p) {
    setEditing({
      _id: p._id,
      title: p.title || "",
      slug: p.id || p.slug || "",
      label: p.label || "",
      cats: (p.cats || []).join(", "),
      desc: p.desc || "",
      prob: p.prob || "",
      sol: p.sol || "",
      arch: p.arch || "",
      contrib: p.contrib || "",
      features: (p.features || []).join("\n"),
      tech: (p.tech || []).join(", "),
      github: p.github || "",
      demo: p.demo || "",
      published: p.published !== false,
    });
  }

  async function saveProject(e) {
    e.preventDefault();
    setError("");
    const splitComma = (v) => v.split(",").map((s) => s.trim()).filter(Boolean);
    const splitLines = (v) => v.split("\n").map((s) => s.trim()).filter(Boolean);

    const payload = {
      title: editing.title.trim(),
      slug: editing.slug.trim() || editing.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      label: editing.label.trim(),
      cats: splitComma(editing.cats),
      desc: editing.desc.trim(),
      prob: editing.prob.trim(),
      sol: editing.sol.trim(),
      arch: editing.arch.trim(),
      contrib: editing.contrib.trim(),
      features: splitLines(editing.features),
      tech: splitComma(editing.tech),
      github: editing.github.trim(),
      demo: editing.demo.trim(),
      published: Boolean(editing.published),
    };

    try {
      if (editing._id) {
        await api.updateProject(adminKey, editing._id, payload);
        flash("Project updated!");
      } else {
        await api.createProject(adminKey, payload);
        flash("Project created!");
      }
      setEditing(null);
      await loadAll();
    } catch (err) {
      setError(err.message || "Failed to save project");
    }
  }

  async function removeProject(id) {
    if (!confirm("Delete this project?")) return;
    try {
      await api.deleteProject(adminKey, id);
      flash("Project deleted.");
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveConfig(e) {
    e.preventDefault();
    setError("");
    try {
      await api.updateProfile(adminKey, {
        github: config.github,
        email: config.email,
        linkedin: config.linkedin,
        fiverr: config.fiverr,
        instagram: config.instagram,
        x: config.x,
        categories: config.categories.split(",").map((s) => s.trim()).filter(Boolean),
      });
      flash("Site config saved!");
    } catch (err) {
      setError(err.message || "Failed to save config");
    }
  }

  async function toggleRead(m) {
    try {
      await api.updateMessage(adminKey, m._id, { read: !m.read });
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeMessage(id) {
    if (!confirm("Delete this message?")) return;
    try {
      await api.deleteMessage(adminKey, id);
      flash("Message deleted.");
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    sessionStorage.removeItem("admin_key");
    onNavigate("/login");
  }

  return (
    <div style={s.page}>
      <header style={s.topbar}>
        <div style={s.brand}>
          <span style={s.dot} />
          <strong>Portfolio Admin</strong>
        </div>
        <div style={s.topActions}>
          <button onClick={() => onNavigate("/")} style={s.ghostBtn}>View Site ↗</button>
          <button onClick={logout} style={s.dangerBtn}>Logout</button>
        </div>
      </header>

      <div style={s.container}>
        <nav style={s.tabs}>
          {[
            ["projects", `Projects (${projects.length})`],
            ["config", "Site Config"],
            ["messages", `Messages (${messages.length})`],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{ ...s.tab, ...(tab === id ? s.tabActive : {}) }}
            >
              {label}
            </button>
          ))}
        </nav>

        {status && <div style={s.success}>{status}</div>}
        {error && <div style={s.error}>{error}</div>}

        {loading ? (
          <p style={{ color: "#a1a1aa" }}>Loading...</p>
        ) : (
          <>
            {tab === "projects" && (
              <div>
                <div style={s.sectionHeader}>
                  <h2 style={s.h2}>Manage Projects</h2>
                  <button onClick={openNewProject} style={s.primaryBtn}>+ Add Project</button>
                </div>

                {editing && (
                  <form onSubmit={saveProject} style={s.card}>
                    <h3 style={{ marginTop: 0 }}>{editing._id ? "Edit Project" : "New Project"}</h3>
                    <div style={s.grid2}>
                      <Field label="Title *" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} required />
                      <Field label="Slug (URL id)" value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: v })} placeholder="auto-generated-from-title" />
                      <Field label="Label (e.g. Full-Stack)" value={editing.label} onChange={(v) => setEditing({ ...editing, label: v })} />
                      <Field label="Categories (comma-separated)" value={editing.cats} onChange={(v) => setEditing({ ...editing, cats: v })} placeholder="AI/ML, Full-Stack" />
                      <Field label="GitHub URL" value={editing.github} onChange={(v) => setEditing({ ...editing, github: v })} />
                      <Field label="Live Demo URL" value={editing.demo} onChange={(v) => setEditing({ ...editing, demo: v })} />
                    </div>
                    <Field label="Short Description" value={editing.desc} onChange={(v) => setEditing({ ...editing, desc: v })} textarea />
                    <Field label="Problem Statement" value={editing.prob} onChange={(v) => setEditing({ ...editing, prob: v })} textarea />
                    <Field label="Solution" value={editing.sol} onChange={(v) => setEditing({ ...editing, sol: v })} textarea />
                    <Field label="Architecture" value={editing.arch} onChange={(v) => setEditing({ ...editing, arch: v })} textarea />
                    <Field label="My Contribution" value={editing.contrib} onChange={(v) => setEditing({ ...editing, contrib: v })} textarea />
                    <Field label="Features (one per line)" value={editing.features} onChange={(v) => setEditing({ ...editing, features: v })} textarea />
                    <Field label="Tech Stack (comma-separated)" value={editing.tech} onChange={(v) => setEditing({ ...editing, tech: v })} placeholder="React, Node.js, MongoDB" />
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", margin: "8px 0 16px" }}>
                      <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                      Published on portfolio
                    </label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button type="submit" style={s.primaryBtn}>Save Project</button>
                      <button type="button" onClick={() => setEditing(null)} style={s.ghostBtn}>Cancel</button>
                    </div>
                  </form>
                )}

                <div style={s.list}>
                  {projects.map((p) => (
                    <div key={p._id || p.id} style={s.row}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "15px" }}>{p.title}</div>
                        <div style={{ fontSize: "13px", color: "#a1a1aa", marginTop: "4px" }}>
                          {p.label || "Project"} • {(p.tech || []).slice(0, 5).join(", ")}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => openEditProject(p)} style={s.ghostBtn}>Edit</button>
                        <button onClick={() => removeProject(p._id)} style={s.dangerBtn}>Delete</button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && <p style={{ color: "#a1a1aa" }}>No projects yet. Click "+ Add Project" to create one.</p>}
                </div>
              </div>
            )}

            {tab === "config" && (
              <form onSubmit={saveConfig} style={s.card}>
                <h2 style={{ ...s.h2, marginTop: 0 }}>Website Content & Links</h2>
                <div style={s.grid2}>
                  <Field label="Email" value={config.email || ""} onChange={(v) => setConfig({ ...config, email: v })} />
                  <Field label="GitHub URL" value={config.github || ""} onChange={(v) => setConfig({ ...config, github: v })} />
                  <Field label="LinkedIn URL" value={config.linkedin || ""} onChange={(v) => setConfig({ ...config, linkedin: v })} />
                  <Field label="Fiverr URL" value={config.fiverr || ""} onChange={(v) => setConfig({ ...config, fiverr: v })} />
                  <Field label="Instagram URL" value={config.instagram || ""} onChange={(v) => setConfig({ ...config, instagram: v })} />
                  <Field label="X (Twitter) URL" value={config.x || ""} onChange={(v) => setConfig({ ...config, x: v })} />
                </div>
                <Field
                  label="Project Filter Categories (comma-separated)"
                  value={config.categories || ""}
                  onChange={(v) => setConfig({ ...config, categories: v })}
                  placeholder="All Projects, AI/ML, Full-Stack"
                />
                <button type="submit" style={{ ...s.primaryBtn, marginTop: "12px" }}>Save Site Config</button>
              </form>
            )}

            {tab === "messages" && (
              <div style={s.list}>
                <h2 style={s.h2}>Contact Messages</h2>
                {messages.map((m) => (
                  <div key={m._id} style={{ ...s.card, opacity: m.read ? 0.7 : 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <div>
                        <strong>{m.name}</strong> <span style={{ color: "#a1a1aa", fontSize: "13px" }}>({m.email})</span>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => toggleRead(m)} style={s.ghostBtn}>
                          {m.read ? "Mark Unread" : "Mark Read"}
                        </button>
                        <button onClick={() => removeMessage(m._id)} style={s.dangerBtn}>Delete</button>
                      </div>
                    </div>
                    {m.subject && <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>{m.subject}</div>}
                    <p style={{ margin: 0, fontSize: "14px", color: "#d4d4d8", whiteSpace: "pre-wrap" }}>{m.message}</p>
                  </div>
                ))}
                {messages.length === 0 && <p style={{ color: "#a1a1aa" }}>No messages yet.</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, textarea, required, placeholder }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#d4d4d8", marginBottom: "12px" }}>
      {label}
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={s.input}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          style={s.input}
        />
      )}
    </label>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#0a0a0f", color: "#f4f4f5", fontFamily: "system-ui, -apple-system, sans-serif" },
  topbar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 28px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#111118",
  },
  brand: { display: "flex", alignItems: "center", gap: "10px", fontSize: "16px" },
  dot: { width: "10px", height: "10px", borderRadius: "50%", background: "#38bdf8" },
  topActions: { display: "flex", gap: "10px" },
  container: { maxWidth: "1000px", margin: "0 auto", padding: "28px 20px" },
  tabs: { display: "flex", gap: "8px", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px" },
  tab: {
    padding: "8px 16px", borderRadius: "8px", border: "1px solid transparent",
    background: "transparent", color: "#a1a1aa", cursor: "pointer", fontSize: "14px", fontWeight: 500,
  },
  tabActive: { background: "rgba(56,189,248,0.12)", color: "#38bdf8", borderColor: "rgba(56,189,248,0.3)" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  h2: { margin: 0, fontSize: "20px", fontWeight: 600 },
  card: {
    background: "#13131a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px",
    padding: "20px", marginBottom: "16px",
  },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" },
  input: {
    width: "100%", padding: "10px 12px", background: "#0a0a0f",
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#fff", fontSize: "14px",
    boxSizing: "border-box",
  },
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  row: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: "#13131a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px",
  },
  primaryBtn: {
    padding: "9px 16px", borderRadius: "8px", border: "none", background: "#38bdf8",
    color: "#09090b", fontWeight: 600, fontSize: "13px", cursor: "pointer",
  },
  ghostBtn: {
    padding: "8px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)",
    background: "transparent", color: "#e4e4e7", fontSize: "13px", cursor: "pointer",
  },
  dangerBtn: {
    padding: "8px 14px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)",
    background: "rgba(239,68,68,0.1)", color: "#fca5a5", fontSize: "13px", cursor: "pointer",
  },
  success: {
    padding: "10px 14px", borderRadius: "8px", background: "rgba(34,197,94,0.12)",
    border: "1px solid rgba(34,197,94,0.3)", color: "#86efac", fontSize: "13px", marginBottom: "16px",
  },
  error: {
    padding: "10px 14px", borderRadius: "8px", background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", fontSize: "13px", marginBottom: "16px",
  },
};
