import { useEffect, useState } from "react";
import { StarLogo } from "./ui.jsx";

export const NAV = [
  ["home", "Home"],
  ["about", "About"],
  ["expertise", "Expertise"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["fiverr", "Fiverr"],
  ["skills", "Skills"],
  ["education", "Education"],
  ["contact", "Contact"],
];

const fmt = (d) => {
  const h = d.getHours();
  return (h % 12 || 12) + ":" + String(d.getMinutes()).padStart(2, "0") + (h < 12 ? "am" : "pm");
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState(() => fmt(new Date()));

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 40);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    const id = setInterval(() => setTime(fmt(new Date())), 1000);
    return () => {
      removeEventListener("scroll", onScroll);
      clearInterval(id);
    };
  }, []);

  return (
    <header className={scrolled ? "sc" : ""}>
      <div className="shell">
        <a className="brand" href="#home">
          <StarLogo />
          SAHIL HAQ
        </a>
        <nav aria-label="Primary">
          <ul>
            {NAV.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ display: "flex", gap: ".75rem" }}>
          <div className="chip clk">
            <span style={{ opacity: 0.5 }}>Local time</span> <b style={{ fontWeight: 500 }}>{time}</b>
          </div>
          <a className="chip" href="#contact">
            Let’s Connect
          </a>
        </div>
      </div>
    </header>
  );
}
