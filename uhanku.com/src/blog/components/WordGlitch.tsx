export type WordGlitchType =
  'default' | 'subtle' | 'hard-cut' | 'scanline' | 'ghost' | 'hover';

interface WordGlitchProps {
  children: string;
  type?: WordGlitchType;
  tabIndex?: number;
}

export function WordGlitch({
  children,
  type = 'default',
  tabIndex,
}: WordGlitchProps) {
  const modifier = type === 'default' ? '' : ` word-glitch--${type}`;
  return (
    <span
      className={`word-glitch${modifier}`}
      data-text={children}
      tabIndex={tabIndex ?? (type === 'hover' ? 0 : undefined)}
    >
      {children}
    </span>
  );
}
