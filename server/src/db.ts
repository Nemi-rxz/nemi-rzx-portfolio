import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { config } from "./config.js";
import { User } from "./models/User.js";
import { ensureLocalAdminUser } from "./localStore.js";

export let usingLocalStore = false;

export async function connectDb(): Promise<void> {
  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 2500 });
    console.log("MongoDB connected");
  } catch (error) {
    usingLocalStore = true;
    console.warn("MongoDB unavailable. Using local JSON data store for development.");
    console.warn(error instanceof Error ? error.message : error);
  }
}

export async function ensureAdminUser(): Promise<void> {
  if (usingLocalStore) {
    await ensureLocalAdminUser();
    console.log(`Local admin ready: ${config.adminEmail}`);
    return;
  }

  const count = await User.countDocuments();
  if (count > 0) return;
  const passwordHash = await bcrypt.hash(config.adminPassword, 12);
  await User.create({
    email: config.adminEmail.toLowerCase(),
    passwordHash,
  });
  console.log(`Admin user created: ${config.adminEmail}`);
}
