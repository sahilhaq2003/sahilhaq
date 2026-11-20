import jwt from "jsonwebtoken";

/** Wraps async route handlers so errors reach the error middleware. */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/** Protects admin routes: requires valid JWT in `admin_token` httpOnly cookie. */
export function requireAuth(req, res, next) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(503).json({ error: "Admin authentication is not configured." });
  }
  const token = req.cookies?.admin_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.admin = jwt.verify(token, secret);
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export function notFound(req, res) {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.name === "ValidationError") {
    const errors = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
    return res.status(400).json({ error: "Validation failed", errors });
  }
  if (err.name === "CastError") return res.status(400).json({ error: "Invalid id" });
  if (err.code === 11000) return res.status(409).json({ error: "Duplicate value", fields: err.keyValue });
  console.error(err);
  res.status(err.status || 500).json({ error: err.status ? err.message : "Server error" });
}
