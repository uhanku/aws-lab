import type { ReactNode } from 'react';

export interface PipelineItem {
  label: string;
  title: string;
}

export function Pipeline({
  items,
  ariaLabel = 'Process pipeline',
}: {
  items: PipelineItem[];
  ariaLabel?: string;
}) {
  return (
    <div className="pipeline" aria-label={ariaLabel}>
      {items.map((item, index) => (
        <span className="pipeline-group" key={`${item.label}-${item.title}`}>
          <span className="pipeline-step">
            <span>{item.label}</span>
            <strong>{item.title}</strong>
          </span>
          {index < items.length - 1 ? (
            <span className="pipeline-arrow" aria-hidden="true">
              →
            </span>
          ) : null}
        </span>
      ))}
    </div>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <ol className="steps">{children}</ol>;
}

export function ArcadeDetails({
  summary,
  children,
  open = false,
}: {
  summary: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details className="arcade-details" open={open}>
      <summary>{summary}</summary>
      <div className="arcade-details__body">{children}</div>
    </details>
  );
}
