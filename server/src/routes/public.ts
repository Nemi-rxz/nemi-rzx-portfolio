import { Router, Response } from "express";
import { Project } from "../models/Project.js";
import { SiteContent } from "../models/SiteContent.js";
import { usingLocalStore } from "../db.js";
import { localStore } from "../localStore.js";

const router = Router();

router.get("/projects", async (_req, res: Response) => {
  if (usingLocalStore) {
    res.json(await localStore.getPublishedProjects());
    return;
  }

  const projects = await Project.find({ published: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();
  res.json(projects);
});

router.get("/projects/:slug", async (req, res: Response) => {
  if (usingLocalStore) {
    const project = await localStore.getProjectBySlug(req.params.slug);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(project);
    return;
  }

  const project = await Project.findOne({
    slug: req.params.slug,
    published: true,
  }).lean();
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(project);
});

router.get("/site", async (_req, res: Response) => {
  if (usingLocalStore) {
    const site = await localStore.getSite();
    if (!site) {
      res.status(404).json({ error: "Site content not configured." });
      return;
    }
    res.json(site);
    return;
  }

  let site = await SiteContent.findOne().lean();
  if (!site) {
    res.status(404).json({ error: "Site content not configured. Run npm run seed." });
    return;
  }
  res.json(site);
});

router.post("/contact", async (req, res: Response) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  
  // In a real app, you'd send an email here. 
  // For now, we'll just log it and return success.
  console.log(`New contact message from ${name} (${email}): ${message}`);
  
  res.json({ success: true, message: "Message received" });
});

export default router;
