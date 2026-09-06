import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface ActionLinkProps {
  children: ReactNode;
  href: string;
  variant?: 'primary' | 'outline' | 'dark';
  external?: boolean;
  direction?: 'down' | 'up';
  ariaLabel?: string;
}

export function ActionLink({
  children,
  href,
  variant = 'primary',
  external = false,
  direction = 'up',
  ariaLabel,
}: ActionLinkProps) {
  const Icon = direction === 'down' ? ArrowDownRight : ArrowUpRight;

  return (
    <a
      className={`action-link action-link--${variant}`}
      href={href}
      aria-label={ariaLabel}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      <span>{children}</span>
      <Icon aria-hidden="true" size={18} strokeWidth={2.35} />
    </a>
  );
}
