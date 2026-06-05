import { FiArrowRight, FiDownload, FiCheck } from "react-icons/fi";

export default function PillNav() {
  return (
    <nav className="pill-nav" aria-label="Primary">
      <a href="#projects" className="pill-btn">
        <span className="pill-icon">
          <FiArrowRight />
        </span>
        See my work
      </a>
      <a href="/Emmanuel_Iwo_CV.pdf" className="pill-btn" target="_blank" rel="noreferrer">
        <span className="pill-icon">
          <FiDownload />
        </span>
        Download CV
      </a>
      <a href="#contact" className="pill-btn">
        <span className="pill-icon">
          <FiCheck />
        </span>
        Book a service
      </a>
    </nav>
  );
}
