import { useState } from "react";
import { Link } from "react-router-dom";
import { usePortfolio } from "../hooks/usePortfolio.js";
import { SplitText } from "./ui.jsx";
import { ProjectModal as CaseStudyModal } from "./Projects.jsx";

export default function AllProjectsPage() {
  const { data } = usePortfolio();
  const [cur, setCur] = useState(data.categories[0]);
  const [open, setOpen] = useState(null);
  const shown = data.projects.filter((p) => cur === data.categories[0] || p.cats?.includes(cur));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg, #f7f4ef)", color: "var(--ink, #171412)" }}>
      <div className="shell pad" style={{ paddingTop: "3.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <Link to="/" className="pill outline" style={{ textDecoration: "none" }}>
            ← Back to Home
          </Link>
          <span style={{ fontSize: "0.88rem", color: "var(--muted)" }}>
            {shown.length} {shown.length === 1 ? "project" : "projects"}
          </span>
        </div>

        <div style={{ textAlign: "center" }}>
          <span className="eye">All Work</span>
          <SplitText text="All Projects" style={{ marginTop: "0.75rem" }} />
          <p style={{ color: "rgba(17,17,17,.6)", marginTop: ".75rem" }}>
            Complete collection of software engineering, data science, and AI projects.
          </p>
        </div>

        <div className="flt" style={{ justifyContent: "center" }}>
          {data.categories.map((c) => (
            <button key={c} className={c === cur ? "on" : ""} onClick={() => setCur(c)}>
              {c}
            </button>
          ))}
        </div>

        <ul className="cards">
          {shown.length ? (
            shown.map((p) => (
              <li key={p.id}>
                <button className="card" onClick={() => setOpen(p)} style={{ position: "relative", overflow: "hidden" }}>
                  {p.screenshots?.[0] && (
                    <>
                      <img
                        src={p.screenshots[0]}
                        alt={p.title}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
                      />
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(180deg, rgba(14,12,11,0.35) 0%, rgba(14,12,11,0.82) 48%, rgba(14,12,11,0.97) 100%)",
                          zIndex: 0,
                        }}
                      />
                    </>
                  )}
                  <div className="meta" style={{ position: "relative", zIndex: 1, marginBottom: "auto", justifyContent: "flex-end" }}>
                    <span>↗</span>
                  </div>
                  {!p.screenshots?.[0] && <div className="mk">✦</div>}
                  <div className="cb" style={{ position: "relative", zIndex: 1 }}>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    <span className="vc">View Case Study →</span>
                  </div>
                </button>
              </li>
            ))
          ) : (
            <li style={{ color: "#8d8d8d" }}>No projects in this category yet.</li>
          )}
        </ul>
      </div>

      {open && <CaseStudyModal project={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
