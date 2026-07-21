import type { ReactNode } from 'react';

interface MediaFigureProps {
  src: string;
  alt: string;
  caption?: ReactNode;
}

export function MediaFigure({ src, alt, caption }: MediaFigureProps) {
  return (
    <figure className="media-frame">
      <img src={src} alt={alt} loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
