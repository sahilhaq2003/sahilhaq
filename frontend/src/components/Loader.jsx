import { useEffect, useRef, useState } from "react";
import { StarLogo } from "./ui.jsx";

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Full-screen intro loader with a 000 → 100 counter. Calls onDone when it has slid away. */
export default function Loader({ onDone }) {
  const [value, setValue] = useState(0);
  const [out, setOut] = useState(false);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    let start = null, raf, timer;
    const step = (t) => {
      start ??= t;
      const p = Math.min((t - start) / 1300, 1);
      setValue(Math.round(ease(p) * 100));
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        setOut(true);
        timer = setTimeout(() => {
          document.documentElement.style.overflow = "";
          done.current?.();
        }, 750);
      }
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div id="loader" className={out ? "out" : ""}>
      <div className="lg">
        <StarLogo />
        SAHIL HAQ
      </div>
      <p style={{ fontSize: ".875rem", color: "rgba(255,255,255,.55)" }}>
        Building Software. Exploring Data. Creating Impact.
      </p>
      <div className="bar">
        <div className="track">
          <div id="fill" style={{ width: value + "%" }} />
        </div>
        <div className="cnt">
          <span>Loading</span>
          <span>{String(value).padStart(3, "0")}</span>
        </div>
      </div>
    </div>
  );
}
