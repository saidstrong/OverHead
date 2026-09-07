import { ArrowUpRight, Clock3, Ticket } from 'lucide-react';
import { copy, events } from '@/content/site-content';
import { EventPoster } from '@/components/site/event-poster';
import { SectionHeading } from '@/components/site/section-heading';

export function EventsSection() {
  return (
    <section
      className="events-section"
      id="events"
      aria-labelledby="events-title"
    >
      <SectionHeading
        id="events-title"
        eyebrow={copy.events.eyebrow}
        title={copy.events.title}
        intro={copy.events.intro}
        inverse
      />

      <div className="events-grid">
        {events.map((event, index) => (
          <article
            className="event-card"
            key={event.id}
            data-event-card
            data-reveal
          >
            <EventPoster event={event} compact />
            <div className="event-card__content">
              <span className="event-card__index" aria-hidden="true">
                0{index + 1}
              </span>
              <div className="event-card__topline">
                <span>{event.status}</span>
                <time dateTime={event.isoDate}>{event.date}</time>
              </div>
              <h3>{event.title}</h3>
              <p>{event.subtitle}</p>
              <dl>
                <div>
                  <dt>
                    <Clock3 aria-hidden="true" size={14} /> Start
                  </dt>
                  <dd>{event.time}</dd>
                </div>
                <div>
                  <dt>
                    <Ticket aria-hidden="true" size={14} /> Tickets
                  </dt>
                  <dd>{event.price}</dd>
                </div>
              </dl>
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Buy tickets for ${event.title}`}
              >
                GET TICKETS <ArrowUpRight aria-hidden="true" size={18} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
