import type { ReactNode } from 'react';

interface DraftCardProps {
  children: ReactNode;
  status?: string;
  title?: string;
}

export function DraftCard({
  children,
  status = 'Being edited',
  title = 'Working draft',
}: DraftCardProps) {
  return (
    <aside className="draft-card" aria-label={`${title}: ${status}`}>
      <header className="draft-card__header">
        <div className="draft-card__heading">
          <span className="draft-card__signal" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <div>
            <span className="draft-card__eyebrow">WORKING_COPY</span>
            <strong>{title}</strong>
          </div>
        </div>
        <span className="draft-card__status">
          <span aria-hidden="true" />
          {status}
        </span>
      </header>

      <div className="draft-card__body">{children}</div>

      <footer className="draft-card__footer">
        <span aria-hidden="true">///</span>
        <span>This section may change before publication.</span>
      </footer>
    </aside>
  );
}
