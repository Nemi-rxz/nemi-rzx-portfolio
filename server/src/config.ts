import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const config = {
  port: Number(process.env.PORT) || 3001,
  mongoUri:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/emmanuel-nemi-portfolio",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",
  adminEmail: process.env.ADMIN_EMAIL || "admin@emmanuelnemi.com",
  adminPassword: process.env.ADMIN_PASSWORD || "changeme123",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development",
};
