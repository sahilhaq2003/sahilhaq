import Message from "../models/Message.js";
import { asyncHandler } from "../middleware/index.js";

const PROJECT_TYPES = [
  "Software project", "Data / analytics", "AI / ML", "Research collaboration", "Job opportunity", "Other",
];

/** POST /api/messages — public contact form. Mirrors the frontend validation. */
export const createMessage = asyncHandler(async (req, res) => {
  const { name = "", email = "", type = "Other", message = "", website = "" } = req.body || {};

  // Honeypot: bots fill the hidden "website" field; pretend success and drop it.
  if (website) return res.status(201).json({ ok: true });

  const errors = {};
  if (String(name).trim().length < 2) errors.name = "Please enter your name";
  if (!/^\S+@\S+\.\S+$/.test(String(email))) errors.email = "Enter a valid email";
  if (String(message).trim().length < 10) errors.message = "Message is too short";
  if (Object.keys(errors).length) return res.status(400).json({ error: "Validation failed", errors });

  const doc = await Message.create({
    name,
    email,
    type: PROJECT_TYPES.includes(type) ? type : "Other",
    message,
    ip: req.ip,
  });
  res.status(201).json({ ok: true, id: doc._id });
});

/** GET /api/messages (admin) — newest first; ?unread=true to filter. */
export const listMessages = asyncHandler(async (req, res) => {
  const filter = req.query.unread === "true" ? { read: false } : {};
  const messages = await Message.find(filter).sort({ createdAt: -1 }).limit(500).lean();
  res.json(messages);
});

/** PATCH /api/messages/:id (admin) — e.g. { "read": true } */
export const updateMessage = asyncHandler(async (req, res) => {
  const m = await Message.findByIdAndUpdate(req.params.id, { read: Boolean(req.body.read) }, { new: true });
  if (!m) return res.status(404).json({ error: "Message not found" });
  res.json(m);
});

/** DELETE /api/messages/:id (admin) */
export const deleteMessage = asyncHandler(async (req, res) => {
  const m = await Message.findByIdAndDelete(req.params.id);
  if (!m) return res.status(404).json({ error: "Message not found" });
  res.json({ ok: true });
});
