type Props = { icons: string[] };

export default function TechStrip({ icons }: Props) {
  if (!icons?.length) return null;
  return (
    <div className="tech-strip" aria-label="Technologies">
      {icons.map((icon) => (
        <span key={icon} className="tech-badge">
          {icon}
        </span>
      ))}
    </div>
  );
}
