/* oxlint-disable next/no-img-element -- Existing local brand artwork; Vinext image shim is not used. */
import { copy } from '@/content/site-content';
import { ActionLink } from '@/components/site/action-link';
import { SiteHeader } from '@/components/site/site-header';

export function HeroSection() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-noise" aria-hidden="true" />
      <SiteHeader />

      <div className="hero-layout">
        <div className="hero-copy">
          <p className="eyebrow" data-hero-line>
            {copy.hero.eyebrow}
          </p>
          <h1 id="hero-title">
            <span data-hero-line>{copy.hero.title[0]}</span>
            <em data-hero-line>{copy.hero.title[1]}</em>
          </h1>
          <p className="hero-description" data-hero-line>
            {copy.hero.description}
          </p>
          <div className="hero-actions" data-hero-line>
            <ActionLink href="#tonight" direction="down">
              {copy.hero.primaryAction}
            </ActionLink>
            <ActionLink href="#menu" variant="outline" direction="down">
              {copy.hero.menuAction}
            </ActionLink>
          </div>
        </div>

        <div className="hero-visual hero-brand-art" data-hero-visual>
          <img
            src="/overhead-mark.png"
            alt="Фирменный знак OVERHEAD — гриф гитары"
            width={1080}
            height={1080}
          />
        </div>
      </div>
    </section>
  );
}
