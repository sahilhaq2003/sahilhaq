import { useEffect } from "react";

/**
 * Scroll-reveal for every `.rv` element (adds `.in` when it enters the viewport),
 * including elements rendered later (filtered projects, API data, etc.).
 */
export function useReveal(enabled) {
  useEffect(() => {
    if (!enabled) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((x) => {
          if (x.isIntersecting) {
            x.target.classList.add("in");
            io.unobserve(x.target);
          }
        }),
      { threshold: 0.1 }
    );
    const scan = () => document.querySelectorAll(".rv:not(.in)").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [enabled]);
}
