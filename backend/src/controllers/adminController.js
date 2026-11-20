import multer from "multer";
import Project from "../models/Project.js";
import Message from "../models/Message.js";
import Image from "../models/Image.js";
import { Expertise, SkillGroup, Gig, FiverrProject, Profile, Experience, ResearchInterest, Certification } from "../models/Content.js";
import { asyncHandler } from "../middleware/index.js";
import { resolveImageUrl, resolveImageUrls } from "../utils/imageUrl.js";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      const err = new Error("Only JPG, PNG, and WEBP images are allowed.");
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  },
}).single("file");

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });
  const doc = await Image.create({
    filename: req.file.originalname || "upload",
    contentType: req.file.mimetype,
    data: req.file.buffer,
  });
  const path = `/api/images/${doc._id}`;
  res.status(201).json({ id: doc._id, url: resolveImageUrl(req, path) });
});

export const getImage = asyncHandler(async (req, res) => {
  const doc = await Image.findById(req.params.id).select("contentType data");
  if (!doc) return res.status(404).json({ error: "Image not found" });
  res.set("Content-Type", doc.contentType);
  res.set("Content-Length", String(doc.data.length));
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
  res.set("Cache-Control", "public, max-age=31536000, immutable");
  res.send(doc.data);
});

export const getStats = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [projects, totalMessages, unreadMessages, recentMessages] = await Promise.all([
    Project.countDocuments(),
    Message.countDocuments(),
    Message.countDocuments({ read: false }),
    Message.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
  ]);
  res.json({ projects, totalMessages, unreadMessages, recentMessages });
});

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ key: "main" }).lean();
  res.json(profile ? { ...profile, portrait: resolveImageUrl(req, profile.portrait) } : {});
});

export const updateProfile = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  delete body._id;
  delete body.key;
  const profile = await Profile.findOneAndUpdate(
    { key: "main" },
    { $set: body },
    { new: true, upsert: true, runValidators: true }
  ).lean();
  res.json(profile);
});

export const listAdminMessages = asyncHandler(async (req, res) => {
  const { search = "", read, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (read === "true") filter.read = true;
  if (read === "false") filter.read = false;
  if (search.trim()) {
    const rx = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { email: rx }, { subject: rx }, { message: rx }];
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
  const [items, total] = await Promise.all([
    Message.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
    Message.countDocuments(filter),
  ]);

  res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 });
});

const RESOURCES = {
  projects: Project,
  expertise: Expertise,
  "skill-groups": SkillGroup,
  gigs: Gig,
  "fiverr-projects": FiverrProject,
  experience: Experience,
  "research-interests": ResearchInterest,
  certifications: Certification,
};

function getModel(resource) {
  const Model = RESOURCES[resource];
  if (!Model) {
    const err = new Error(`Unknown resource: ${resource}`);
    err.status = 404;
    throw err;
  }
  return Model;
}

export const listResource = asyncHandler(async (req, res) => {
  const Model = getModel(req.params.resource);
  const items = await Model.find().sort({ order: 1, createdAt: 1 }).lean();
  if (req.params.resource === "projects") {
    return res.json(items.map((item) => ({
      ...item,
      screenshots: resolveImageUrls(req, item.screenshots),
    })));
  }
  res.json(items);
});

export const createResource = asyncHandler(async (req, res) => {
  const Model = getModel(req.params.resource);
  const body = { ...req.body };
  delete body._id;
  if (req.params.resource === "projects" && !body.slug && body.title) {
    body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  const doc = await Model.create(body);
  res.status(201).json(doc);
});

export const updateResource = asyncHandler(async (req, res) => {
  const Model = getModel(req.params.resource);
  const body = { ...req.body };
  delete body._id;
  const doc = await Model.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
  if (!doc) return res.status(404).json({ error: "Item not found" });
  res.json(doc);
});

export const deleteResource = asyncHandler(async (req, res) => {
  const Model = getModel(req.params.resource);
  const doc = await Model.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Item not found" });
  res.json({ deleted: true, id: doc._id });
});

export const reorderResource = asyncHandler(async (req, res) => {
  const Model = getModel(req.params.resource);
  const items = Array.isArray(req.body) ? req.body : req.body?.items;
  if (!Array.isArray(items)) return res.status(400).json({ error: "Expected an array of { id, order }" });

  await Promise.all(
    items.map(({ id, order }) => Model.findByIdAndUpdate(id, { $set: { order: Number(order) || 0 } }))
  );
  res.json({ ok: true });
});
