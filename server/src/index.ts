import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config.js";
import { connectDb } from "./db.js";
import authRoutes from "./routes/auth.js";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import { autoSeed } from "./autoSeed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, "../uploads");

const app = express();

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(uploadsDir));

app.use("/api/auth", authRoutes);
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/", (_req, res) => {
  res.json({ message: "Nemi RZX Portfolio API is running!", status: "ok" });
});

async function start() {
  await connectDb();
  await autoSeed();
  app.listen(config.port, () => {
    console.log(`API running on http://localhost:${config.port}`);
    console.log("Ready for requests! 🚀");
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
