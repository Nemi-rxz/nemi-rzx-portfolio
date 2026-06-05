import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { config } from "./config.js";
import { slugify } from "./utils/slugify.js";

type UserRecord = {
  _id: string;
  email: string;
  passwordHash: string;
};

type ProjectRecord = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  tools: string[];
  imageUrl: string;
  projectUrl: string;
  featured: boolean;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

type SiteRecord = {
  _id: string;
  heroTitle: string;
  heroRole: string;
  heroBio: string;
  heroNameDisplay: string;
  heroAvatarUrl: string;
  valueHeadline: string;
  valueBody: string;
  contactHeading: string;
  footerNote: string;
  services: Array<{
    title: string;
    description: string;
    imageUrl: string;
    order: number;
  }>;
  socialLinks: Array<{
    platform: string;
    url: string;
    label: string;
  }>;
  techIcons: string[];
  clientLogos: string[];
  createdAt: string;
  updatedAt: string;
};

type StoreData = {
  users: UserRecord[];
  site: SiteRecord | null;
  projects: ProjectRecord[];
};

type SeedSiteRecord = Omit<SiteRecord, "_id" | "createdAt" | "updatedAt">;
type SeedProjectRecord = Omit<ProjectRecord, "_id" | "createdAt" | "updatedAt">;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../data");
const dataFile = path.join(dataDir, "dev-db.json");

const now = () => new Date().toISOString();
const id = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

export const seedSiteContent: SeedSiteRecord = {
  heroTitle: "Nemi RZX",
  heroRole: "Creative Technologist",
  heroNameDisplay: "EMMANUEL NEMI",
  heroBio:
    "I am Emmanuel Nemi, a creative technologist building web products, multimedia systems, campaign experiences, and SEO-ready digital platforms for ambitious brands.",
  heroAvatarUrl: "/images/emmanuel-nemi-hero.jpg",
  valueHeadline:
    "I turn technical ideas, visual stories, and growth goals into polished digital experiences.",
  valueBody:
    "My work blends engineering, design judgment, content systems, and campaign thinking so every project can look sharp, load fast, and convert across web, social, and search.",
  contactHeading: "Let's build something great together",
  footerNote: "Available for freelance, partnerships, and digital product work.",
  services: [
    {
      title: "Digital Experience/Web Developer",
      description: "Builds fast, modern websites and web apps for brands and campaigns.",
      imageUrl: "/images/service-digital-experience.jpg",
      order: 0,
    },
    {
      title: "Multimedia Production",
      description: "Creates visual content, motion assets, and media for launches and promotions.",
      imageUrl: "/images/service-multimedia.jpg",
      order: 1,
    },
    {
      title: "Digital Campaign Technology",
      description: "Develops landing pages, funnels, and campaign systems that drive action.",
      imageUrl: "/images/service-campaign.jpg",
      order: 2,
    },
    {
      title: "SEO Services",
      description: "Improves search visibility with technical SEO, content structure, and analytics.",
      imageUrl: "/images/service-seo.jpg",
      order: 3,
    },
  ],
  socialLinks: [
    { platform: "github", url: "https://github.com/Nemi-rxz", label: "GitHub" },
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/in/emmanuel-nemi-5019a3ba",
      label: "LinkedIn",
    },
    { platform: "instagram", url: "https://www.instagram.com/nemi.rzx/", label: "Instagram" },
    { platform: "email", url: "mailto:emwoiwo@gmail.com", label: "Email" },
    { platform: "resume", url: "/Emmanuel_Iwo_CV.pdf", label: "Resume" },
    { platform: "whatsapp", url: "https://wa.me/2348082103542", label: "WhatsApp" },
    { platform: "x", url: "https://x.com/nemi_rzx?s=11", label: "X" },
  ],
  techIcons: [
    "React",
    "Node.js",
    "TypeScript",
    "MongoDB",
    "Vercel",
    "SEO",
    "Canva",
    "Figma",
    "Sanity",
    "WordPress",
  ],
  clientLogos: [],
};

export const seedProjects: SeedProjectRecord[] = [
  {
    title: "Brand Website/Editorial Platform",
    slug: "brand-website-editorial-platform",
    category: "Web Development",
    description:
      "A modern editorial website with CMS, lead capture, and SEO-focused structure built to grow brand visibility.",
    tools: ["React", "Node.js", "MongoDB"],
    imageUrl: "/images/project-brand-website.jpg",
    projectUrl: "https://kaboomklub-website.vercel.app",
    featured: true,
    order: 0,
    published: true,
  },
  {
    title: "Emmanuel Nemi Iwo Portfolio System",
    slug: "emmanuel-nemi-iwo-portfolio-system",
    category: "Web Development",
    description:
      "A polished portfolio platform that presents creative-technology work, qualifications, and services in one web experience.",
    tools: ["React", "Node.js", "MongoDB", "Vercel"],
    imageUrl: "/images/project-nemi-portfolio.jpg",
    projectUrl: "https://nemi-rzx-portfolio-client.vercel.app",
    featured: true,
    order: 1,
    published: true,
  },
  {
    title: "Music Campaign Microsite",
    slug: "music-campaign-microsite",
    category: "Web Development",
    description:
      "A campaign microsite designed to capture attention, drive conversions, and track launch performance with measurable results.",
    tools: ["React", "Node.js", "Vercel"],
    imageUrl: "/images/project-music-campaign.jpg",
    projectUrl: "https://package-gold.vercel.app",
    featured: true,
    order: 2,
    published: true,
  },
];

