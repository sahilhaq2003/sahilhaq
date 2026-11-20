import Project from "../models/Project.js";
import { asyncHandler } from "../middleware/index.js";
import { toClientProject } from "./portfolioController.js";

const EDITABLE = [
  "slug", "title", "label", "cats", "desc", "prob", "sol", "features", "methods",
  "arch", "contrib", "tech", "github", "demo", "order", "published",
];
const pick = (body) => Object.fromEntries(EDITABLE.filter((k) => k in body).map((k) => [k, body[k]]));

/** GET /api/projects?category=Data%20Science */
export const listProjects = asyncHandler(async (req, res) => {
  const filter = { published: true };
  if (req.query.category && req.query.category !== "All Projects") filter.cats = req.query.category;
  const projects = await Project.find(filter).sort({ order: 1, createdAt: 1 }).lean();
  res.json(projects.map((project) => toClientProject(project, req)));
});

/** GET /api/projects/:slug */
export const getProject = asyncHandler(async (req, res) => {
  const p = await Project.findOne({ slug: req.params.slug, published: true }).lean();
  if (!p) return res.status(404).json({ error: "Project not found" });
  res.json(toClientProject(p, req));
});

/** POST /api/projects (admin) */
export const createProject = asyncHandler(async (req, res) => {
  const p = await Project.create(pick(req.body));
  res.status(201).json(p);
});

/** PUT /api/projects/:id (admin) */
export const updateProject = asyncHandler(async (req, res) => {
  const p = await Project.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true });
  if (!p) return res.status(404).json({ error: "Project not found" });
  res.json(p);
});

/** DELETE /api/projects/:id (admin) */
export const deleteProject = asyncHandler(async (req, res) => {
  const p = await Project.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ error: "Project not found" });
  res.json({ ok: true });
});
