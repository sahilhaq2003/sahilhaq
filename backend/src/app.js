import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const origins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: origins, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));

// Serverless instances are reused between requests. connectDB caches the in-flight
// connection so warm requests do not create a new MongoDB connection each time.
app.use("/api", async (req, res, next) => {
  // Keep health reachable when a deployment has not been configured yet. If a
  // URI is present, health also verifies that MongoDB can actually connect.
  if (req.path === "/health" && !process.env.MONGODB_URI) return next();

  try {
    await connectDB(process.env.MONGODB_URI);
    next();
  } catch (error) {
    const serviceError = new Error("Database connection unavailable.", { cause: error });
    serviceError.status = 503;
    next(serviceError);
  }
});

app.use("/api", routes);
app.use("/api", notFound);

// Keep the standalone Node server capable of serving a production frontend.
// Vercel serves frontend/dist directly and sends only /api requests here.
const dist = path.resolve(__dirname, "../../frontend/dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.use(errorHandler);

export default app;
