import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { adminApi } from "./api.js";
import { ResourceManager, Toast } from "./components/AdminUI.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import SiteContentPage from "./pages/SiteContentPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import "./admin.css";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState("checking"); // checking | ok
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    adminApi
      .me()
      .then(() => setAuth("ok"))
      .catch(() => navigate("/admin/login", { replace: true }));
  }, [navigate]);

  function notify(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }

  async function handleLogout() {
    await adminApi.logout().catch(() => {});
    navigate("/admin/login", { replace: true });
  }

  if (auth !== "ok") {
    return (
      <div className="admin" style={{ alignItems: "center", justifyContent: "center" }}>
        <p>Checking session...</p>
      </div>
    );
  }

  const navItems = [
    ["/admin", "Overview", true],
    ["/admin/messages", "Messages"],
    ["/admin/projects", "Projects"],
    ["/admin/experience", "Experience"],
    ["/admin/expertise", "Expertise"],
    ["/admin/skills", "Skills"],
    ["/admin/fiverr", "Fiverr"],
    ["/admin/certifications", "Certifications"],
    ["/admin/research", "Research"],
    ["/admin/content", "Site Content"],
    ["/admin/settings", "Social Links & Settings"],
  ];

  return (
    <div className="admin">
      <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="admin-brand">
          <h2>Portfolio CMS</h2>
          <button
            type="button"
            className="admin-menu-btn"
            style={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="admin-nav">
          {navItems.map(([to, label, end]) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
          <button type="button" onClick={handleLogout} style={{ marginTop: "auto", color: "#fca5a5" }}>
            Logout
          </button>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button type="button" className="admin-menu-btn" onClick={() => setMenuOpen((o) => !o)}>
            ☰ Menu
          </button>
          <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Admin Dashboard</span>
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-outline">
            View site ↗
          </a>
        </header>

        <main className="admin-content">
          <Routes>
            <Route index element={<OverviewPage notify={notify} />} />
            <Route path="messages" element={<MessagesPage notify={notify} />} />
            <Route path="projects" element={<ProjectsPage notify={notify} />} />
            <Route
              path="experience"
              element={
                <ResourceManager
                  resource="experience"
                  title="Experience"
                  notify={notify}
                  emptyItem={{ title: "", company: "", tagline: "", dates: "", description: "", bullets: [] }}
                  fields={[
                    { key: "title", label: "Job Title *", required: true },
                    { key: "company", label: "Company *", required: true },
                    { key: "tagline", label: "Company Tagline" },
                    { key: "dates", label: "Dates" },
                    { key: "description", label: "Description", type: "textarea" },
                    { key: "bullets", label: "Highlights / Bullets", type: "tags" },
                  ]}
                  renderSummary={(it) => (
                    <>
                      <strong>{it.title}</strong> — {it.company}
                      <div style={{ fontSize: "0.84rem", color: "var(--muted)" }}>{it.dates}</div>
                    </>
                  )}
                />
              }
            />
            <Route
              path="expertise"
              element={
                <ResourceManager
                  resource="expertise"
                  title="Expertise"
                  notify={notify}
                  emptyItem={{ icon: "✦", title: "", desc: "", tags: [] }}
                  fields={[
                    { key: "icon", label: "Icon" },
                    { key: "title", label: "Title *", required: true },
                    { key: "desc", label: "Description", type: "textarea" },
                    { key: "tags", label: "Tags", type: "tags" },
                  ]}
                  renderSummary={(it) => (
                    <>
                      <strong>{it.icon} {it.title}</strong>
                      <div style={{ fontSize: "0.84rem", color: "var(--muted)" }}>{it.desc}</div>
                    </>
                  )}
                />
              }
            />
            <Route
              path="skills"
              element={
                <ResourceManager
                  resource="skill-groups"
                  title="Skill Groups"
                  notify={notify}
                  emptyItem={{ name: "", items: [] }}
                  fields={[
                    { key: "name", label: "Group Name *", required: true },
                    { key: "items", label: "Skills", type: "tags" },
                  ]}
                  renderSummary={(it) => (
                    <>
                      <strong>{it.name}</strong>
                      <div style={{ fontSize: "0.84rem", color: "var(--muted)" }}>{(it.items || []).join(", ")}</div>
                    </>
                  )}
                />
              }
            />
            <Route
              path="fiverr"
              element={
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <ResourceManager
                    resource="gigs"
                    title="Fiverr Gigs"
                    notify={notify}
                    emptyItem={{ icon: "✦", title: "", desc: "", tags: [] }}
                    fields={[
                      { key: "icon", label: "Icon" },
                      { key: "title", label: "Title *", required: true },
                      { key: "desc", label: "Description", type: "textarea" },
                      { key: "tags", label: "Tags", type: "tags" },
                    ]}
                    renderSummary={(it) => (
                      <>
                        <strong>{it.icon} {it.title}</strong>
                        <div style={{ fontSize: "0.84rem", color: "var(--muted)" }}>{it.desc}</div>
                      </>
                    )}
                  />
                  <ResourceManager
                    resource="fiverr-projects"
                    title="Completed Fiverr Projects"
                    notify={notify}
                    emptyItem={{ title: "", desc: "", tech: [], year: "", url: "" }}
                    fields={[
                      { key: "title", label: "Title *", required: true },
                      { key: "desc", label: "Description", type: "textarea" },
                      { key: "tech", label: "Tech", type: "tags" },
                      { key: "year", label: "Year" },
                      { key: "url", label: "Fiverr URL" },
                    ]}
                    renderSummary={(it) => (
                      <>
                        <strong>{it.title}</strong> {it.year && `(${it.year})`}
                        <div style={{ fontSize: "0.84rem", color: "var(--muted)" }}>{it.desc}</div>
                      </>
                    )}
                  />
                </div>
              }
            />
            <Route
              path="certifications"
              element={
                <ResourceManager
                  resource="certifications"
                  title="Licenses & Certifications"
                  notify={notify}
                  emptyItem={{ title: "", issuer: "", issued: "", credentialId: "", credentialUrl: "", skills: [] }}
                  fields={[
                    { key: "title", label: "Title *", required: true },
                    { key: "issuer", label: "Issuer *", required: true },
                    { key: "issued", label: "Issued Date" },
                    { key: "credentialId", label: "Credential ID" },
                    { key: "credentialUrl", label: "Credential URL" },
                    { key: "skills", label: "Skills", type: "tags" },
                  ]}
                  renderSummary={(it) => (
                    <>
                      <strong>{it.title}</strong> — {it.issuer}
                      <div style={{ fontSize: "0.84rem", color: "var(--muted)" }}>{it.issued}</div>
                    </>
                  )}
                />
              }
            />
            <Route
              path="research"
              element={
                <ResourceManager
                  resource="research-interests"
                  title="Research Interests"
                  notify={notify}
                  emptyItem={{ title: "" }}
                  fields={[{ key: "title", label: "Title *", required: true }]}
                  renderSummary={(it) => <strong>{it.title}</strong>}
                />
              }
            />
            <Route path="content" element={<SiteContentPage notify={notify} />} />
            <Route path="settings" element={<SettingsPage notify={notify} />} />
          </Routes>
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
