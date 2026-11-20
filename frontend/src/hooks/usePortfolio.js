import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import * as F from "../data/fallback.js";

/** Same shape as GET /api/portfolio, built from the bundled fallback content. */
const fallback = {
  config: {
    github: F.PROFILE.github,
    email: F.PROFILE.email,
    linkedin: F.PROFILE.linkedin,
    fiverr: F.PROFILE.fiverr,
    instagram: F.PROFILE.instagram,
    x: F.PROFILE.x,
    portrait: F.PROFILE.portrait,
  },
  categories: F.PROFILE.categories,
  hero: F.PROFILE.hero,
  about: F.PROFILE.about,
  education: F.PROFILE.education,
  fiverrSteps: F.PROFILE.fiverrSteps,
  footer: F.PROFILE.footer,
  experience: F.EXPERIENCE,
  research: F.RESEARCH,
  certifications: F.CERTIFICATIONS,
  expertise: F.EXPERTISE,
  skills: F.SKILLS,
  gigs: F.GIGS,
  fiverrProjects: F.FIVERR_PROJECTS,
  projects: F.PROJECTS.map(({ slug, ...p }) => ({ id: slug, ...p })),
};

/**
 * Loads portfolio content from the API (MongoDB).
 * Until it loads — or if the API is down — the bundled fallback is shown.
 */
export function usePortfolio() {
  const [state, setState] = useState({ data: fallback, source: "fallback" });

  useEffect(() => {
    let alive = true;
    api
      .getPortfolio()
      .then((data) => {
        if (!alive || !data) return;
        // If the DB is empty (not seeded yet), keep the fallback content.
        const empty = !data.projects?.length && !data.expertise?.length;
        if (!empty) setState({ data: { ...fallback, ...data }, source: "api" });
      })
      .catch((err) => console.warn("[portfolio] API unavailable, using fallback content:", err.message));
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
