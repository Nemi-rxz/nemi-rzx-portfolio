import { useEffect, useState, lazy, Suspense } from "react";
import { api } from "../api/client";
import type { Project, SiteContent } from "../types";
import PillNav from "../components/PillNav";
import Hero from "../components/Hero";
import TechStrip from "../components/TechStrip";
import ValueSection from "../components/ValueSection";
import ServicesGrid from "../components/ServicesGrid";
import ProjectsGrid from "../components/ProjectsGrid";
import ContactFooter from "../components/ContactFooter";
import ContactForm from "../components/ContactForm";

const CharacterModel = lazy(() => import("../components/Character"));
const defaultProjects: Project[] = [
  {
    _id: "default-brand-website-editorial-platform",
    title: "Brand Website/Editorial Platform",
    slug: "brand-website-editorial-platform",
    category: "Web Development",
    description:
      "A modern editorial website with CMS, lead capture, and SEO-focused structure built to grow brand visibility.",
    tools: ["React", "Node.js", "MongoDB", "n8n", "Workflow Automation"],
    imageUrl: "/images/project-brand-website.jpg",
    projectUrl: "https://kaboomklub-website.vercel.app",
    featured: true,
    order: 0,
    published: true,
  },
  {
    _id: "default-emmanuel-nemi-iwo-portfolio-system",
    title: "Emmanuel Nemi Iwo Portfolio System",
    slug: "emmanuel-nemi-iwo-portfolio-system",
    category: "Web Development",
    description:
      "A polished portfolio platform that presents creative-technology work, qualifications, and services in one web experience.",
    tools: [
      "React",
      "Node.js",
      "MongoDB",
      "Vercel",
      "n8n",
      "Workflow Automation",
      "Programming",
    ],
    imageUrl: "/images/project-nemi-portfolio.jpg",
    projectUrl: "https://nemi-rzx-portfolio-client.vercel.app",
    featured: true,
    order: 1,
    published: true,
  },
  {
    _id: "default-music-campaign-microsite",
    title: "Music Campaign Microsite",
    slug: "music-campaign-microsite",
    category: "Web Development",
    description:
      "A campaign microsite designed to capture attention, drive conversions, and track launch performance with measurable results.",
    tools: ["React", "Node.js", "Vercel", "n8n", "Workflow Automation"],
    imageUrl: "/images/project-music-campaign.jpg",
    projectUrl: "https://package-gold.vercel.app",
    featured: true,
    order: 2,
    published: true,
  },
];

const defaultSiteContent: SiteContent = {
  heroTitle: "Nemi RZX",
  heroRole: "Creative Technologist",
  heroBio:
    "I am Emmanuel Nemi, a creative technologist building web products, multimedia systems, campaign experiences, and SEO-ready digital platforms for ambitious brands.",
  heroNameDisplay: "EMMANUEL NEMI",
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
    {
      title: "Automation Services",
      description: "Designs automated workflows, integrations, and coded systems that save time and scale operations.",
      imageUrl: "/images/service-automation.jpg",
      order: 4,
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
    "Automation Specialist",
    "n8n",
    "Workflow Automation",
    "Programming",
    "SEO",
    "Canva",
    "Figma",
    "Sanity",
    "WordPress",
  ],
  clientLogos: [],
};

export default function PortfolioPage() {
  const [site, setSite] = useState<SiteContent>(defaultSiteContent);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [error, setError] = useState<string | null>(null);
  const [showCharacter, setShowCharacter] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.allSettled([api.getSite(), api.getProjects()]).then((results) => {
      if (!active) return;

      const [siteResult, projectsResult] = results;

      if (siteResult.status === "fulfilled") {
        setSite(siteResult.value);
      }

      if (projectsResult.status === "fulfilled") {
        setProjects(projectsResult.value);
      }

      const rejected = results.find(
        (result): result is PromiseRejectedResult => result.status === "rejected"
      );
      if (rejected) {
        setError(
          rejected.reason instanceof Error
            ? rejected.reason.message
            : "Some content could not be loaded"
        );
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const update = () => setShowCharacter(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div className="page portfolio-3d-layout">
      {error && (
        <div className="error-banner">
          {error}. Some live content could not be loaded.
        </div>
      )}
      {showCharacter && (
        <Suspense fallback={null}>
          <div className="character-background">
            <CharacterModel />
          </div>
        </Suspense>
      )}
      
      <div className="content-layer">
        <PillNav />
        <div className="landing-section">
          <Hero site={site} />
        </div>
        <TechStrip icons={site.techIcons} />
        <div className="about-section">
          <ValueSection
            valueHeadline={site.valueHeadline}
            valueBody={site.valueBody}
            clientLogos={site.clientLogos}
          />
        </div>
        <div className="whatIDO">
          <ServicesGrid services={site.services} />
        </div>
        <div className="career-section">
          <ProjectsGrid projects={projects} />
        </div>
        <ContactForm />
        <ContactFooter
          socialLinks={site.socialLinks}
          contactHeading={site.contactHeading}
          footerNote={site.footerNote}
        />
      </div>
    </div>
  );
}
