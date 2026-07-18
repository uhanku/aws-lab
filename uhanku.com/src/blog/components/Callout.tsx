import type { ReactNode } from 'react';

interface CalloutProps {
  children: ReactNode;
  title?: string;
  type?: 'info' | 'success' | 'warning';
}

export function Callout({ children, title, type = 'info' }: CalloutProps) {
  return (
    <aside className={`blog-callout blog-callout--${type}`}>
      {title ? <strong>{title}</strong> : null}
      <div>{children}</div>
    </aside>
  );
}
