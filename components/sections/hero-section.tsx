/* oxlint-disable next/no-img-element -- Vinext's Next Image shim currently fails at runtime; this small local mark has explicit CSS dimensions. */
import { Headphones, Music2 } from 'lucide-react';
import { copy } from '@/content/site-content';
import { ActionLink } from '@/components/site/action-link';
import { QuickActions } from '@/components/site/quick-actions';
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

        <div
          className="hero-visual"
          aria-label="Overhead live music and bar identity"
          data-hero-visual
        >
          <div className="hero-visual__orbit" aria-hidden="true" />
          <img src="/overhead-mark.png" alt="Overhead guitar-head logo" />
          <div className="hero-visual__label hero-visual__label--music">
            <Music2 aria-hidden="true" size={15} /> LIVE
          </div>
          <div className="hero-visual__label hero-visual__label--bar">
            <Headphones aria-hidden="true" size={15} /> LOUD
          </div>
        </div>
      </div>

      <QuickActions />
    </section>
  );
}
