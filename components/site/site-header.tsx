/* oxlint-disable next/no-img-element -- Vinext's Next Image shim currently fails at runtime; this small local mark has explicit CSS dimensions. */
import { Menu as MenuIcon } from 'lucide-react';
import { copy, links } from '@/content/site-content';

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="OVERHEAD — на главную">
        <img src="/overhead-mark.png" alt="" className="brand-mark" />
        <span>OVERHEAD</span>
      </a>

      <nav className="desktop-nav" aria-label="Основная навигация">
        <a href="#tonight">{copy.nav.tonight}</a>
        <a href="#events">{copy.nav.events}</a>
        <a href="#menu">{copy.nav.menu}</a>
        <a href="#visit">{copy.nav.visit}</a>
        <a
          className="nav-reserve"
          href={links.instagram}
          target="_blank"
          rel="noreferrer"
        >
          {copy.nav.reserve}
        </a>
      </nav>

      <a
        className="mobile-menu-link"
        href="#menu"
        aria-label="Открыть меню бара"
      >
        <MenuIcon aria-hidden="true" size={22} />
      </a>
    </header>
  );
}
