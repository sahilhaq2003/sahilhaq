import { Router } from "express";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { requireAuth } from "../middleware/index.js";
import { login, logout, me } from "../controllers/authController.js";
import { getPortfolio } from "../controllers/portfolioController.js";
import {
  listProjects, getProject, createProject, updateProject, deleteProject,
} from "../controllers/projectController.js";
import {
  createMessage, listMessages, updateMessage, deleteMessage,
} from "../controllers/messageController.js";
import {
  uploadMiddleware, uploadImage, getImage, getStats, getProfile, updateProfile,
  listAdminMessages, listResource, createResource, updateResource, deleteResource, reorderResource,
} from "../controllers/adminController.js";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many messages. Please try again later." },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again in 15 minutes." },
});

router.get("/health", (req, res) =>
  res.json({
    ok: true,
    environment: process.env.VERCEL ? "vercel" : "node",
    database: {
      configured: Boolean(process.env.MONGODB_URI),
      status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    },
  })
);

// Auth
router.post("/auth/login", loginLimiter, login);
router.post("/auth/logout", logout);
router.get("/auth/me", requireAuth, me);

// Public portfolio
router.get("/portfolio", getPortfolio);
router.get("/images/:id", getImage);
router.get("/projects", listProjects);
router.get("/projects/:slug", getProject);
router.post("/messages", contactLimiter, createMessage);

// Protected legacy endpoints
router.post("/projects", requireAuth, createProject);
router.put("/projects/:id", requireAuth, updateProject);
router.delete("/projects/:id", requireAuth, deleteProject);
router.get("/messages", requireAuth, listMessages);
router.patch("/messages/:id", requireAuth, updateMessage);
router.delete("/messages/:id", requireAuth, deleteMessage);

// Admin dashboard endpoints
router.get("/admin/stats", requireAuth, getStats);
router.get("/admin/profile", requireAuth, getProfile);
router.put("/admin/profile", requireAuth, updateProfile);
router.get("/admin/messages", requireAuth, listAdminMessages);
router.patch("/admin/messages/:id", requireAuth, updateMessage);
router.delete("/admin/messages/:id", requireAuth, deleteMessage);
router.post("/admin/upload", requireAuth, uploadMiddleware, uploadImage);

router.patch("/admin/:resource/reorder", requireAuth, reorderResource);
router.get("/admin/:resource", requireAuth, listResource);
router.post("/admin/:resource", requireAuth, createResource);
router.put("/admin/:resource/:id", requireAuth, updateResource);
router.delete("/admin/:resource/:id", requireAuth, deleteResource);

export default router;
