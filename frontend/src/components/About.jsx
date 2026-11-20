import { SocialIcons, SplitText, StarLogo, Tags } from "./ui.jsx";

export function Marquee({ skills }) {
  const all = [...new Set(Object.values(skills).flat())];
  const row = [...all, ...all];
  return (
    <div className="mq" aria-hidden="true">
      <div className="mt">
        {row.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function SocialOrbit({ config }) {
  const S = [
    ["li", "LinkedIn", config.linkedin, "#0A66C2", "#fff"],
    ["gh", "GitHub", config.github, "#181717", "#fff"],
    ["ml", "Email", config.email && "mailto:" + config.email, "#b15f2c", "#fff"],
    ["fi", "Fiverr", config.fiverr, "#fff", "#111"],
    ["ig", "Instagram", config.instagram, "linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)", "#fff"],
    ["x", "X", config.x, "#000", "#fff"],
  ];
  return (
    <div className="rg rv" aria-label="Social links">
      <div className="orbit">
        {S.map(([k, name, href, bg, fg], i) => (
          <div key={k} className={`it${href ? "" : " off"}`} style={{ "--a": `${i * 60 - 90}deg`, "--bg": bg, "--fg": fg }}>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" aria-label={name} title={name}>
                <span className="ic">{SocialIcons[k]}</span>
              </a>
            ) : (
              <span className="ic" title={`${name} — link not added yet`} aria-hidden="true">
                {SocialIcons[k]}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="ctr">
        <StarLogo />
        <b>Let’s connect</b>
        <span>Find me online</span>
      </div>
    </div>
  );
}

export default function About({ config, about = {} }) {
  const paragraphs = about.paragraphs?.length
    ? about.paragraphs
    : [
        "I’m a software engineering and data science enthusiast who enjoys solving real-world problems through technology.",
        "My interests span full-stack application development, data analytics, business intelligence, machine learning and intelligent automation.",
        "Through academic projects and professional software development experience, I’ve gained practical exposure to building web applications, designing databases, analyzing complex datasets and developing data-driven solutions.",
        "I believe great technology should be more than functional — it should simplify processes, support better decisions and create measurable value.",
      ];
  const interests = about.interests?.length
    ? about.interests
    : ["Software Engineering", "Data Science & Artificial Intelligence", "Business Solutions & Automation"];
  const learning = about.learning?.length
    ? about.learning
    : ["Advanced Deep Learning", "Predictive Modeling", "Scalable Systems"];

  return (
    <section id="about">
      <div className="shell pad about">
        <SocialOrbit config={config} />
        <div>
          <span className="eye rv">About me</span>
          <SplitText text="Beyond Code. Driven by Curiosity." style={{ marginTop: "1rem" }} />
          <div className="rv">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <ul className="int">
              {interests.map((item, i) => (
                <li key={i}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  {item}
                </li>
              ))}
            </ul>
            <p style={{ marginTop: "1.5rem", fontSize: ".8rem", textTransform: "uppercase", letterSpacing: ".05em", color: "var(--acc)" }}>
              Currently learning
            </p>
            <Tags items={learning} />
          </div>
        </div>
      </div>
    </section>
  );
}
