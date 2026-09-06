import { Clock3, Ticket } from 'lucide-react';
import { copy, events } from '@/content/site-content';
import { ActionLink } from '@/components/site/action-link';
import { EventPoster } from '@/components/site/event-poster';

export function TonightSection() {
  const featured = events[0];
  const isTonight = featured.status === 'tonight';

  return (
    <section
      className="tonight-section"
      id="tonight"
      aria-labelledby="tonight-title"
    >
      <div className="tonight-heading" data-reveal>
        <p className="eyebrow">{copy.tonight.eyebrow}</p>
        <h2 id="tonight-title">{copy.tonight.title}</h2>
        <span className="status-chip">
          <span aria-hidden="true" />{' '}
          {isTonight ? 'Tonight' : 'Upcoming · not tonight'}
        </span>
      </div>

      <div className="featured-event" data-reveal>
        <EventPoster event={featured} />
        <div className="featured-event__details">
          <p className="featured-event__date">
            {featured.date} / {featured.age}
          </p>
          <h3>{featured.title}</h3>
          <p>{featured.subtitle}</p>
          <dl>
            <div>
              <dt>
                <Clock3 aria-hidden="true" size={15} /> Start
              </dt>
              <dd>{featured.time}</dd>
            </div>
            <div>
              <dt>
                <Ticket aria-hidden="true" size={15} /> Entry
              </dt>
              <dd>{featured.price}</dd>
            </div>
          </dl>
          <div className="featured-event__actions">
            <ActionLink href={featured.ticketUrl} external>
              Buy tickets
            </ActionLink>
            <ActionLink href="#events" variant="outline" direction="down">
              All events
            </ActionLink>
          </div>
          <p className="source-note">
            Published event details · Ticketon link opens in a new tab
          </p>
        </div>
      </div>
    </section>
  );
}
