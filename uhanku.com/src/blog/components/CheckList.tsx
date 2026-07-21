import type { ReactNode } from 'react';

interface CheckListProps {
  items: ReactNode[];
  className?: string;
}

export function CheckList({ items, className = '' }: CheckListProps) {
  return (
    <ul className={`check-list${className ? ` ${className}` : ''}`}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
