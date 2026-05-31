import type { SiteContent } from "../types";

type Props = { site: SiteContent };

export default function Hero({ site }: Props) {
  const parts = site.heroNameDisplay.split(" ");
  const firstName = parts.slice(0, -1).join(" ") || site.heroTitle;
  const lastName = parts[parts.length - 1] || "NEMI";

  return (
    <section className="hero-section" id="home">
      <div className="hero-grid">
        <div>
          <p className="hero-role">{site.heroRole}</p>
        </div>
        <div className="hero-visual">
          <div className="hero-avatar">
            {site.heroAvatarUrl ? (
              <img
                src={site.heroAvatarUrl}
                alt="Avatar"
                className="hero-avatar-image"
              />
            ) : (
              <span className="hero-avatar-placeholder" aria-hidden>
                NR
              </span>
            )}
          </div>
          <div className="hero-name-overlay">
            <div className="hero-name-small">{firstName.split(" ")[0] || "NEMI"}</div>
            <div className="hero-name-large">{lastName}</div>
          </div>
        </div>
        <div>
          <p className="hero-bio">{site.heroBio}</p>
        </div>
      </div>
    </section>
  );
}
