import { SplitText, Tags } from "./ui.jsx";

export function Expertise({ items }) {
  return (
    <section id="expertise">
      <div className="shell pad">
        <span className="eye rv">Expertise</span>
        <SplitText text="What I Do" style={{ marginTop: "1rem" }} />
        <ul className="g3">
          {items.map((e, i) => (
            <li key={e.title} className="ex rv tilt" style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
              <i>{e.icon}</i>
              <h3>{e.title}</h3>
              <p>{e.desc}</p>
              <Tags items={e.tags} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Experience({ items = [] }) {
  const list = items.length
    ? items
    : [
        {
          title: "Data & Software Engineer",
          company: "Dulan Progiciel",
          tagline: "Custom Software. Smarter Business.",
          dates: "[Add employment dates]",
          description:
            "Contributing to the development of reliable, data-driven software and business solutions by combining software engineering, database technologies and analytics.",
          bullets: [
            "Full-stack application development.",
            "Database design and development.",
            "Data analysis and visualization.",
            "Business intelligence solutions.",
            "Development of business-oriented software features.",
            "Collaboration on custom digital solutions.",
          ],
        },
      ];
  return (
    <section id="experience">
      <div className="shell pad" style={{ paddingTop: 0 }}>
        <span className="eye rv">Experience</span>
        <SplitText text="Professional Journey" style={{ marginTop: "1rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(260px, 0.85fr)", gap: "3rem", alignItems: "center" }}>
          <div>
            {list.map((job, idx) => (
              <div key={job.title + idx} className="tl rv">
                <h3>{job.title}</h3>
                <div className="co">
                  {job.company}
                  {job.tagline && (
                    <>
                      {" — "}
                      <span style={{ fontWeight: 400, color: "var(--muted)" }}>{job.tagline}</span>
                    </>
                  )}
                </div>
                {job.dates && <div className="dt">{job.dates}</div>}
                {job.description && <p>{job.description}</p>}
                {job.bullets?.length > 0 && (
                  <ul>
                    {job.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div
            className="rv"
            aria-hidden="true"
            style={{
              position: "relative",
              borderRadius: "1.75rem",
              background: "linear-gradient(155deg, #151210 0%, #211c19 100%)",
              padding: "2.25rem 2rem",
              color: "#f7f4ef",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 28px 64px rgba(23,20,18,0.16)",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <style>{`
              @keyframes walkAcross {
                0% { transform: translate(18px, 92px); }
                33% { transform: translate(98px, 66px); }
                66% { transform: translate(178px, 42px); }
                100% { transform: translate(244px, 18px); }
              }
              @keyframes legA { 0%, 100% { transform: rotate(-22deg); } 50% { transform: rotate(22deg); } }
              @keyframes legB { 0%, 100% { transform: rotate(22deg); } 50% { transform: rotate(-22deg); } }
              @keyframes dotBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
              @media (max-width: 900px) { #experience .shell > div { grid-template-columns: 1fr !important; } }
            `}</style>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(247,244,239,0.6)" }}>
              <span>Career Path</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#e09f67", fontWeight: 600 }}>
                <i style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "dotBlink 2s ease-in-out infinite" }} />
                In Motion
              </span>
            </div>

            <svg viewBox="0 0 280 140" style={{ width: "100%", height: "140px", display: "block", overflow: "visible" }}>
              {/* Ascending journey path */}
              <path
                d="M 18 118 Q 90 100, 140 76 T 262 36"
                fill="none"
                stroke="rgba(224,159,103,0.28)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="5 6"
              />
              {/* Milestone nodes */}
              <circle cx="24" cy="116" r="4.5" fill="#171412" stroke="#e09f67" strokeWidth="2" />
              <circle cx="105" cy="91" r="4.5" fill="#171412" stroke="#e09f67" strokeWidth="2" />
              <circle cx="185" cy="63" r="4.5" fill="#171412" stroke="#e09f67" strokeWidth="2" />
              <circle cx="258" cy="38" r="5.5" fill="#b15f2c" stroke="#f7f4ef" strokeWidth="2" />

              {/* Walking human figure */}
              <g style={{ animation: "walkAcross 7s linear infinite" }}>
                {/* Head */}
                <circle cx="0" cy="-16" r="4.2" fill="#f7f4ef" />
                {/* Torso */}
                <line x1="0" y1="-11" x2="0" y2="2" stroke="#f7f4ef" strokeWidth="2.4" strokeLinecap="round" />
                {/* Arms */}
                <line x1="0" y1="-8" x2="-5" y2="-1" stroke="#e09f67" strokeWidth="2" strokeLinecap="round" style={{ transformOrigin: "0px -8px", animation: "legB 0.7s ease-in-out infinite" }} />
                <line x1="0" y1="-8" x2="5" y2="-1" stroke="#e09f67" strokeWidth="2" strokeLinecap="round" style={{ transformOrigin: "0px -8px", animation: "legA 0.7s ease-in-out infinite" }} />
                {/* Legs */}
                <line x1="0" y1="2" x2="-4" y2="14" stroke="#f7f4ef" strokeWidth="2.2" strokeLinecap="round" style={{ transformOrigin: "0px 2px", animation: "legA 0.7s ease-in-out infinite" }} />
                <line x1="0" y1="2" x2="4" y2="14" stroke="#f7f4ef" strokeWidth="2.2" strokeLinecap="round" style={{ transformOrigin: "0px 2px", animation: "legB 0.7s ease-in-out infinite" }} />
              </g>

              {/* Labels */}
              <text x="24" y="133" textAnchor="middle" fill="rgba(247,244,239,0.55)" fontSize="8">SLIIT</text>
              <text x="105" y="109" textAnchor="middle" fill="rgba(247,244,239,0.55)" fontSize="8">Dulan</text>
              <text x="185" y="81" textAnchor="middle" fill="rgba(247,244,239,0.55)" fontSize="8">CPC</text>
              <text x="258" y="25" textAnchor="middle" fill="#e09f67" fontSize="8" fontWeight="700">Next</text>
            </svg>

            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: 600, letterSpacing: "-0.01em" }}>
                Software Engineering &amp; Data Analytics
              </div>
              <p style={{ margin: "0.4rem 0 0", fontSize: "0.88rem", color: "rgba(247,244,239,0.68)", lineHeight: 1.55 }}>
                Bridging enterprise backend systems, exploratory data analysis, and business intelligence.
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {["Enterprise Systems", "EDA & BI", "Full-Stack", "Data Pipelines"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.3rem 0.7rem",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(247,244,239,0.85)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Fiverr({ config, gigs, fiverrProjects, steps = [] }) {
  return (
    <section id="fiverr">
      <div className="shell" style={{ paddingBottom: "6rem" }}>
        <div className="fv rv">
          <div className="fvh">
            <div>
              <span className="fvl">
                <b>
                  fiverr<i>.</i>
                </b>{" "}
                Freelance services
              </span>
              <SplitText text="Work With Me on Fiverr" />
              <p className="sub">
                Need a web app, a data dashboard or an AI-powered tool? I take on freelance projects through Fiverr,
                with clear scope, regular updates and reliable delivery.
              </p>
            </div>
            {config.fiverr ? (
              <a className="pill gr" href={config.fiverr} target="_blank" rel="noopener noreferrer">
                View my Fiverr profile ↗
              </a>
            ) : (
              <a className="pill gr off" href="#fiverr">
                Fiverr profile coming soon
              </a>
            )}
          </div>

          <ul className="gg">
            {gigs.map((g, i) => (
              <li key={g.title} className="gig rv" style={{ transitionDelay: `${i * 0.08}s` }}>
                <i>{g.icon}</i>
                <h3>{g.title}</h3>
                <p>{g.desc}</p>
                <Tags items={g.tags} />
              </li>
            ))}
          </ul>

          <div className="fph">
            <div>
              <h3>Completed Projects</h3>
              <p>Work delivered to clients through Fiverr.</p>
            </div>
          </div>
          <ul className="fp">
            {fiverrProjects.length
              ? fiverrProjects.map((p, i) => (
                  <li key={p.title + i} className="fpc rv" style={{ transitionDelay: `${i * 0.08}s` }}>
                    <span className="bd2">Delivered{p.year ? " · " + p.year : ""}</span>
                    <h4>{p.title}</h4>
                    <p>{p.desc}</p>
                    <Tags items={p.tech || []} />
                    {p.url && (
                      <a className="lk" href={p.url} target="_blank" rel="noopener noreferrer">
                        View on Fiverr ↗
                      </a>
                    )}
                  </li>
                ))
              : [1, 2, 3].map((n) => (
                  <li key={n} className="fpc ph2">
                    <span className="bd2">Details coming soon</span>
                    <h4>Completed project title</h4>
                    <p>A short description of the delivered project, the client’s goal and the result will appear here.</p>
                  </li>
                ))}
          </ul>

          <div className="stp">
            {(steps.length
              ? steps
              : [
                  { num: "01", title: "Message me", desc: "Share your idea and goals." },
                  { num: "02", title: "Agree the scope", desc: "Clear deliverables and timeline." },
                  { num: "03", title: "Build & update", desc: "Progress shared along the way." },
                  { num: "04", title: "Deliver & refine", desc: "Review, revise, launch." },
                ]
            ).map((st, i) => (
              <div key={i}>
                <em>{st.num}</em>
                <b>{st.title}</b>
                {st.desc}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Skills({ skills }) {
  return (
    <section id="skills">
      <div className="shell pad" style={{ paddingTop: 0 }}>
        <span className="eye rv">Skills</span>
        <SplitText text="Technologies & Tools" style={{ marginTop: "1rem" }} />
        <div className="sk">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group} className="rv">
              <h4>{group}</h4>
              <Tags items={items} stagger />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Education({ education = {} }) {
  return (
    <section id="education">
      <div className="shell" style={{ paddingBottom: "6rem" }}>
        <div className="blk rv">
          <span className="eye" style={{ color: "rgba(255,255,255,.7)" }}>Education</span>
          <h3>Academic Background</h3>
          <p style={{ color: "#fff", fontSize: "1.25rem", fontWeight: 500 }}>
            {education.school || "Sri Lanka Institute of Information Technology (SLIIT)"}
          </p>
          <p>{education.degree || "BSc (Hons) in Information Technology — Specialization: Data Science"}</p>
          <p style={{ marginTop: "1rem" }}>
            {education.description ||
              "Building a strong foundation in software engineering, artificial intelligence, machine learning, data analytics, databases and business intelligence."}
          </p>
          <Tags items={[education.dates || "Undergraduate"]} style={{ marginTop: "1.5rem" }} />
        </div>
      </div>
    </section>
  );
}

export function Research({ items = [] }) {
  const list = items.length
    ? items
    : ["Applied Machine Learning", "AI in Healthcare and Forensic Applications", "Intelligent Information Retrieval and Agentic AI"];
  return (
    <section>
      <div className="shell" style={{ paddingBottom: "6rem" }}>
        <span className="eye rv">Research Interests</span>
        <SplitText text="Exploring What’s Next" style={{ marginTop: "1rem" }} />
        <div className="rs">
          {list.map((t, i) => (
            <div key={t + i} className="rv" style={{ transitionDelay: `${i * 0.1}s` }}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              <h3>{t}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Certifications({ items = [] }) {
  if (!items.length) return null;
  return (
    <section id="certifications">
      <div className="shell" style={{ paddingBottom: "6rem" }}>
        <span className="eye rv">Licenses &amp; Certifications</span>
        <SplitText text="Verified Credentials" style={{ marginTop: "1rem" }} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "1.25rem",
            marginTop: "2.25rem",
          }}
        >
          {items.map((c, i) => (
            <div
              key={c.title + i}
              className="rv"
              style={{
                transitionDelay: `${(i % 4) * 0.08}s`,
                background: "var(--surf, #fff)",
                border: "1px solid var(--line, rgba(23,20,18,0.1))",
                borderRadius: "1.35rem",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "var(--acc)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <span>{c.issuer}</span>
                  {c.issued && <span style={{ color: "var(--muted)", fontWeight: 500 }}>{c.issued}</span>}
                </div>
                <h3 style={{ margin: "0.5rem 0 0.35rem", fontSize: "1.1rem", lineHeight: 1.35 }}>{c.title}</h3>
                {c.credentialId && (
                  <div style={{ fontSize: "0.8rem", color: "var(--muted)", wordBreak: "break-all" }}>
                    ID: {c.credentialId}
                  </div>
                )}
              </div>

              <div>
                {c.skills?.length > 0 && <Tags items={c.skills} />}
                {c.credentialUrl && (
                  <a
                    href={c.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lk"
                    style={{ display: "inline-block", marginTop: "0.85rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--ink)" }}
                  >
                    Show credential ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
