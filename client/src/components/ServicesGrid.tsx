import { FiChevronRight } from "react-icons/fi";
import type { Service } from "../types";

type Props = { services: Service[] };

export default function ServicesGrid({ services }: Props) {
  const sorted = [...services].sort((a, b) => a.order - b.order);

  return (
    <section className="services-section" id="services">
      <div className="section-container">
        <h2 className="services-heading">what i do</h2>
        <div className="services-grid">
          {sorted.map((service) => (
            <a
              key={service.title}
              href="#contact"
              className="service-card"
            >
              <div className="service-thumb">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : null}
              </div>
              <div className="service-info">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <span className="service-cta" aria-hidden>
                <FiChevronRight />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
