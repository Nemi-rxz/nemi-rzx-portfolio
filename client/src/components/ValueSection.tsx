import type { SiteContent } from "../types";

type Props = Pick<SiteContent, "valueHeadline" | "valueBody" | "clientLogos">;

export default function ValueSection({
  valueHeadline,
  valueBody,
  clientLogos,
}: Props) {
  const visibleLogos = clientLogos?.filter(Boolean) || [];

  return (
    <section className="value-section" id="about">
      <div className="section-container">
        <h2 className="value-headline">{valueHeadline}</h2>
        <p className="value-body">{valueBody}</p>
        {visibleLogos.length > 0 && (
          <div className="client-logos" aria-hidden={false}>
            {visibleLogos.map((logo, i) => (
              <img key={i} src={logo} alt="" width={80} height={28} loading="lazy" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
