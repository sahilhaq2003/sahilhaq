import { connectDB } from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  connectDB(process.env.MONGODB_URI)
    .then(() => app.listen(PORT, () => console.log(`✔ API running on http://localhost:${PORT}`)))
    .catch((err) => {
      console.error("✖ Failed to start:", err.message);
      process.exit(1);
    });
}

// Vercel also detects backend/src/server.js when the project's Root Directory
// is set to backend, so export the handler here as well as from root /api.
export default app;
