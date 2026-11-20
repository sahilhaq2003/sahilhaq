import { useEffect, useState } from "react";
import { adminApi } from "../api.js";
import { ConfirmButton, ImageUploader, TagInput } from "../components/AdminUI.jsx";

const EMPTY = {
  title: "",
  slug: "",
  label: "",
  cats: [],
  desc: "",
  prob: "",
  sol: "",
  arch: "",
  contrib: "",
  challenges: "",
  features: [],
  tech: [],
  screenshots: [],
  github: "",
  demo: "",
  published: true,
};

export default function ProjectsPage({ notify }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setItems(await adminApi.list("projects"));
    } catch (err) {
      notify(err.message, "error");
    }
  }

  function startEdit(p) {
    setEditing({ ...EMPTY, ...p });
    setDirty(false);
  }

  async function save(e) {
    e.preventDefault();
    try {
      if (editing._id) {
        await adminApi.update("projects", editing._id, editing);
        notify("Project updated!");
      } else {
        await adminApi.create("projects", { ...editing, order: items.length });
        notify("Project created!");
      }
      setEditing(null);
      setDirty(false);
      load();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  async function togglePublish(p) {
    try {
      await adminApi.update("projects", p._id, { published: !p.published });
      notify(p.published ? "Unpublished" : "Published");
      load();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  async function remove(id) {
    try {
      await adminApi.remove("projects", id);
      notify("Project deleted");
      load();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  async function move(idx, dir) {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next);
    try {
      await adminApi.reorder("projects", next.map((it, order) => ({ id: it._id, order })));
    } catch (err) {
      notify(err.message, "error");
      load();
    }
  }

  const updateField = (k, v) => {
    setEditing((prev) => ({ ...prev, [k]: v }));
    setDirty(true);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.6rem" }}>Projects ({items.length})</h1>
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => startEdit(EMPTY)}>+ Add Project</button>
      </div>

      {editing && (
        <form onSubmit={save} className="admin-card">
          <h3 style={{ marginTop: 0 }}>{editing._id ? "Edit Project" : "New Project"}</h3>
          {dirty && <p style={{ color: "var(--acc)", fontSize: "0.85rem", fontWeight: 600 }}>You have unsaved changes.</p>}

          <div className="admin-grid2">
            <label className="admin-field">
              Title *
              <input className="admin-input" value={editing.title} onChange={(e) => updateField("title", e.target.value)} required />
            </label>
            <label className="admin-field">
              Slug (URL id)
              <input className="admin-input" value={editing.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="auto-generated-from-title" />
            </label>
            <label className="admin-field">
              Label
              <input className="admin-input" value={editing.label} onChange={(e) => updateField("label", e.target.value)} placeholder="e.g. Full-Stack" />
            </label>
            <label className="admin-field">
              GitHub URL
              <input className="admin-input" value={editing.github} onChange={(e) => updateField("github", e.target.value)} />
            </label>
            <label className="admin-field">
              Demo URL
              <input className="admin-input" value={editing.demo} onChange={(e) => updateField("demo", e.target.value)} />
            </label>
          </div>

          <TagInput label="Categories" value={editing.cats || []} onChange={(v) => updateField("cats", v)} />
          <TagInput label="Tech Stack" value={editing.tech || []} onChange={(v) => updateField("tech", v)} />
          <TagInput label="Key Features" value={editing.features || []} onChange={(v) => updateField("features", v)} />

          <label className="admin-field">
            Short Description
            <textarea className="admin-textarea" rows={2} value={editing.desc} onChange={(e) => updateField("desc", e.target.value)} />
          </label>
          <label className="admin-field">
            Problem Statement
            <textarea className="admin-textarea" rows={2} value={editing.prob} onChange={(e) => updateField("prob", e.target.value)} />
          </label>
          <label className="admin-field">
            Solution
            <textarea className="admin-textarea" rows={2} value={editing.sol} onChange={(e) => updateField("sol", e.target.value)} />
          </label>
          <label className="admin-field">
            Architecture
            <textarea className="admin-textarea" rows={2} value={editing.arch} onChange={(e) => updateField("arch", e.target.value)} />
          </label>
          <label className="admin-field">
            My Contribution
            <textarea className="admin-textarea" rows={2} value={editing.contrib} onChange={(e) => updateField("contrib", e.target.value)} />
          </label>
          <label className="admin-field">
            Challenges & Learning
            <textarea className="admin-textarea" rows={2} value={editing.challenges || ""} onChange={(e) => updateField("challenges", e.target.value)} />
          </label>

          <div className="admin-field">
            <span>Screenshots</span>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
              {(editing.screenshots || []).map((src, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={src} alt="" style={{ width: "100px", height: "70px", objectFit: "cover", borderRadius: "0.65rem", border: "1px solid var(--line)" }} />
                  <button
                    type="button"
                    onClick={() => updateField("screenshots", editing.screenshots.filter((_, idx) => idx !== i))}
                    style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", border: "none", background: "#171412", color: "#fff", cursor: "pointer" }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <ImageUploader
              value=""
              onChange={(url) => url && updateField("screenshots", [...(editing.screenshots || []), url])}
              onError={(msg) => notify(msg, "error")}
            />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", fontWeight: 600, fontSize: "0.9rem" }}>
            <input type="checkbox" checked={editing.published} onChange={(e) => updateField("published", e.target.checked)} />
            Published on portfolio
          </label>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit" className="admin-btn admin-btn-accent">Save Project</button>
            <button type="button" className="admin-btn admin-btn-outline" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}

      {items.map((p, idx) => (
        <div key={p._id} className="admin-row">
          <div style={{ flex: 1 }}>
            <strong>{p.title}</strong>{" "}
            <span style={{ fontSize: "0.75rem", padding: "0.15rem 0.55rem", borderRadius: "999px", background: p.published ? "#dcfce7" : "#f3f4f6", color: p.published ? "#166534" : "#4b5563" }}>
              {p.published ? "Published" : "Draft"}
            </span>
            <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "0.2rem" }}>
              {p.label || "Project"} · {(p.tech || []).slice(0, 5).join(", ")}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            <button type="button" className="admin-btn admin-btn-outline" onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
            <button type="button" className="admin-btn admin-btn-outline" onClick={() => move(idx, 1)} disabled={idx === items.length - 1}>↓</button>
            <button type="button" className="admin-btn admin-btn-outline" onClick={() => togglePublish(p)}>
              {p.published ? "Unpublish" : "Publish"}
            </button>
            <button type="button" className="admin-btn admin-btn-outline" onClick={() => startEdit(p)}>Edit</button>
            <ConfirmButton onConfirm={() => remove(p._id)} />
          </div>
        </div>
      ))}
    </div>
  );
}
