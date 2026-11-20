import { useEffect, useState } from "react";
import { adminApi } from "../api.js";

export function TagInput({ label, value = [], onChange, placeholder = "Type and press Enter..." }) {
  const [draft, setDraft] = useState("");

  function addTag(raw) {
    const clean = raw.trim();
    if (clean && !value.includes(clean)) {
      onChange([...value, clean]);
    }
    setDraft("");
  }

  function onKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="admin-field">
      {label && <span>{label}</span>}
      <div className="admin-tags">
        {value.map((tag, i) => (
          <span key={tag + i} className="admin-tag">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} aria-label={`Remove ${tag}`}>
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => draft.trim() && addTag(draft)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export function ImageUploader({ label, value, onChange, onError }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await adminApi.uploadImage(file);
      onChange(url);
    } catch (err) {
      onError?.(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="admin-field">
      {label && <span>{label}</span>}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        {value && (
          <img
            src={value}
            alt="Preview"
            style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "0.85rem", border: "1px solid var(--line)" }}
          />
        )}
        <label className="admin-btn admin-btn-outline" style={{ cursor: "pointer" }}>
          {uploading ? "Uploading..." : "Upload Image"}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} hidden disabled={uploading} />
        </label>
        {value && (
          <button type="button" className="admin-btn admin-btn-danger" onClick={() => onChange("")}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export function ConfirmButton({ label = "Delete", onConfirm }) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);

  if (armed) {
    return (
      <button type="button" className="admin-btn admin-btn-danger" onClick={() => { setArmed(false); onConfirm(); }}>
        Confirm?
      </button>
    );
  }
  return (
    <button type="button" className="admin-btn admin-btn-danger" onClick={() => setArmed(true)}>
      {label}
    </button>
  );
}

export function Toast({ toast }) {
  if (!toast) return null;
  return <div className={`admin-toast ${toast.type === "error" ? "error" : ""}`}>{toast.message}</div>;
}

export function ResourceManager({ resource, title, fields, emptyItem, renderSummary, notify }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [resource]);

  async function load() {
    setLoading(true);
    try {
      setItems(await adminApi.list(resource));
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(item) {
    setEditing({ ...emptyItem, ...item });
    setDirty(false);
  }

  async function save(e) {
    e.preventDefault();
    try {
      if (editing._id) {
        await adminApi.update(resource, editing._id, editing);
        notify("Updated!");
      } else {
        await adminApi.create(resource, { ...editing, order: items.length });
        notify("Created!");
      }
      setEditing(null);
      setDirty(false);
      await load();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  async function remove(id) {
    try {
      await adminApi.remove(resource, id);
      notify("Deleted");
      await load();
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
      await adminApi.reorder(resource, next.map((it, order) => ({ id: it._id, order })));
    } catch (err) {
      notify(err.message, "error");
      load();
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>{title}</h1>
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => startEdit(emptyItem)}>
          + Add New
        </button>
      </div>

      {editing && (
        <form onSubmit={save} className="admin-card">
          <h3 style={{ marginTop: 0 }}>{editing._id ? "Edit Item" : "New Item"}</h3>
          {dirty && <p style={{ color: "#b15f2c", fontSize: "0.85rem", fontWeight: 600 }}>You have unsaved changes.</p>}
          {fields.map((f) => {
            if (f.type === "tags") {
              return (
                <TagInput
                  key={f.key}
                  label={f.label}
                  value={editing[f.key] || []}
                  onChange={(v) => { setEditing({ ...editing, [f.key]: v }); setDirty(true); }}
                />
              );
            }
            if (f.type === "textarea") {
              return (
                <label key={f.key} className="admin-field">
                  {f.label}
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={editing[f.key] || ""}
                    onChange={(e) => { setEditing({ ...editing, [f.key]: e.target.value }); setDirty(true); }}
                    required={f.required}
                  />
                </label>
              );
            }
            return (
              <label key={f.key} className="admin-field">
                {f.label}
                <input
                  className="admin-input"
                  value={editing[f.key] || ""}
                  onChange={(e) => { setEditing({ ...editing, [f.key]: e.target.value }); setDirty(true); }}
                  required={f.required}
                />
              </label>
            );
          })}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit" className="admin-btn admin-btn-accent">Save</button>
            <button type="button" className="admin-btn admin-btn-outline" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <div className="admin-card">No items yet.</div>
      ) : (
        items.map((item, idx) => (
          <div key={item._id} className="admin-row">
            <div style={{ flex: 1 }}>{renderSummary(item)}</div>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              <button type="button" className="admin-btn admin-btn-outline" onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
              <button type="button" className="admin-btn admin-btn-outline" onClick={() => move(idx, 1)} disabled={idx === items.length - 1}>↓</button>
              <button type="button" className="admin-btn admin-btn-outline" onClick={() => startEdit(item)}>Edit</button>
              <ConfirmButton onConfirm={() => remove(item._id)} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
