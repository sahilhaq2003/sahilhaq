import { useEffect } from "react";

/**
 * Page-wide motion effects ported from the original site:
 * scroll progress bar, hero parallax, cursor glow, 3D card tilt and magnetic buttons.
 */
export function useMotion() {
  useEffect(() => {
    const RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const FP = matchMedia("(pointer:fine)").matches;
    const $ = (s) => document.querySelector(s);
    const cleanups = [];
    const on = (target, ev, fn, opts) => {
      target.addEventListener(ev, fn, opts);
      cleanups.push(() => target.removeEventListener(ev, fn, opts));
    };

    document.documentElement.style.scrollPaddingTop = "5rem";

    // Scroll progress + hero parallax
    const sc = () => {
      const sp = $("#sp");
      const m = document.documentElement.scrollHeight - innerHeight;
      if (sp) sp.style.transform = `scaleX(${m > 0 ? scrollY / m : 0})`;
      if (!RM && scrollY < innerHeight * 1.2) {
        $("#home .bg img")?.style.setProperty("--py", scrollY * 0.08 + "px");
        $(".wm")?.style.setProperty("--wy", scrollY * -0.12 + "px");
      }
    };
    on(window, "scroll", sc, { passive: true });
    sc();

    if (RM || !FP) return () => cleanups.forEach((f) => f());

    // Cursor glow (eased follow)
    let tx = 0, ty = 0, cx = 0, cy = 0, raf;
    on(window, "pointermove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      const cg = $("#cg");
      if (cg) cg.style.opacity = 1;
      const im = $("#home .bg img");
      if (im && scrollY < innerHeight) {
        im.style.setProperty("--px", (e.clientX / innerWidth - 0.5) * -22 + "px");
        im.style.setProperty("--py", (e.clientY / innerHeight - 0.5) * -16 + scrollY * 0.08 + "px");
      }
    });
    on(document, "pointerleave", () => {
      const cg = $("#cg");
      if (cg) cg.style.opacity = 0;
    });
    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      const cg = $("#cg");
      if (cg) cg.style.transform = `translate(${cx}px,${cy}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    cleanups.push(() => cancelAnimationFrame(raf));

    // 3D tilt + spotlight on cards
    on(document, "pointermove", (e) => {
      const t = e.target.closest?.(".card,.tilt");
      if (!t) return;
      const r = t.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      t.style.setProperty("--ry", (x - 0.5) * 9 + "deg");
      t.style.setProperty("--rx", (0.5 - y) * 9 + "deg");
      t.style.setProperty("--mx", x * 100 + "%");
      t.style.setProperty("--my", y * 100 + "%");
    });
    on(document, "pointerout", (e) => {
      const t = e.target.closest?.(".card,.tilt");
      if (t && !t.contains(e.relatedTarget)) {
        t.style.setProperty("--rx", "0deg");
        t.style.setProperty("--ry", "0deg");
      }
    });

    // Magnetic buttons (delegated, so it works for elements rendered later)
    on(document, "pointermove", (e) => {
      const b = e.target.closest?.(".pill,.chip:not(.clk)");
      if (!b) return;
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px) scale(1.05)`;
    });
    on(document, "pointerout", (e) => {
      const b = e.target.closest?.(".pill,.chip:not(.clk)");
      if (b && !b.contains(e.relatedTarget)) b.style.transform = "";
    });

    return () => cleanups.forEach((f) => f());
  }, []);
}
