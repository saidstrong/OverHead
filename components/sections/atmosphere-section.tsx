import { Camera } from 'lucide-react';
import { copy } from '@/content/site-content';

const frames = [
  {
    label: 'Live floor',
    detail: 'Performances / audience',
    className: 'atmosphere-frame--live',
  },
  {
    label: 'At the bar',
    detail: 'Bartenders / cocktails',
    className: 'atmosphere-frame--bar',
  },
  {
    label: 'Terrace',
    detail: 'Open-air nights',
    className: 'atmosphere-frame--terrace',
  },
];

export function AtmosphereSection() {
  return (
    <section
      className="atmosphere-section"
      id="atmosphere"
      aria-labelledby="atmosphere-title"
    >
      <div className="atmosphere-heading" data-reveal>
        <p className="eyebrow">{copy.atmosphere.eyebrow}</p>
        <h2 id="atmosphere-title">{copy.atmosphere.title}</h2>
        <p>
          The final gallery is designed around real Overhead photography. These
          frames reserve the composition without presenting invented venue
          imagery.
        </p>
      </div>

      <div className="atmosphere-composition">
        {frames.map((frame, index) => (
          <div
            className={`atmosphere-frame ${frame.className}`}
            key={frame.label}
            data-reveal
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <Camera aria-hidden="true" size={18} />
              <strong>{frame.label}</strong>
              <small>{frame.detail}</small>
            </div>
            <em>PHOTOGRAPHY PENDING PERMISSION</em>
          </div>
        ))}
      </div>
    </section>
  );
}