function defaultSite(): SiteRecord {
  const date = now();
  return {
    _id: id(),
    ...seedSiteContent,
    createdAt: date,
    updatedAt: date,
  };
}

function defaultProjects(): ProjectRecord[] {
  const date = now();
  return seedProjects.map((project) => ({
    _id: id(),
    ...project,
    createdAt: date,
    updatedAt: date,
  }));
}

async function readStore(): Promise<StoreData> {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    return JSON.parse(raw) as StoreData;
  } catch {
    const passwordHash = await bcrypt.hash(config.adminPassword, 12);
    const data: StoreData = {
      users: [
        {
          _id: id(),
          email: config.adminEmail.toLowerCase(),
          passwordHash,
        },
      ],
      site: defaultSite(),
      projects: defaultProjects(),
    };
    await writeStore(data);
    return data;
  }
}

async function writeStore(data: StoreData): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

export async function ensureLocalAdminUser(): Promise<void> {
  const data = await readStore();
  if (data.users.some((user) => user.email === config.adminEmail.toLowerCase())) return;

  data.users.push({
    _id: id(),
    email: config.adminEmail.toLowerCase(),
    passwordHash: await bcrypt.hash(config.adminPassword, 12),
  });
  await writeStore(data);
}

export async function ensureLocalSiteContent(): Promise<void> {
  const data = await readStore();
  if (data.site) return;

  data.site = defaultSite();
  await writeStore(data);
}

export async function ensureLocalProjects(): Promise<void> {
  const data = await readStore();
  if (data.projects.length > 0) return;

  data.projects = defaultProjects();
  await writeStore(data);
}

export const localStore = {
  async getPublishedProjects() {
    const data = await readStore();
    return data.projects
      .filter((project) => project.published)
      .sort((a, b) => a.order - b.order || b.createdAt.localeCompare(a.createdAt));
  },

  async getAllProjects() {
    const data = await readStore();
    return data.projects.sort((a, b) => a.order - b.order || b.createdAt.localeCompare(a.createdAt));
  },

  async getProjectBySlug(slug: string) {
    const data = await readStore();
    return data.projects.find((project) => project.slug === slug && project.published) || null;
  },

  async createProject(input: Partial<ProjectRecord> & { title: string }) {
    const data = await readStore();
    const slug = input.slug || slugify(input.title);
    if (data.projects.some((project) => project.slug === slug)) return null;

    const date = now();
    const project: ProjectRecord = {
      _id: id(),
      title: input.title,
      slug,
      category: input.category || "",
      description: input.description || "",
      tools: input.tools || [],
      imageUrl: input.imageUrl || "",
      projectUrl: input.projectUrl || "",
      featured: input.featured ?? false,
      order: input.order ?? 0,
      published: input.published ?? true,
      createdAt: date,
      updatedAt: date,
    };
    data.projects.push(project);
    await writeStore(data);
    return project;
  },

  async updateProject(projectId: string, input: Partial<ProjectRecord>) {
    const data = await readStore();
    const project = data.projects.find((item) => item._id === projectId);
    if (!project) return null;

    const nextSlug = input.slug || (input.title ? slugify(input.title) : project.slug);
    const duplicate = data.projects.some((item) => item._id !== projectId && item.slug === nextSlug);
    if (duplicate) throw new Error("Slug already exists");

    Object.assign(project, input, { slug: nextSlug, updatedAt: now() });
    await writeStore(data);
    return project;
  },

  async deleteProject(projectId: string) {
    const data = await readStore();
    const next = data.projects.filter((project) => project._id !== projectId);
    if (next.length === data.projects.length) return false;
    data.projects = next;
    await writeStore(data);
    return true;
  },

  async getSite() {
    const data = await readStore();
    return data.site;
  },

  async updateSite(input: Partial<SiteRecord>) {
    const data = await readStore();
    data.site = {
      ...(data.site || defaultSite()),
      ...input,
      updatedAt: now(),
    };
    await writeStore(data);
    return data.site;
  },

  async getUserByEmail(email: string) {
    const data = await readStore();
    return data.users.find((user) => user.email === email.toLowerCase()) || null;
  },

  async getUserById(userId: string) {
    const data = await readStore();
    return data.users.find((user) => user._id === userId) || null;
  },
};
