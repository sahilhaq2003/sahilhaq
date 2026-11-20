import { useEffect, useState } from "react";
import { adminApi } from "../api.js";
import { ImageUploader, TagInput } from "../components/AdminUI.jsx";

export default function SiteContentPage({ notify }) {
  const [profile, setProfile] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    adminApi.getProfile().then(setProfile).catch((err) => notify(err.message, "error"));
  }, []);

  if (!profile) return <p>Loading...</p>;

  const setNested = (section, key, val) => {
    setProfile((p) => ({ ...p, [section]: { ...(p[section] || {}), [key]: val } }));
    setDirty(true);
  };

  async function save(e) {
    e.preventDefault();
    try {
      const updated = await adminApi.updateProfile(profile);
      setProfile(updated);
      setDirty(false);
      notify("Site content saved!");
    } catch (err) {
      notify(err.message, "error");
    }
  }

  return (
    <form onSubmit={save}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.6rem" }}>Site Content</h1>
        <button type="submit" className="admin-btn admin-btn-accent">Save Changes</button>
      </div>
      {dirty && <p style={{ color: "var(--acc)", fontWeight: 600, fontSize: "0.88rem" }}>You have unsaved changes.</p>}

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>Hero Section</h3>
        <ImageUploader
          label="Hero Portrait (falls back to /profile.jpg if empty)"
          value={profile.portrait || ""}
          onChange={(url) => { setProfile({ ...profile, portrait: url }); setDirty(true); }}
          onError={(msg) => notify(msg, "error")}
        />
        <label className="admin-field">
          Eyebrow Badge
          <input className="admin-input" value={profile.hero?.badge || ""} onChange={(e) => setNested("hero", "badge", e.target.value)} />
        </label>
        <label className="admin-field">
          Main Headline
          <input className="admin-input" value={profile.hero?.greeting || ""} onChange={(e) => setNested("hero", "greeting", e.target.value)} />
        </label>
        <TagInput
          label="Rotating Roles"
          value={profile.hero?.roles || []}
          onChange={(v) => setNested("hero", "roles", v)}
        />
        <label className="admin-field">
          Hero Subtitle
          <textarea className="admin-textarea" rows={3} value={profile.hero?.subtitle || ""} onChange={(e) => setNested("hero", "subtitle", e.target.value)} />
        </label>
      </div>

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>About Section</h3>
        <label className="admin-field">
          Paragraphs (one per line)
          <textarea
            className="admin-textarea"
            rows={6}
            value={(profile.about?.paragraphs || []).join("\n")}
            onChange={(e) => setNested("about", "paragraphs", e.target.value.split("\n").filter(Boolean))}
          />
        </label>
        <TagInput label="Core Interests" value={profile.about?.interests || []} onChange={(v) => setNested("about", "interests", v)} />
        <TagInput label="Currently Learning" value={profile.about?.learning || []} onChange={(v) => setNested("about", "learning", v)} />
      </div>

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>Education</h3>
        <div className="admin-grid2">
          <label className="admin-field">
            School / University
            <input className="admin-input" value={profile.education?.school || ""} onChange={(e) => setNested("education", "school", e.target.value)} />
          </label>
          <label className="admin-field">
            Degree
            <input className="admin-input" value={profile.education?.degree || ""} onChange={(e) => setNested("education", "degree", e.target.value)} />
          </label>
          <label className="admin-field">
            Status / Dates
            <input className="admin-input" value={profile.education?.dates || ""} onChange={(e) => setNested("education", "dates", e.target.value)} />
          </label>
        </div>
        <label className="admin-field">
          Description
          <textarea className="admin-textarea" rows={2} value={profile.education?.description || ""} onChange={(e) => setNested("education", "description", e.target.value)} />
        </label>
      </div>

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>Footer</h3>
        <label className="admin-field">
          Tagline
          <input className="admin-input" value={profile.footer?.tagline || ""} onChange={(e) => setNested("footer", "tagline", e.target.value)} />
        </label>
      </div>
    </form>
  );
}
