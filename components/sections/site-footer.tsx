/* oxlint-disable next/no-img-element -- Vinext's Next Image shim currently fails at runtime; this small local mark has explicit CSS dimensions. */
import { copy, links } from '@/content/site-content';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="brand" href="#top" aria-label="Наверх">
        <img src="/overhead-mark.png" alt="" className="brand-mark" />
        <span>OVERHEAD</span>
      </a>
      <nav aria-label="Навигация внизу страницы">
        <a href="#tonight">{copy.nav.tonight}</a>
        <a href="#events">{copy.nav.events}</a>
        <a href="#menu">{copy.nav.menu}</a>
        <a href="#visit">{copy.nav.visit}</a>
      </nav>
      <a href={links.instagram} target="_blank" rel="noreferrer">
        @OVERHEAD.CLUB
      </a>
    </footer>
  );
}
