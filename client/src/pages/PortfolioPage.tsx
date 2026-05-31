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

export default function PortfolioPage() {
  const [site, setSite] = useState<SiteContent | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getSite(), api.getProjects()])
      .then(([s, p]) => {
        setSite(s);
        setProjects(p);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="page">
        <div className="error-banner">
          {error}. Start the API and run <code>npm run seed</code> from the project root.
        </div>
      </div>
    );
  }

  if (!site) {
    return <div className="loading-screen">LOADING</div>;
  }

  return (
    <div className="page portfolio-3d-layout">
      <Suspense fallback={null}>
        <div className="character-background">
          <CharacterModel />
        </div>
      </Suspense>
      
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
        <ContactFooter socialLinks={site.socialLinks} />
      </div>
    </div>
  );
}
