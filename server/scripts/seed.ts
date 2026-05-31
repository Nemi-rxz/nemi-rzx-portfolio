import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../src/models/User.js";
import { Project } from "../src/models/Project.js";
import { SiteContent } from "../src/models/SiteContent.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/emmanuel-nemi-portfolio";
const adminEmail = process.env.ADMIN_EMAIL || "admin@emmanuelnemi.com";
const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";

async function seed() {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await User.create({ email: adminEmail.toLowerCase(), passwordHash });
    console.log(`Created admin: ${adminEmail}`);
  }

  await SiteContent.deleteMany({});
  await SiteContent.create({
    heroTitle: "Nemi RZX",
    heroRole: "Creative Technologist",
    heroNameDisplay: "NEMI RZX",
    heroBio:
      "Hi, I'm Nemi RZX — a creative technologist focused on full stack web development, multimedia production, digital campaign technology, and SEO. I build digital experiences that perform across web, social, and search.",
    heroAvatarUrl: "",
    valueHeadline:
      "Crafting impactful web products, campaigns, and multimedia that drive measurable results.",
    valueBody:
      "From strategy to ship, I combine engineering, storytelling, and growth tactics so brands show up consistently across every channel.",
    services: [
      {
        title: "Full Stack Web Development",
        description:
          "React, Node.js, APIs, and production-ready apps built for performance and scale.",
        imageUrl: "/images/service-web.jpg",
        order: 0,
      },
      {
        title: "Multimedia Production",
        description:
          "Video, motion, and rich media assets aligned with your brand narrative.",
        imageUrl: "/images/service-multimedia.jpg",
        order: 1,
      },
      {
        title: "Digital Campaign Technology",
        description:
          "Landing pages, tracking, integrations, and campaign infrastructure that converts.",
        imageUrl: "/images/service-campaign.jpg",
        order: 2,
      },
      {
        title: "SEO Services",
        description:
          "Technical SEO, content structure, and analytics to grow organic visibility.",
        imageUrl: "/images/service-seo.jpg",
        order: 3,
      },
    ],
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com", label: "LinkedIn" },
      { platform: "github", url: "https://github.com/nemirzx", label: "GitHub" },
      { platform: "email", url: "mailto:hello@nemirzx.com", label: "Email" },
      { platform: "instagram", url: "https://instagram.com/nemirzx", label: "Instagram" },
    ],
    techIcons: ["React", "Node.js", "TypeScript", "MongoDB", "SEO", "Premiere"],
    clientLogos: [],
  });
  console.log("Site content seeded");

  await Project.deleteMany({});
  await Project.insertMany([
    {
      title: "Campaign Landing Platform",
      slug: "campaign-landing-platform",
      category: "Digital Campaign Technology",
      description:
        "Sample project — high-converting landing system with analytics and A/B-ready structure. Replace in admin.",
      tools: ["React", "Node.js", "Analytics"],
      imageUrl: "/images/project-1.jpg",
      projectUrl: "#",
      featured: true,
      order: 0,
      published: true,
    },
    {
      title: "Brand Multimedia Suite",
      slug: "brand-multimedia-suite",
      category: "Multimedia Production",
      description:
        "Sample project — video and motion assets for a multi-channel brand launch. Replace in admin.",
      tools: ["Premiere", "After Effects", "Web"],
      imageUrl: "/images/project-2.jpg",
      projectUrl: "#",
      featured: true,
      order: 1,
      published: true,
    },
    {
      title: "SEO Growth Dashboard",
      slug: "seo-growth-dashboard",
      category: "SEO Services",
      description:
        "Sample project — technical SEO audit tooling and reporting. Replace in admin.",
      tools: ["SEO", "React", "APIs"],
      imageUrl: "/images/project-3.jpg",
      projectUrl: "#",
      featured: false,
      order: 2,
      published: true,
    },
  ]);
  console.log("Projects seeded");

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
