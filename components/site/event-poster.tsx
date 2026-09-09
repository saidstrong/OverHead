/* oxlint-disable jsx-a11y/prefer-tag-over-role -- The poster is CSS-authored artwork, not a raster image; the image role gives the composition one useful accessible name. */
import type { VenueEvent } from '@/content/site-content';

export function EventPoster({
  event,
  compact = false,
}: {
  event: VenueEvent;
  compact?: boolean;
}) {
  return (
    <div
      className={`event-poster event-poster--${event.artworkTone} ${compact ? 'event-poster--compact' : ''}`}
      role="img"
      aria-label={`Афиша: ${event.title}`}
    >
      <span className="event-poster__venue">OVERHEAD / АСТАНА</span>
      <strong>{event.title}</strong>
      <span className="event-poster__date">
        {event.date} · {event.time}
      </span>
      <span className="event-poster__line" aria-hidden="true" />
    </div>
  );
}
