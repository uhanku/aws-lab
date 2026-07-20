import type { CSSProperties } from 'react';

import './BlogTags.css';

export type BlogTagsColor = NonNullable<CSSProperties['color']>;

interface BlogTagsProps {
  tags: string[];
  ariaLabel: string;
  color?: BlogTagsColor;
}

function resolveColor(color: BlogTagsColor) {
  return color.startsWith('--') ? `var(${color})` : color;
}

export function BlogTags({ tags, ariaLabel, color }: BlogTagsProps) {
  const style = color
    ? ({ '--post-color': resolveColor(color) } as CSSProperties)
    : undefined;

  return (
    <ul className="blog-tags" aria-label={ariaLabel} style={style}>
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}
