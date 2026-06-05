import bcrypt from "bcrypt";
import { config } from "./config.js";
import { usingLocalStore } from "./db.js";
import {
  ensureLocalAdminUser,
  ensureLocalSiteContent,
  ensureLocalProjects,
  seedProjects,
  seedSiteContent,
} from "./localStore.js";
import { User } from "./models/User.js";
import { Project } from "./models/Project.js";
import { SiteContent } from "./models/SiteContent.js";

export async function autoSeed() {
  if (usingLocalStore) {
    console.log("Using local store, skipping MongoDB auto-seed");
    await ensureLocalAdminUser();
    await ensureLocalSiteContent();
    await ensureLocalProjects();
    return;
  }

  // Check if admin exists (MongoDB)
  const adminEmail = config.adminEmail.toLowerCase();
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const passwordHash = await bcrypt.hash(config.adminPassword, 12);
    await User.create({ email: adminEmail, passwordHash });
  }

  // Check if site content exists (MongoDB)
  const existingSite = await SiteContent.findOne();
  if (!existingSite) {
    await SiteContent.create(seedSiteContent);
    console.log("Auto-seeded site content");
  }

  // Check if projects exist (MongoDB)
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany(seedProjects);
    console.log("Auto-seeded projects");
  }
}
