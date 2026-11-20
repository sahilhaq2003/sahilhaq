import { useEffect, useState } from "react";
import { adminApi } from "../api.js";
import { TagInput } from "../components/AdminUI.jsx";

export default function SettingsPage({ notify }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    adminApi.getProfile().then(setProfile).catch((err) => notify(err.message, "error"));
  }, []);

  if (!profile) return <p>Loading...</p>;

  async function save(e) {
    e.preventDefault();
    try {
      const updated = await adminApi.updateProfile(profile);
      setProfile(updated);
      notify("Settings saved!");
    } catch (err) {
      notify(err.message, "error");
    }
  }

  return (
    <form onSubmit={save}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.6rem" }}>Social Links & Settings</h1>
        <button type="submit" className="admin-btn admin-btn-accent">Save Settings</button>
      </div>

      <div className="admin-card">
        <div className="admin-grid2">
          {[
            ["email", "Email"],
            ["github", "GitHub URL"],
            ["linkedin", "LinkedIn URL"],
            ["fiverr", "Fiverr URL"],
            ["instagram", "Instagram URL"],
            ["x", "X (Twitter) URL"],
          ].map(([key, label]) => (
            <label key={key} className="admin-field">
              {label}
              <input
                className="admin-input"
                value={profile[key] || ""}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
              />
            </label>
          ))}
        </div>
        <TagInput
          label="Project Filter Categories"
          value={profile.categories || []}
          onChange={(v) => setProfile({ ...profile, categories: v })}
        />
      </div>
    </form>
  );
}
