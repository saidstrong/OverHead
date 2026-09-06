/* oxlint-disable next/no-img-element -- Vinext's Next Image shim currently fails at runtime; this small local mark has explicit CSS dimensions. */
import { links } from '@/content/site-content';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="brand" href="#top" aria-label="Back to top">
        <img src="/overhead-mark.png" alt="" className="brand-mark" />
        <span>OVERHEAD</span>
      </a>
      <nav aria-label="Footer navigation">
        <a href="#tonight">Tonight</a>
        <a href="#events">Events</a>
        <a href="#menu">Menu</a>
        <a href="#visit">Visit</a>
      </nav>
      <a href={links.instagram} target="_blank" rel="noreferrer">
        @OVERHEAD.CLUB
      </a>
    </footer>
  );
}
