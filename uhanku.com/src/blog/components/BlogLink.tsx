import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';

import type { Navigate } from '../types';

interface BlogLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  onNavigate: Navigate;
  to: string;
}

export function BlogLink({
  children,
  onClick,
  onNavigate,
  to,
  ...props
}: BlogLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    onNavigate(to);
  };

  return (
    <a {...props} href={to} onClick={handleClick}>
      {children}
    </a>
  );
}
