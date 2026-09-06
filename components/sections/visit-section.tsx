import { AtSign, Clock3, MapPin, MessageCircle, Phone } from 'lucide-react';
import { copy, links, visit } from '@/content/site-content';
import { ActionLink } from '@/components/site/action-link';

export function VisitSection() {
  return (
    <section className="visit-section" id="visit" aria-labelledby="visit-title">
      <div className="visit-main" data-reveal>
        <p className="eyebrow">{copy.visit.eyebrow}</p>
        <h2 id="visit-title">{copy.visit.title}</h2>
        <p className="visit-address">
          <MapPin aria-hidden="true" size={20} strokeWidth={2.1} />
          <span>{visit.address}</span>
        </p>
        <div className="visit-actions">
          <ActionLink href={links.directions} external>
            Directions in 2GIS
          </ActionLink>
          <ActionLink
            href={visit.reservationUrl}
            external
            variant="outline"
            ariaLabel="Ask Overhead about reservations on Instagram"
          >
            Ask to reserve
          </ActionLink>
        </div>
      </div>

      <dl className="visit-details" data-reveal>
        <div>
          <dt>
            <Clock3 aria-hidden="true" size={17} /> Opening hours
          </dt>
          <dd>{visit.hours ?? 'Awaiting confirmation'}</dd>
        </div>
        <div>
          <dt>
            <Phone aria-hidden="true" size={17} /> Phone
          </dt>
          <dd>{visit.phone ?? 'Awaiting confirmation'}</dd>
        </div>
        <div>
          <dt>
            <MessageCircle aria-hidden="true" size={17} /> Reservations
          </dt>
          <dd>Ask the venue directly</dd>
        </div>
        <div>
          <dt>
            <AtSign aria-hidden="true" size={17} /> Instagram
          </dt>
          <dd>
            <a href={links.instagram} target="_blank" rel="noreferrer">
              @overhead.club
            </a>
          </dd>
        </div>
        <p>{visit.verificationNote}</p>
      </dl>
    </section>
  );
}
