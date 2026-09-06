interface SectionHeadingProps {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  inverse?: boolean;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  inverse = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`section-heading ${inverse ? 'section-heading--inverse' : ''}`}
      data-reveal
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {intro ? <p className="section-intro">{intro}</p> : null}
    </div>
  );
}
