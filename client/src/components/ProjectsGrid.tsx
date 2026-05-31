import { FiExternalLink } from "react-icons/fi";
import type { Project } from "../types";

type Props = { projects: Project[] };

export default function ProjectsGrid({ projects }: Props) {
  if (!projects.length) {
    return (
      <section className="projects-section" id="projects">
        <div className="section-container">
          <h2 className="projects-heading">My Work</h2>
          <p className="empty-state">Projects coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="projects-section" id="projects">
      <div className="section-container">
        <h2 className="projects-heading">My Work</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <article key={project._id} className="project-card">
              <div className="project-image">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : null}
              </div>
              <div className="project-body">
                <span className="project-category">{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tools">
                  {project.tools?.map((t) => (
                    <span key={t} className="project-tool">
                      {t}
                    </span>
                  ))}
                </div>
                {project.projectUrl && project.projectUrl !== "#" && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    View project <FiExternalLink />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
