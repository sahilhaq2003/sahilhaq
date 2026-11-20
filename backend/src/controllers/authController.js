import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../middleware/index.js";

const COOKIE_NAME = "admin_token";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function cookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: SEVEN_DAYS_MS,
    path: "/",
  };
}

/** POST /api/auth/login — verify email + password and set httpOnly JWT cookie. */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminEmail || !adminHash || !jwtSecret) {
    return res.status(503).json({ error: "Admin authentication is not configured." });
  }

  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const emailMatch = email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
  const passwordMatch = emailMatch ? await bcrypt.compare(password, adminHash) : false;

  if (!emailMatch || !passwordMatch) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = jwt.sign({ email: adminEmail, role: "admin" }, jwtSecret, { expiresIn: "7d" });
  res.cookie(COOKIE_NAME, token, cookieOptions());
  res.json({ ok: true, email: adminEmail });
});

/** POST /api/auth/logout — clear the auth cookie. */
export const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined });
  res.json({ ok: true });
};

/** GET /api/auth/me — return current authenticated admin. */
export const me = (req, res) => {
  res.json({ ok: true, email: req.admin.email });
};
