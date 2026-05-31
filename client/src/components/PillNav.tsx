import { FiArrowRight, FiShoppingBag, FiCheck } from "react-icons/fi";

export default function PillNav() {
  return (
    <nav className="pill-nav" aria-label="Primary">
      <a href="#projects" className="pill-btn">
        <span className="pill-icon">
          <FiArrowRight />
        </span>
        See my work
      </a>
      <a href="#projects" className="pill-btn">
        <span className="pill-icon">
          <FiShoppingBag />
        </span>
        My catalog
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
