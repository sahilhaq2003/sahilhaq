import { useEffect, useRef, useState } from "react";
import { SplitText, Tags } from "./ui.jsx";

const Todo = ({ children }) => <p className="todo">{children}</p>;
const Sec = ({ title, children }) => (
  <>
    <h4>{title}</h4>
    {children}
  </>
);

function ProjectModal({ project: p, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const list = p.methods?.length ? p.methods : p.features || [];

  return (
    <div id="modal" className="open" role="dialog" aria-modal="true" aria-label={p.title} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mp">
        <button ref={closeRef} className="x" aria-label="Close" onClick={onClose}>
          ✕
        </button>
        <span className="eye">{p.label}</span>
        <h2>{p.title}</h2>
        <p>{p.desc}</p>

        <Sec title="Problem Statement">{p.prob ? <p>{p.prob}</p> : <Todo>[Add problem statement]</Todo>}</Sec>
        <Sec title="Proposed Solution">{p.sol ? <p>{p.sol}</p> : <Todo>[Add proposed solution]</Todo>}</Sec>
        <Sec title={p.methods?.length ? "Methodology" : "System Features"}>
          {list.length ? (
            <ul>
              {list.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          ) : (
            <Todo>[Add details]</Todo>
          )}
        </Sec>
        <Sec title="Architecture / Methodology">{p.arch ? <p>{p.arch}</p> : <Todo>[Add architecture overview]</Todo>}</Sec>
        <Sec title="Technologies">
          <Tags items={p.tech || []} />
        </Sec>
        <Sec title="My Responsibilities">
          <p>{p.contrib}</p>
        </Sec>
        <Sec title="Challenges and Learning">
          {p.challenges ? <p>{p.challenges}</p> : <Todo>[Add challenges and learning]</Todo>}
        </Sec>
        <Sec title="Screenshots">
          {p.screenshots?.length ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginTop: "8px" }}>
              {p.screenshots.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${p.title} screenshot ${i + 1}`}
                  style={{ width: "100%", borderRadius: "10px", objectFit: "cover", border: "1px solid var(--line)" }}
                />
              ))}
            </div>
          ) : (
            <Todo>[Screenshots not added yet]</Todo>
          )}
        </Sec>
        <Sec title="Repository / Demo">
          {p.github || p.demo ? (
            <p>
              {p.github && (
                <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                  GitHub
                </a>
              )}{" "}
              {p.demo && (
                <a href={p.demo} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                  Live demo
                </a>
              )}
            </p>
          ) : (
            <Todo>[No repository or demo link added yet]</Todo>
          )}
        </Sec>
      </div>
    </div>
  );
}

export default function Projects({ projects, categories, github }) {
  const [cur, setCur] = useState(categories[0]);
  const [open, setOpen] = useState(null);
  const shown = projects.filter((p) => cur === categories[0] || p.cats?.includes(cur));

  return (
    <section id="projects">
      <div className="shell pad" style={{ paddingTop: 0 }}>
        <div style={{ textAlign: "center" }}>
          <span className="eye rv">Projects</span>
          <SplitText text="Selected Work" style={{ marginTop: "1rem" }} />
          <p className="rv" style={{ color: "rgba(17,17,17,.6)", marginTop: ".75rem" }}>
            A collection of software engineering, data science and intelligent systems projects.
          </p>
        </div>

        <div className="flt" style={{ justifyContent: "center" }}>
          {categories.map((c) => (
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
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          zIndex: 0,
                        }}
                      />
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(180deg, rgba(14,12,11,0.35) 0%, rgba(14,12,11,0.82) 48%, rgba(14,12,11,0.97) 100%)",
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

        {github && (
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <a className="pill dark" href={github} target="_blank" rel="noopener noreferrer">
              Browse more projects on GitHub ↗
            </a>
          </div>
        )}
      </div>
      {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
