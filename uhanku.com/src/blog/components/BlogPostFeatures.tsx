import { Check, Copy } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TldrPanelProps {
  children: ReactNode;
  readTime?: string;
  points?: string[];
  title?: string;
}

export function TldrPanel({
  children,
  points = [],
  readTime = '45-second summary',
  title = 'TL;DR',
}: TldrPanelProps) {
  return (
    <aside className="tldr-panel">
      <div className="tldr-panel__header">
        <span>{title}</span>
        <small>{readTime}</small>
      </div>
      <div className="tldr-panel__copy">{children}</div>
      {points.length > 0 ? (
        <ul className="key-points">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}

export interface ProsConsProps {
  cons: string[];
  consLabel?: string;
  consTitle?: string;
  pros: string[];
  prosLabel?: string;
  prosTitle?: string;
}

export function ProsCons({
  cons,
  consLabel = 'TRADE-OFFS',
  consTitle = 'Costs',
  pros,
  prosLabel = 'WHY IT WORKS',
  prosTitle = 'Benefits',
}: ProsConsProps) {
  return (
    <div className="pros-cons">
      <section className="decision-column decision-column--positive">
        <span className="decision-column__label">{prosLabel}</span>
        <h3>{prosTitle}</h3>
        <ul>
          {pros.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="decision-column decision-column--negative">
        <span className="decision-column__label">{consLabel}</span>
        <h3>{consTitle}</h3>
        <ul>
          {cons.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function DefinitionCard({
  children,
  label = 'TERM',
  term,
}: {
  children: ReactNode;
  label?: string;
  term: string;
}) {
  return (
    <aside className="definition-card">
      <span className="definition-card__eyebrow">{label}</span>
      <dfn className="definition-card__term">{term}</dfn>
      <div>{children}</div>
    </aside>
  );
}

export interface ResourceCardProps {
  cta?: string;
  description: ReactNode;
  href: string;
  title: string;
  type?: string;
}

export function ResourceCard({
  cta = 'OPEN RESOURCE →',
  description,
  href,
  title,
  type = 'RELATED RESOURCE',
}: ResourceCardProps) {
  const external = /^https?:\/\//.test(href);

  return (
    <a
      className="resource-card"
      href={href}
      rel={external ? 'noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      <span className="resource-card__type">{type}</span>
      <h3>{title}</h3>
      <div className="resource-card__description">{description}</div>
      <strong>{cta}</strong>
    </a>
  );
}

export interface CodeTab {
  code: string;
  id: string;
  label: string;
  language?: string;
}

export function CodeTabs({
  ariaLabel = 'Code examples',
  tabs,
}: {
  ariaLabel?: string;
  tabs: CodeTab[];
}) {
  const groupId = useId();
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeId),
  );

  function selectByIndex(index: number) {
    const normalizedIndex = (index + tabs.length) % tabs.length;
    setActiveId(tabs[normalizedIndex]?.id ?? '');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectByIndex(activeIndex + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectByIndex(activeIndex - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      selectByIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      selectByIndex(tabs.length - 1);
    }
  }

  async function copyCode(tab: CodeTab) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(tab.code);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = tab.code;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }

    setCopiedId(tab.id);
    window.setTimeout(() => setCopiedId(null), 1200);
  }

  if (tabs.length === 0) return null;

  return (
    <div className="code-tabs">
      <div className="code-tabs__list" role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab) => {
          const selected = tab.id === activeId;
          return (
            <button
              aria-controls={`${groupId}-${tab.id}-panel`}
              aria-selected={selected}
              className={selected ? 'is-active' : undefined}
              id={`${groupId}-${tab.id}-tab`}
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={handleKeyDown}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => {
        const selected = tab.id === activeId;
        return (
          <div
            aria-labelledby={`${groupId}-${tab.id}-tab`}
            className={`code-tabs__panel${selected ? ' is-active' : ''}`}
            hidden={!selected}
            id={`${groupId}-${tab.id}-panel`}
            key={tab.id}
            role="tabpanel"
          >
            <button
              aria-label={copiedId === tab.id ? 'Code copied' : 'Copy code'}
              className={`code-tabs__copy${
                copiedId === tab.id ? ' is-copied' : ''
              }`}
              onClick={() => void copyCode(tab)}
              title={copiedId === tab.id ? 'Copied' : 'Copy code'}
              type="button"
            >
              {copiedId === tab.id ? (
                <Check aria-hidden="true" size={15} strokeWidth={1.9} />
              ) : (
                <Copy aria-hidden="true" size={15} strokeWidth={1.9} />
              )}
            </button>
            <pre>
              <code data-language={tab.language}>{tab.code}</code>
            </pre>
          </div>
        );
      })}
    </div>
  );
}

export type DiffLineType = 'added' | 'context' | 'removed';

export interface DiffLine {
  content: string;
  type?: DiffLineType;
}

export function DiffBlock({
  file,
  label = 'CHANGESET',
  lines,
}: {
  file?: string;
  label?: string;
  lines: DiffLine[];
}) {
  return (
    <div className="diff-block">
      <div className="diff-block__header">
        <span>{label}</span>
        {file ? <small>{file}</small> : null}
      </div>
      <pre>
        <code>
          {lines.map((line, index) => {
            const type = line.type ?? 'context';
            const prefix =
              type === 'added' ? '+' : type === 'removed' ? '−' : ' ';
            return (
              <span
                className={`diff-line diff-line--${type}`}
                key={`${index}-${line.content}`}
              >
                {prefix} {line.content}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

export interface FileTreeItem {
  children?: FileTreeItem[];
  name: string;
  type?: 'file' | 'folder';
}

function FileTreeItems({ items }: { items: FileTreeItem[] }) {
  return (
    <ul>
      {items.map((item) => {
        const folder = item.type === 'folder' || Boolean(item.children?.length);
        return (
          <li
            className={folder ? 'file-tree__folder' : undefined}
            key={item.name}
          >
            <span>{item.name}</span>
            {item.children ? <FileTreeItems items={item.children} /> : null}
          </li>
        );
      })}
    </ul>
  );
}

export function FileTree({
  countLabel,
  items,
  label = 'PROJECT_TREE',
}: {
  countLabel?: string;
  items: FileTreeItem[];
  label?: string;
}) {
  return (
    <article className="file-tree">
      <div className="file-tree__header">
        <span>{label}</span>
        {countLabel ? <small>{countLabel}</small> : null}
      </div>
      <FileTreeItems items={items} />
    </article>
  );
}

export type TestStatus = 'fail' | 'pass' | 'warn';

export interface TestReportItem {
  label: string;
  result: string;
  status?: TestStatus;
}

export function TestReport({
  duration,
  items,
  label = 'VALIDATION_RUN',
  summary,
}: {
  duration?: string;
  items: TestReportItem[];
  label?: string;
  summary: string;
}) {
  return (
    <article className="test-report">
      <div className="test-report__header">
        <span>{label}</span>
        <strong>{summary}</strong>
      </div>
      {items.map((item) => (
        <div className="test-report__row" key={item.label}>
          <span
            className={`test-signal test-signal--${item.status ?? 'pass'}`}
            aria-hidden="true"
          />
          <span>{item.label}</span>
          <strong>{item.result}</strong>
        </div>
      ))}
      {duration ? (
        <div className="test-report__footer">
          <span>Duration</span>
          <strong>{duration}</strong>
        </div>
      ) : null}
    </article>
  );
}

export function ReadingUtilities() {
  const [progress, setProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const scrollable = Math.max(1, root.scrollHeight - root.clientHeight);
      const nextProgress = Math.min(
        100,
        Math.max(0, (window.scrollY / scrollable) * 100),
      );
      setProgress(nextProgress);
      setShowBackToTop(window.scrollY > 700);
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      {/* <div
        aria-label="Reading progress"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(progress)}
        className="reading-progress"
        role="progressbar"
      >
        <span
          className="reading-progress__bar"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div> */}
      <button
        aria-label="Back to top"
        className={`back-to-top${showBackToTop ? ' is-visible' : ''}`}
        onClick={() => window.scrollTo({ behavior: 'smooth', top: 0 })}
        type="button"
      >
        ↑ TOP
      </button>
    </>
  );
}

export interface TimelineItem {
  date: string;
  description?: ReactNode;
  title: string;
}

export function ArticleTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="article-timeline">
      {items.map((item) => (
        <li key={`${item.date}-${item.title}`}>
          <time>{item.date}</time>
          <div>
            <strong>{item.title}</strong>
            {item.description ? <div>{item.description}</div> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export interface ReferenceItem {
  description?: ReactNode;
  href: string;
  id?: string;
  label: string;
  returnHref?: string;
}

export function ReferenceList({ items }: { items: ReferenceItem[] }) {
  return (
    <ol className="reference-list">
      {items.map((item, index) => (
        <li id={item.id} key={`${item.href}-${item.label}`}>
          <span>[{String(index + 1).padStart(2, '0')}]</span>
          <div>
            <a href={item.href}>{item.label}</a>
            {item.description ? <div>{item.description}</div> : null}
          </div>
          {item.returnHref ? (
            <a
              aria-label="Return to reference mention"
              className="reference-list__return"
              href={item.returnHref}
            >
              ↩
            </a>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export interface SeriesLink {
  href: string;
  meta?: string;
  title: string;
}

export function SeriesNav({
  current,
  next,
  previous,
  total,
}: {
  current: number;
  next?: SeriesLink;
  previous?: SeriesLink;
  total: number;
}) {
  return (
    <nav className="series-nav" aria-label="Article series navigation">
      {previous ? (
        <a
          className="series-nav__item series-nav__item--previous"
          href={previous.href}
        >
          <span>← PREVIOUS</span>
          <strong>{previous.title}</strong>
          {previous.meta ? <small>{previous.meta}</small> : null}
        </a>
      ) : (
        <span className="series-nav__item series-nav__item--empty" />
      )}
      <div className="series-nav__status">
        <span>SERIES</span>
        <strong>
          {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </strong>
      </div>
      {next ? (
        <a className="series-nav__item series-nav__item--next" href={next.href}>
          <span>NEXT →</span>
          <strong>{next.title}</strong>
          {next.meta ? <small>{next.meta}</small> : null}
        </a>
      ) : (
        <span className="series-nav__item series-nav__item--empty" />
      )}
    </nav>
  );
}
