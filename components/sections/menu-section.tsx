import { copy } from '@/content/site-content';
import { MenuExplorer } from '@/components/sections/menu-explorer';
import { SectionHeading } from '@/components/site/section-heading';

export function MenuSection() {
  return (
    <section className="menu-section" id="menu" aria-labelledby="menu-title">
      <SectionHeading
        id="menu-title"
        eyebrow={copy.menu.eyebrow}
        title={copy.menu.title}
        intro={copy.menu.intro}
      />
      <MenuExplorer />
    </section>
  );
}
