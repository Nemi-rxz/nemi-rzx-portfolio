import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "../src/config.js";
import { seedProjects, seedSiteContent } from "../src/localStore.js";
import { User } from "../src/models/User.js";
import { Project } from "../src/models/Project.js";
import { SiteContent } from "../src/models/SiteContent.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function seed() {
  await mongoose.connect(config.mongoUri);
  console.log("Connected to MongoDB");

  const existingUser = await User.findOne({ email: config.adminEmail.toLowerCase() });
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(config.adminPassword, 12);
    await User.create({ email: config.adminEmail.toLowerCase(), passwordHash });
    console.log(`Created admin: ${config.adminEmail}`);
  }

  await SiteContent.deleteMany({});
  await SiteContent.create(seedSiteContent);
  console.log("Site content seeded");

  await Project.deleteMany({});
  await Project.insertMany(seedProjects);
  console.log("Projects seeded");

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
