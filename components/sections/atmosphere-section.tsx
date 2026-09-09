/* oxlint-disable next/no-img-element -- Approved pre-optimized local artwork uses responsive picture sources in Vinext. */
import { copy, links } from '@/content/site-content';
import { ActionLink } from '@/components/site/action-link';
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
          Музыка, ради которой выходят из дома. Вечера, которые не хочется
          заканчивать.
        </p>
        <ActionLink href={links.instagram} external variant="dark">
          Жизнь OVERHEAD
        </ActionLink>
      </div>
      <figure className="room-artwork" data-reveal>
        <picture>
          <source
            media="(max-width: 600px)"
            srcSet="/media/overhead/overhead-stage-mobile.webp"
          />
          <img
            src="/media/overhead/overhead-stage-desktop.webp"
            alt="Атмосферическая иллюстрация: музыканты в тёплом сценическом свете"
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
          />
        </picture>
        <figcaption>
          Визуальный образ вечера · атмосферическая иллюстрация
        </figcaption>
      </figure>
    </section>
  );
}
