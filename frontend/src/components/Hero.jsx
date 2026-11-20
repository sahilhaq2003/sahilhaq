import { useEffect, useState } from "react";
import { SplitText } from "./ui.jsx";

const DEFAULT_ROLES = ["Data & Software Engineer", "Full-Stack Developer", "Data Science Enthusiast", "AI & Machine Learning Explorer"];

function RoleRotator({ roles }) {
  const list = roles?.length ? roles : DEFAULT_ROLES;
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    let t;
    const id = setInterval(() => {
      setVisible(false);
      t = setTimeout(() => {
        setI((n) => (n + 1) % list.length);
        setVisible(true);
      }, 300);
    }, 2600);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, [list.length]);
  return (
    <div className="roles rv" id="roles" aria-live="polite" style={{ opacity: visible ? 1 : 0 }}>
      {list[i % list.length]}
    </div>
  );
}

export default function Hero({ config, hero = {} }) {
  return (
    <section id="home">
      <div className="bg">
        <i className="orb o1" />
        <i className="orb o2" />
        <img src={config.portrait || "/profile.jpg"} alt="Portrait of Sahil Haq" />
      </div>
      <div className="wm" aria-hidden="true">
        SAHIL
      </div>
      <div className="shell hero">
        <span className="eye rv">{hero.badge || "HELLO, I’M SAHIL HAQ"}</span>
        <SplitText
          as="h1"
          text={hero.greeting || "Engineering Software. Unlocking Intelligence Through Data."}
          style={{ transitionDelay: ".12s" }}
        />
        <RoleRotator roles={hero.roles} />
        <p className="lead rv" style={{ transitionDelay: ".25s" }}>
          {hero.subtitle || "I’m Sahil Haq, a Data & Software Engineer and Data Science undergraduate at SLIIT, Sri Lanka. I specialize in combining software engineering, data analytics and intelligent technologies to develop practical, scalable digital solutions."}
        </p>
        <div className="btns rv" style={{ transitionDelay: ".35s" }}>
          <a className="pill dark" href="#projects">
            Explore My Work →
          </a>
          <a className="pill outline" href="#contact">
            Contact Me
          </a>
        </div>
        <div className="soc rv" style={{ transitionDelay: ".45s" }}>
          {config.linkedin && (
            <a href={config.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              in
            </a>
          )}
          {config.github && (
            <a href={config.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              gh
            </a>
          )}
          {config.email && (
            <a href={`mailto:${config.email}`} aria-label="Email">
              @
            </a>
          )}
        </div>
      </div>
      <div className="status">
        <div className="shell">
          <span>SLIIT, Sri Lanka</span>
          <span>Open to opportunities</span>
          <span>Scroll to explore ↓</span>
        </div>
      </div>
    </section>
  );
}
