import mongoose from "mongoose";

let connectionPromise;

export async function connectDB(uri) {
  if (!uri) throw new Error("MONGODB_URI is not set. Copy .env.example to .env and configure it.");

  if (mongoose.connection.readyState === 1) return mongoose.connection;

  mongoose.set("strictQuery", true);
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  await connectionPromise;
  console.log(`✔ MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  return mongoose.connection;
}
