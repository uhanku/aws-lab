import type { ReactNode } from 'react';

export type CalloutType = 'info' | 'success' | 'warning' | 'danger';

interface CalloutProps {
  children: ReactNode;
  title?: string;
  type?: CalloutType;
}

function CalloutIcon({ type }: { type: CalloutType }) {
  if (type === 'success') {
    return <path d="m8.5 12 2.25 2.25L15.8 9.2" />;
  }

  if (type === 'warning') {
    return (
      <>
        <path d="M12 4.5 21 19H3L12 4.5Z" />
        <path d="M12 9v4.5M12 16.5h.01" />
      </>
    );
  }

  if (type === 'danger') {
    return (
      <>
        <path d="m8 3.5-4.5 4.5v8L8 20.5h8l4.5-4.5V8L16 3.5H8Z" />
        <path d="m9 9 6 6m0-6-6 6" />
      </>
    );
  }

  return (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 10.5v5M12 7.5h.01" />
    </>
  );
}

export function Callout({ children, title, type = 'info' }: CalloutProps) {
  return (
    <aside
      className={`callout callout--${type} blog-callout blog-callout--${type}`}
    >
      <span className="callout__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <CalloutIcon type={type} />
        </svg>
      </span>
      <div className="callout__content">
        {title ? <strong className="callout__title">{title}</strong> : null}
        <div>{children}</div>
      </div>
    </aside>
  );
}
