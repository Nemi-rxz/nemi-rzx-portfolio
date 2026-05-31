import type { SiteContent } from "../types";

type Props = Pick<SiteContent, "valueHeadline" | "valueBody" | "clientLogos">;

export default function ValueSection({
  valueHeadline,
  valueBody,
  clientLogos,
}: Props) {
  return (
    <section className="value-section" id="about">
      <div className="section-container">
        <h2 className="value-headline">{valueHeadline}</h2>
        <p className="value-body">{valueBody}</p>
        <div className="client-logos" aria-hidden={!clientLogos?.length}>
          {(clientLogos?.length ? clientLogos : Array(8).fill("")).map(
            (logo, i) =>
              logo ? (
                <img key={i} src={logo} alt="" width={80} height={28} loading="lazy" />
              ) : (
                <div key={i} className="client-logo-placeholder" />
              )
          )}
        </div>
      </div>
    </section>
  );
}
