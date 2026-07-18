import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import { cn } from '@/lib/utils';
import './LandingPrimitives.css';

type BaseProps = { className?: string; children?: ReactNode };

type LandingButtonProps =
  | (BaseProps &
      (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; as?: 'a' }))
  | (ButtonHTMLAttributes<HTMLButtonElement> & { as: 'button' });

export function LandingButton({
  className,
  children,
  ...props
}: LandingButtonProps) {
  return props.as === 'button' ? (
    <button className={cn('landing-button', className)} {...props}>
      {children}
    </button>
  ) : (
    <a className={cn('landing-button', className)} {...props}>
      {children}
    </a>
  );
}

export function LandingBadge({ className, children }: BaseProps) {
  return <span className={cn('landing-badge', className)}>{children}</span>;
}

export function LandingCard({ className, children }: BaseProps) {
  return <div className={cn('landing-card', className)}>{children}</div>;
}

type LandingIconLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  label: string;
  handle?: string;
  icon?: ReactNode;
};

export function LandingIconLink({
  className,
  label,
  handle,
  icon,
  children,
  ...props
}: LandingIconLinkProps) {
  return (
    <a
      className={cn('landing-icon-link', className)}
      aria-label={handle ? `${label}: ${handle}` : label}
      {...props}
    >
      <span>
        <strong>{label}</strong>
        {handle && <small>{handle}</small>}
      </span>
      {icon ?? (
        <span aria-hidden="true" className="landing-icon-link__arrow">
          ↗
        </span>
      )}
      {children}
    </a>
  );
}

export function LandingStatusPill({ className, children }: BaseProps) {
  return (
    <span className={cn('landing-status-pill', className)}>
      <span className="green-dot" aria-hidden="true" />
      {children}
    </span>
  );
}

export function LandingSectionLabel({ className, children }: BaseProps) {
  return (
    <span className={cn('landing-section-label', className)}>{children}</span>
  );
}
