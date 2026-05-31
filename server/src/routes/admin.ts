import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { z } from "zod";
import { requireAuth, AuthRequest } from "../middleware/auth.js";
import { Project } from "../models/Project.js";
import { SiteContent } from "../models/SiteContent.js";
import { slugify } from "../utils/slugify.js";
import { usingLocalStore } from "../db.js";
import { localStore } from "../localStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only images allowed"));
      return;
    }
    cb(null, true);
  },
});

const router = Router();
router.use(requireAuth);

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  tools: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  projectUrl: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  published: z.boolean().optional(),
});

const siteSchema = z.object({
  heroTitle: z.string().optional(),
  heroRole: z.string().optional(),
  heroBio: z.string().optional(),
  heroNameDisplay: z.string().optional(),
  heroAvatarUrl: z.string().optional(),
  valueHeadline: z.string().optional(),
  valueBody: z.string().optional(),
  services: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .optional(),
  socialLinks: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string(),
        label: z.string().optional(),
      })
    )
    .optional(),
  techIcons: z.array(z.string()).optional(),
  clientLogos: z.array(z.string()).optional(),
});

router.get("/projects", async (_req, res: Response) => {
  if (usingLocalStore) {
    res.json(await localStore.getAllProjects());
    return;
  }

  const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  res.json(projects);
});

router.post("/projects", async (req: AuthRequest, res: Response) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const data = parsed.data;
  const slug = data.slug || slugify(data.title);
  if (usingLocalStore) {
    const project = await localStore.createProject({ ...data, slug });
    if (!project) {
      res.status(409).json({ error: "Slug already exists" });
      return;
    }
    res.status(201).json(project);
    return;
  }

  const existing = await Project.findOne({ slug });
  if (existing) {
    res.status(409).json({ error: "Slug already exists" });
    return;
  }
  const project = await Project.create({ ...data, slug });
  res.status(201).json(project);
});

router.put("/projects/:id", async (req: AuthRequest, res: Response) => {
  const parsed = projectSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const data = parsed.data;
  if (data.title && !data.slug) {
    data.slug = slugify(data.title);
  }
  if (usingLocalStore) {
    try {
      const project = await localStore.updateProject(String(req.params.id), data as any);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.json(project);
    } catch (error) {
      res.status(409).json({ error: error instanceof Error ? error.message : "Update failed" });
    }
    return;
  }

  const project = await Project.findByIdAndUpdate(req.params.id, data, {
    new: true,
  });
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(project);
});

router.delete("/projects/:id", async (req: AuthRequest, res: Response) => {
  if (usingLocalStore) {
    const deleted = await localStore.deleteProject(String(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json({ ok: true });
    return;
  }

  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json({ ok: true });
});

router.get("/site", async (_req, res: Response) => {
  if (usingLocalStore) {
    res.json((await localStore.getSite()) || {});
    return;
  }

  const site = await SiteContent.findOne().lean();
  res.json(site || {});
});

router.put("/site", async (req: AuthRequest, res: Response) => {
  const parsed = siteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  if (usingLocalStore) {
    res.json(await localStore.updateSite(parsed.data as any));
    return;
  }

  let site = await SiteContent.findOne();
  if (!site) {
    site = await SiteContent.create(parsed.data);
  } else {
    Object.assign(site, parsed.data);
    await site.save();
  }
  res.json(site);
});

router.post("/upload", upload.single("image"), (req, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

export default router;
