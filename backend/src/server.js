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
const PORT = process.env.PORT || 5000;
const origins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((s) => s.trim());

app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: origins, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));

const uploadsDir = path.resolve(__dirname, "../uploads");
fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

app.use("/api", routes);
app.use("/api", notFound);

// In production, serve the built React app (frontend/dist) from the same server.
const dist = path.resolve(__dirname, "../../frontend/dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.use(errorHandler);

connectDB(process.env.MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`✔ API running on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error("✖ Failed to start:", err.message);
    process.exit(1);
  });
