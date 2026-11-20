import Project from "../models/Project.js";
import { Expertise, SkillGroup, Gig, FiverrProject, Profile, Experience, ResearchInterest, Certification } from "../models/Content.js";
import { asyncHandler } from "../middleware/index.js";
import { resolveImageUrl, resolveImageUrls } from "../utils/imageUrl.js";

const byOrder = { order: 1, createdAt: 1 };

/** Shapes a project document for the frontend (uses `id` = slug, like the original page). */
export const toClientProject = (p, req) => ({
  id: p.slug,
  _id: p._id,
  cats: p.cats,
  title: p.title,
  label: p.label,
  desc: p.desc,
  prob: p.prob,
  sol: p.sol,
  features: p.features,
  methods: p.methods?.length ? p.methods : undefined,
  arch: p.arch,
  contrib: p.contrib,
  challenges: p.challenges || "",
  screenshots: resolveImageUrls(req, p.screenshots),
  tech: p.tech,
  github: p.github,
  demo: p.demo,
});

/** GET /api/portfolio — everything the page needs in one request. */
export const getPortfolio = asyncHandler(async (req, res) => {
  const [profile, expertise, skills, projects, gigs, fiverrProjects, experience, research, certifications] = await Promise.all([
    Profile.findOne({ key: "main" }).lean(),
    Expertise.find().sort(byOrder).lean(),
    SkillGroup.find().sort(byOrder).lean(),
    Project.find({ published: true }).sort(byOrder).lean(),
    Gig.find().sort(byOrder).lean(),
    FiverrProject.find().sort(byOrder).lean(),
    Experience.find().sort(byOrder).lean(),
    ResearchInterest.find().sort(byOrder).lean(),
    Certification.find().sort(byOrder).lean(),
  ]);

  res.json({
    config: {
      github: profile?.github || "",
      email: profile?.email || "",
      linkedin: profile?.linkedin || "",
      fiverr: profile?.fiverr || "",
      instagram: profile?.instagram || "",
      x: profile?.x || "",
      portrait: resolveImageUrl(req, profile?.portrait),
    },
    categories: profile?.categories?.length ? profile.categories : ["All Projects"],
    hero: profile?.hero || {},
    about: profile?.about || {},
    education: profile?.education || {},
    fiverrSteps: profile?.fiverrSteps || [],
    footer: profile?.footer || {},
    experience: experience.map(({ title, company, tagline, dates, description, bullets }) => ({
      title, company, tagline, dates, description, bullets,
    })),
    research: research.map(({ title }) => title),
    certifications: certifications.map(({ title, issuer, issued, credentialId, credentialUrl, skills }) => ({
      title, issuer, issued, credentialId, credentialUrl, skills,
    })),
    expertise: expertise.map(({ icon, title, desc, tags }) => ({ icon, title, desc, tags })),
    skills: Object.fromEntries(skills.map((g) => [g.name, g.items])),
    projects: projects.map((project) => toClientProject(project, req)),
    gigs: gigs.map(({ icon, title, desc, tags }) => ({ icon, title, desc, tags })),
    fiverrProjects: fiverrProjects.map(({ title, desc, tech, year, url }) => ({ title, desc, tech, year, url })),
  });
});

/** PUT /api/admin/profile — update site config & project categories. */
export const updateProfile = asyncHandler(async (req, res) => {
  const { github, email, linkedin, fiverr, instagram, x, categories } = req.body;
  const profile = await Profile.findOneAndUpdate(
    { key: "main" },
    { $set: { github, email, linkedin, fiverr, instagram, x, categories } },
    { new: true, upsert: true, runValidators: true }
  ).lean();
  res.json(profile);
});
