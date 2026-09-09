import { CalendarDays, Martini, MessageCircle } from 'lucide-react';
import { copy, links } from '@/content/site-content';

const actions = [
  { label: copy.nav.tonight, href: '#tonight', Icon: CalendarDays },
  { label: copy.nav.menu, href: '#menu', Icon: Martini },
  {
    label: copy.nav.reserve,
    href: links.instagram,
    Icon: MessageCircle,
    external: true,
  },
];

export function QuickActions() {
  return (
    <nav
      className="quick-actions"
      id="quick-actions"
      aria-label="Быстрая навигация"
    >
      {actions.map(({ label, href, Icon, external }) => (
        <a
          href={href}
          key={label}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
        >
          <Icon aria-hidden="true" size={17} strokeWidth={2} />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}
