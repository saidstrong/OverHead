import { AtSign, Clock3, MapPin, MessageCircle } from 'lucide-react';
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
          <span>
            {visit.address.map((line) => (
              <span className="address-line" key={line}>
                {line}
              </span>
            ))}
          </span>
        </p>
        <div className="visit-actions">
          <ActionLink href={links.directions} external>
            Маршрут в 2ГИС
          </ActionLink>
          <ActionLink
            href={visit.reservationUrl}
            external
            variant="outline"
            ariaLabel="Забронировать стол в OVERHEAD через Instagram"
          >
            Забронировать
          </ActionLink>
        </div>
      </div>
      <dl className="visit-details" data-reveal>
        <div>
          <dt>
            <Clock3 aria-hidden="true" size={17} /> Часы работы
          </dt>
          <dd>
            <dl className="opening-hours">
              {visit.hours.map(({ day, opens, closes }) => (
                <div key={day}>
                  <dt>{day}</dt>
                  <dd>
                    {opens}–{closes}
                  </dd>
                </div>
              ))}
            </dl>
          </dd>
        </div>
        <div>
          <dt>
            <MessageCircle aria-hidden="true" size={17} /> Бронь
          </dt>
          <dd>
            <a href={visit.reservationUrl} target="_blank" rel="noreferrer">
              Напишите нам в Instagram
            </a>
          </dd>
        </div>
        <div>
          <dt>
            <AtSign aria-hidden="true" size={17} /> Мы на связи
          </dt>
          <dd>
            <a href={links.instagram} target="_blank" rel="noreferrer">
              @overhead.club
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
