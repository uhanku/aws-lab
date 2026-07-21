import type { ComponentProps, ElementType, MouseEvent } from 'react';

import type { Navigate } from '../types';
import { Callout } from './Callout';
import { CounterDemo } from './CounterDemo';
import { Gallery } from './Gallery';
import { ArcadeDetails, Pipeline, Steps } from './ProcessStructure';
import { ArcadeDivider } from './ArcadeEffects';
import { ArcadeProgress, DataTable, MetricCard } from './DataDisplay';
import { CheckList } from './CheckList';
import { ComponentCard } from './ComponentCard';
import { MediaFigure } from './MediaFigure';
import { PostStatus } from './PostStatus';
import { TerminalBlock } from './TerminalBlock';
import { WordGlitch } from './WordGlitch';

export function createMdxComponents(onNavigate: Navigate) {
  const MdxAnchor = ({ href = '', ...props }: ComponentProps<'a'>) => {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      if (
        !href.startsWith('/') ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      onNavigate(href);
    };

    const externalProps = href.startsWith('http')
      ? { rel: 'noreferrer', target: '_blank' }
      : {};

    return (
      <a {...props} {...externalProps} href={href} onClick={handleClick} />
    );
  };

  return {
    a: MdxAnchor,
    Callout,
    CounterDemo,
    Gallery,
    ArcadeDetails,
    ArcadeDivider,
    ArcadeProgress,
    CheckList,
    ComponentCard,
    DataTable,
    MediaFigure,
    MetricCard,
    Pipeline,
    PostStatus,
    Steps,
    TerminalBlock,
    WordGlitch,
  } satisfies Record<string, ElementType>;
}
