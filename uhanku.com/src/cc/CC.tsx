import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowRight, ExternalLink, Search, Trash2, X, Zap } from 'lucide-react';

import architectureDiagram from '../blog/posts/mdx-blog-system/architecture.svg';
import {
  ArcadeDetails,
  Pipeline,
  Steps,
} from '../blog/components/ProcessStructure';
import { ArcadeDivider } from '../blog/components/ArcadeEffects';
import {
  ArcadeProgress,
  DataTable,
  MetricCard,
} from '../blog/components/DataDisplay';
import { Callout } from '../blog/components/Callout';
import { BlogTags } from '../blog/components/BlogTags';
import { CheckList } from '../blog/components/CheckList';
import { ComponentCard } from '../blog/components/ComponentCard';
import { MediaFigure } from '../blog/components/MediaFigure';
import { PostStatus } from '../blog/components/PostStatus';
import { TerminalBlock } from '../blog/components/TerminalBlock';
import { WordGlitch } from '../blog/components/WordGlitch';
import { useDocumentMetadata } from '../blog/useDocumentMetadata';
import {
  ArticleTimeline,
  CodeTabs,
  DefinitionCard,
  DiffBlock,
  FileTree,
  ProsCons,
  ReadingUtilities,
  ReferenceList,
  ResourceCard,
  SeriesNav,
  TestReport,
  TldrPanel,
} from '../blog/components/BlogPostFeatures';
import '../blog/components/ArcadeComponents.css';
import './CC.css';

const tokens = [
  ['--arcade-bg', 'Arcade canvas'],
  ['--arcade-acid', 'Arcade acid'],
  ['--arcade-hot', 'Arcade hot'],
  ['--arcade-cyan', 'Arcade cyan'],
  ['--arcade-purple', 'Arcade purple'],
  ['--arcade-orange', 'Arcade orange'],
  ['--arcade-blue', 'Arcade blue'],
  ['--arcade-red', 'Arcade red'],
  ['--arcade-panel-solid', 'Arcade panel'],
  ['--arcade-ink', 'Arcade ink'],
  ['--arcade-muted', 'Arcade muted'],
  ['--arcade-dim', 'Arcade dim'],
  ['--arcade-line', 'Arcade line'],
] as const;

const additionalTokens = [
  ['--text', 'Light-surface body text'],
  ['--text-h', 'Light-surface heading text'],
  ['--bg', 'Light canvas'],
  ['--border', 'Translucent border'],
  ['--code-bg', 'Code surface'],
  ['--accent', 'Accent purple'],
  ['--accent-bg', 'Accent wash'],
  ['--accent-border', 'Accent border'],
  ['--social-bg', 'Social surface'],
  ['--background', 'Application canvas'],
  ['--foreground', 'Application foreground'],
  ['--card', 'Card surface'],
  ['--card-foreground', 'Card foreground'],
  ['--popover', 'Popover surface'],
  ['--popover-foreground', 'Popover foreground'],
  ['--primary', 'Primary action'],
  ['--primary-foreground', 'Primary contrast'],
  ['--secondary', 'Secondary action'],
  ['--secondary-foreground', 'Secondary contrast'],
  ['--muted', 'Muted surface'],
  ['--muted-foreground', 'Muted foreground'],
  ['--accent-foreground', 'Accent contrast'],
  ['--input', 'Input boundary'],
  ['--ring', 'Focus ring'],
  ['--chart-1', 'Chart blue'],
  ['--chart-2', 'Chart green'],
  ['--chart-3', 'Chart orange'],
  ['--chart-4', 'Chart lavender'],
  ['--chart-5', 'Chart purple'],
  ['--radius', 'Base radius'],
  ['--sidebar', 'Sidebar surface'],
  ['--sidebar-foreground', 'Sidebar foreground'],
  ['--sidebar-primary', 'Sidebar primary'],
  ['--sidebar-primary-foreground', 'Sidebar primary contrast'],
  ['--sidebar-accent', 'Sidebar accent'],
  ['--sidebar-accent-foreground', 'Sidebar accent foreground'],
  ['--sidebar-border', 'Sidebar border'],
  ['--sidebar-ring', 'Sidebar focus ring'],
] as const;

const sections = [
  ['colors', 'Colors'],
  ['article-copy', 'Article copy'],
  ['code', 'Code'],
  ['callouts', 'Callouts'],
  ['buttons-tags', 'Buttons & tags'],
  ['statuses', 'Statuses'],
  ['data', 'Data display'],
  ['structure', 'Structure'],
  ['media', 'Media'],
  ['editorial-blocks', 'Editorial blocks'],
  ['technical-evidence', 'Technical evidence'],
  ['reading-references', 'Reading & references'],
  ['word-glitches', 'Word glitches'],
  ['effects', 'Effects'],
  ['class-reference', 'Class reference'],
] as const;

const sectionGroups = [
  {
    label: 'FOUNDATIONS',
    ids: ['colors', 'article-copy'],
  },
  {
    label: 'COMPONENTS',
    ids: [
      'code',
      'callouts',
      'buttons-tags',
      'statuses',
      'data',
      'structure',
      'media',
      'editorial-blocks',
    ],
  },
  {
    label: 'EVIDENCE',
    ids: ['technical-evidence', 'reading-references'],
  },
  {
    label: 'IDENTITY',
    ids: ['word-glitches', 'effects'],
  },
  {
    label: 'REFERENCE',
    ids: ['class-reference'],
  },
] as const;

const catalogueStats = [
  {
    value: String(tokens.length + additionalTokens.length),
    label: 'documented tokens',
    accent: 'acid',
  },
  { value: '7', label: 'post statuses', accent: 'hot' },
  { value: '30+', label: 'post patterns', accent: 'cyan' },
  { value: 'MDX', label: 'ready components', accent: 'purple' },
] as const;

const tableColumns = [
  { key: 'strategy', label: 'Strategy' },
  { key: 'latency', label: 'Latency' },
  { key: 'recall', label: 'Recall' },
  { key: 'decision', label: 'Decision' },
];

const tableRows = [
  {
    strategy: 'Vector only',
    latency: '61 ms',
    recall: '0.83',
    decision: 'Baseline',
  },
  {
    strategy: 'Hybrid search',
    latency: '84 ms',
    recall: '0.94',
    decision: 'Selected',
  },
  {
    strategy: 'Reranked',
    latency: '138 ms',
    recall: '0.96',
    decision: 'Optional',
  },
];

async function writeClipboard(value: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('Clipboard access is unavailable.');
}

function TokenGrid({
  items = tokens,
}: {
  items?: readonly (readonly [string, string])[];
}) {
  const values = useMemo(() => {
    const styles = getComputedStyle(document.documentElement);
    return items.map(([name, label]) => ({
      name,
      label,
      value: styles.getPropertyValue(name).trim(),
    }));
  }, [items]);

  return (
    <div className="cc-token-grid">
      {values.map((token) => (
        <article className="cc-token-card" key={token.name}>
          <div
            className={`cc-token-card__swatch${CSS.supports('color', token.value) ? '' : ' cc-token-card__swatch--non-color'}`}
            style={
              CSS.supports('color', token.value)
                ? { background: token.value }
                : undefined
            }
          />
          <code>{token.name}</code>
          <span>{token.value}</span>
          <small>{token.label}</small>
          <CopyButton
            value={`${token.name}: ${token.value};`}
            label="Copy token"
          />
        </article>
      ))}
    </div>
  );
}

function CopyButton({
  value,
  label = 'Copy',
  className = '',
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await writeClipboard(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      aria-label={copied ? `${label} copied` : label}
      className={`cc-copy${className ? ` ${className}` : ''}`}
      type="button"
      onClick={copy}
    >
      <span aria-live="polite">{copied ? 'Copied' : label}</span>
    </button>
  );
}

function Section({
  id,
  index,
  title,
  description,
  className,
  children,
}: {
  id: string;
  index: string;
  title: string;
  description: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <section
      className="cc-section"
      id={id}
      data-search={`${title} ${description} ${className}`}
    >
      <header className="cc-section__header">
        <div>
          <span className="cc-section__index">{index}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="cc-section__actions">
          <code>{className}</code>
          <a aria-label={`Copy link to ${title}`} href={`#${id}`}>
            #
          </a>
        </div>
      </header>
      {children}
    </section>
  );
}

function CodePreview({ children }: { children: ReactNode }) {
  return <div className="cc-preview">{children}</div>;
}

export default function CC() {
  const [query, setQuery] = useState('');
  const [motionPaused, setMotionPaused] = useState(false);
  const [activeSection, setActiveSection] = useState('colors');
  const [buttonSignal, setButtonSignal] = useState(false);
  const [additionalTokensOpen, setAdditionalTokensOpen] = useState(false);
  const [searchSummary, setSearchSummary] = useState<{
    items: number;
    sections: number;
  }>({
    items: 0,
    sections: sections.length,
  });
  const normalizedQuery = query.trim().toLowerCase();
  const activeSectionIndex = Math.max(
    0,
    sections.findIndex(([id]) => id === activeSection),
  );
  const additionalTokenSearchMatch = useMemo(() => {
    if (!normalizedQuery) return false;
    const styles = getComputedStyle(document.documentElement);
    return additionalTokens.some(([name, label]) =>
      `${name} ${label} ${styles.getPropertyValue(name).trim()}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  useDocumentMetadata({
    title: 'Arcade Blog Design System',
    description:
      'Interactive design-token and component catalogue for Uhanku technical blog posts.',
    path: '/cc',
  });
  const tokenCss = useMemo(() => {
    const styles = getComputedStyle(document.documentElement);
    const names = [...tokens, ...additionalTokens].map(([name]) => name);
    return `:root {\n${names.map((name) => `  ${name}: ${styles.getPropertyValue(name).trim()};`).join('\n')}\n}`;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: [0.02, 0.2, 0.5] },
    );

    sections.forEach(([id]) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const catalogueSections =
      document.querySelectorAll<HTMLElement>('.cc-section');
    const itemSelector = [
      '.component-card',
      '.cc-token-card',
      '.cc-glitch-card',
      '.callout',
      '.blog-status-badge',
      '.metric-card',
      '.tldr-panel',
      '.decision-column',
      '.definition-card',
      '.resource-card',
      '.code-tabs',
      '.diff-block',
      '.file-tree',
      '.test-report',
      '.article-timeline',
      '.reference-list',
      '.series-nav',
      '.cc-class-table tbody tr',
    ].join(', ');
    let visibleSections = 0;
    let visibleItems = 0;
    let firstVisibleSection = '';

    catalogueSections.forEach((section) => {
      const candidates = Array.from(
        section.querySelectorAll<HTMLElement>(itemSelector),
      );
      const items = candidates.filter(
        (item) =>
          !candidates.some(
            (candidate) => candidate !== item && candidate.contains(item),
          ),
      );
      const sectionMatches =
        !normalizedQuery ||
        section.dataset.search?.toLowerCase().includes(normalizedQuery);
      let matchingItems = 0;

      items.forEach((item) => {
        const visible =
          !normalizedQuery ||
          Boolean(sectionMatches) ||
          item.textContent?.toLowerCase().includes(normalizedQuery);
        item.hidden = !visible;
        if (visible) matchingItems += 1;
      });

      const sectionVisible = Boolean(sectionMatches) || matchingItems > 0;
      section.hidden = !sectionVisible;

      if (sectionVisible) {
        visibleSections += 1;
        visibleItems += matchingItems;
        firstVisibleSection ||= section.id;
      }
    });

    setSearchSummary({ items: visibleItems, sections: visibleSections });
    if (normalizedQuery && firstVisibleSection) {
      setActiveSection((current) => {
        const currentSection = document.getElementById(current);
        return currentSection?.hidden ? firstVisibleSection : current;
      });
    }

    document
      .querySelector('.cc-no-results')
      ?.classList.toggle('is-visible', visibleSections === 0);
  }, [normalizedQuery]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        event.preventDefault();
        document.getElementById('cc-search')?.focus();
      }
      if (event.key === 'Escape') {
        setQuery('');
        (
          document.getElementById('cc-search') as HTMLInputElement | null
        )?.blur();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`cc-page${motionPaused ? ' motion-paused' : ''}`}>
      <a className="cc-skip-link" href="#cc-content">
        Skip to component catalogue
      </a>
      <ReadingUtilities />
      <header className="cc-header">
        <a className="cc-brand" href="#top">
          <span aria-hidden="true">U</span> UHANKU_OS
        </a>
        <p className="cc-system-status">
          <i aria-hidden="true" /> TOKENS ONLINE
        </p>
        <nav aria-label="Primary navigation">
          <a href="#colors">Tokens</a>
          <a href="#article-copy">Components</a>
          <a href="#class-reference">Classes</a>
        </nav>
      </header>

      <main id="top">
        <section className="cc-hero">
          <div className="cc-hero__copy">
            <p className="cc-label">UHANKU_OS · BLOG UI PROTOCOL</p>
            <h1>
              Arcade blog <WordGlitch type="ghost">design system</WordGlitch>
            </h1>
            <p className="cc-hero__intro">
              A living, copy-ready catalogue for the visual foundations and
              React primitives used across Uhanku technical blog posts.
            </p>
            <div
              className="cc-hero__capabilities"
              aria-label="Catalogue capabilities"
            >
              <span>LIVE COMPONENTS</span>
              <span>COPY-READY</span>
              <span>MDX MAPPED</span>
            </div>
          </div>
          <aside className="cc-stats" aria-label="Design system summary">
            <div className="cc-stats__label">SYSTEM_CATALOGUE</div>
            <div className="cc-stats__grid">
              {catalogueStats.map((stat) => (
                <div
                  className={`cc-stat cc-stat--${stat.accent}`}
                  key={stat.label}
                >
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <div className="cc-toolbar">
          <div className="cc-search">
            <div className="cc-search__field">
              <label className="sr-only" htmlFor="cc-search">
                Search the design system
              </label>
              <Search
                aria-hidden="true"
                className="cc-search__icon"
                size={16}
                strokeWidth={1.8}
              />
              <input
                id="cc-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tokens, classes, and components..."
              />
              {query ? (
                <button
                  aria-label="Clear design-system search"
                  className="cc-search__clear"
                  type="button"
                  onClick={() => setQuery('')}
                >
                  <X aria-hidden="true" size={15} strokeWidth={2} />
                </button>
              ) : (
                <kbd>/</kbd>
              )}
            </div>
          </div>
          <p className="cc-search-status" aria-live="polite">
            {normalizedQuery
              ? `${searchSummary.items} matches · ${searchSummary.sections} sections`
              : `${sections.length} sections · 30+ patterns`}
          </p>
          <div className="cc-toolbar__actions">
            <CopyButton
              value={tokenCss}
              label="Copy token CSS"
              className="cc-copy--toolbar"
            />
            <button
              type="button"
              aria-pressed={motionPaused}
              onClick={() => setMotionPaused((value) => !value)}
            >
              {motionPaused ? 'Resume motion' : 'Pause motion'}
            </button>
          </div>
        </div>

        <div className="cc-layout">
          <aside className="cc-sidebar">
            <div className="cc-sidebar__header">
              <p>SYSTEM MAP</p>
              <span>
                {String(activeSectionIndex + 1).padStart(2, '0')} /{' '}
                {String(sections.length).padStart(2, '0')}
              </span>
            </div>
            <div className="cc-sidebar__progress" aria-hidden="true">
              <span
                style={{
                  width: `${((activeSectionIndex + 1) / sections.length) * 100}%`,
                }}
              />
            </div>
            <nav aria-label="Documentation sections">
              {sectionGroups.map((group) => (
                <div className="cc-nav-group" key={group.label}>
                  <span>{group.label}</span>
                  {group.ids.map((id) => {
                    const section = sections.find(
                      ([sectionId]) => sectionId === id,
                    );
                    if (!section) return null;
                    const [, label] = section;
                    return (
                      <a
                        aria-current={
                          activeSection === id ? 'location' : undefined
                        }
                        className={activeSection === id ? 'is-active' : ''}
                        href={`#${id}`}
                        key={id}
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              ))}
            </nav>
          </aside>
          <div className="cc-main" id="cc-content" tabIndex={-1}>
            <div className="cc-no-results">
              No matching token or component was found. Press <kbd>Esc</kbd> to
              clear the search.
            </div>

            <div>
              <Section
                id="colors"
                index="00 / TOKENS"
                title="Arcade color tokens"
                description="The core Arcade palette used across blog posts and reusable stylized components."
                className="--* theme variables"
              >
                <div className="cc-docs-subsection">
                  <h3>Main Arcade palette</h3>
                  <p>
                    The 13 primary colors used by the Arcade blog design
                    language.
                  </p>
                  <TokenGrid />
                </div>
                <details
                  className="cc-token-collapse"
                  open={additionalTokensOpen || additionalTokenSearchMatch}
                  onToggle={(event) => {
                    if (!normalizedQuery) {
                      setAdditionalTokensOpen(event.currentTarget.open);
                    }
                  }}
                >
                  <summary>
                    <span>Additional colors and theme tokens</span>
                    <span>{additionalTokens.length} tokens</span>
                  </summary>
                  <div className="cc-token-collapse__body">
                    <p>
                      Application, light-surface, chart, sidebar, and supporting
                      variables.
                    </p>
                    <TokenGrid items={additionalTokens} />
                  </div>
                </details>
              </Section>
            </div>
            <div>
              <Section
                id="article-copy"
                index="01 / PRIMITIVES"
                title="Article copy"
                description="Native HTML remains the default. Keep content semantic inside shared prose wrappers."
                className=".article-copy · .arcade-quote · .check-list"
              >
                <div className="cc-stack">
                  <ComponentCard
                    title="Long-form prose"
                    label="Native HTML"
                    codeSnippet={`<article class="article-copy">
  <h2>Trust starts with visible evidence</h2>
  <p>Use semantic HTML inside the shared prose wrapper.</p>
  <hr />
</article>`}
                  >
                    <CodePreview>
                      <div className="cc-article-copy">
                        <h2>Trust starts with visible evidence</h2>
                        <p>
                          A technical post should explain{' '}
                          <strong>what was built</strong>,{' '}
                          <em>why the trade-off was chosen</em>, and where
                          uncertainty remains. Link to{' '}
                          <a href="#code">reproducible code</a>, use{' '}
                          <mark>highlights sparingly</mark>, and keep obsolete
                          assumptions <del>visibly corrected</del>.
                        </p>
                        <h3>Prefer progressive disclosure</h3>
                        <p>
                          Start with the result, then reveal architecture,
                          constraints, implementation details, and validation
                          evidence in that order.
                        </p>
                        <hr />
                      </div>
                    </CodePreview>
                  </ComponentCard>
                  <ComponentCard title="Pull quote" label=".arcade-quote">
                    <CodePreview>
                      <blockquote className="cc-quote">
                        “A useful system does not merely return an answer. It
                        makes the route from source to conclusion inspectable.”
                      </blockquote>
                    </CodePreview>
                  </ComponentCard>
                  <ComponentCard
                    title="Validation checklist"
                    label=".check-list"
                  >
                    <CodePreview>
                      <CheckList
                        items={[
                          'Every claim links back to evidence.',
                          'Failure states are documented beside success states.',
                          'Examples remain valid without JavaScript.',
                        ]}
                      />
                    </CodePreview>
                  </ComponentCard>
                </div>
              </Section>
            </div>
            <div>
              <Section
                id="code"
                index="02 / COMPONENTS"
                title="Code & console"
                description="Use a console or terminal block for runnable examples and include a copy action."
                className="code · .terminal-block · kbd"
              >
                <div className="cc-stack">
                  <ComponentCard
                    title="Inline code & keyboard"
                    label="Native elements"
                  >
                    <CodePreview>
                      <p className="cc-inline-demo">
                        Add <code>.blog-tags</code>, run{' '}
                        <code>npm run build</code>, and press <kbd>Ctrl</kbd> +{' '}
                        <kbd>K</kbd>.
                      </p>
                    </CodePreview>
                  </ComponentCard>
                  <ComponentCard
                    title="Terminal"
                    label=".terminal-block"
                    codeSnippet={'<TerminalBlock code="$ npm run build" />'}
                  >
                    <CodePreview>
                      <TerminalBlock
                        code={
                          '$ npm run build\n✓ typecheck passed\n✓ static assets generated\n✓ deploy bundle ready'
                        }
                      />
                    </CodePreview>
                  </ComponentCard>
                </div>
              </Section>
            </div>
            <div>
              <Section
                id="callouts"
                index="03 / COMPONENTS"
                title="Callouts"
                description="Interrupt the reading flow when information changes how readers interpret or execute the surrounding content."
                className=".callout--info|success|warning|danger"
              >
                <div className="cc-stack">
                  <Callout title="Information" type="info">
                    <p>
                      Use for context, definitions, or implementation details.
                    </p>
                  </Callout>
                  <Callout title="Validation passed" type="success">
                    <p>The example produced the expected result.</p>
                  </Callout>
                  <Callout title="Compatibility warning" type="warning">
                    <p>This behavior depends on browser support.</p>
                  </Callout>
                  <Callout title="Destructive action" type="danger">
                    <p>
                      Verify the target path before running deletion commands.
                    </p>
                  </Callout>
                </div>
              </Section>
            </div>
            <div>
              <Section
                id="buttons-tags"
                index="04 / COMPONENTS"
                title="Buttons & tags"
                description="Compact controls and stable article taxonomy patterns."
                className=".arcade-button · .blog-tags"
              >
                <CodePreview>
                  <div className="cc-controls-showcase">
                    <section className="cc-control-panel">
                      <header className="cc-control-panel__header">
                        <div>
                          <span>ACTION_HIERARCHY</span>
                          <p>Use one clear primary action per component.</p>
                        </div>
                        <small>04 variants</small>
                      </header>
                      <div className="cc-button-row">
                        <button
                          className="cc-button cc-button--primary"
                          type="button"
                          onClick={() => {
                            setButtonSignal(true);
                            window.setTimeout(
                              () => setButtonSignal(false),
                              900,
                            );
                          }}
                        >
                          <Zap aria-hidden="true" size={14} strokeWidth={2} />
                          {buttonSignal ? 'Signal received' : 'Primary action'}
                        </button>
                        <button className="cc-button" type="button">
                          <ArrowRight
                            aria-hidden="true"
                            size={14}
                            strokeWidth={2}
                          />
                          Secondary
                        </button>
                        <button
                          className="cc-button cc-button--ghost"
                          type="button"
                        >
                          <ExternalLink
                            aria-hidden="true"
                            size={14}
                            strokeWidth={2}
                          />
                          Ghost link
                        </button>
                        <button
                          className="cc-button cc-button--danger"
                          type="button"
                        >
                          <Trash2
                            aria-hidden="true"
                            size={14}
                            strokeWidth={2}
                          />
                          Danger
                        </button>
                      </div>
                    </section>

                    <section className="cc-control-panel cc-control-panel--tags">
                      <header className="cc-control-panel__header">
                        <div>
                          <span>ARTICLE_TAXONOMY</span>
                          <p>Keep tags short, scannable, and content-specific.</p>
                        </div>
                        <small>04 tags</small>
                      </header>
                      <div className="cc-tag-surface">
                        <BlogTags
                          ariaLabel="Article tags"
                          tags={['AWS', 'CloudFront', 'React', 'Build log']}
                        />
                      </div>
                      <p className="cc-control-panel__hint">
                        Recommended: 3–5 tags per article.
                      </p>
                    </section>
                  </div>
                </CodePreview>
              </Section>
            </div>
            <div>
              <Section
                id="statuses"
                index="05 / COMPONENTS"
                title="Post statuses"
                description="Seven semantic statuses, each with a distinct color and motion language."
                className=".blog-status-badge--*"
              >
                <CodePreview>
                  <div className="cc-status-grid">
                    {(
                      [
                        'experimental',
                        'progress',
                        'review',
                        'draft',
                        'archived',
                        'deprecated',
                        'verified',
                      ] as const
                    ).map((status) => (
                      <PostStatus status={status} key={status} />
                    ))}
                  </div>
                </CodePreview>
                <div className="cc-docs-subsection">
                  <h3>Usage guidance</h3>
                  <div className="cc-class-table-wrap">
                    <table className="cc-class-table">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Use when</th>
                          <th>Do not imply</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Experimental</td>
                          <td>The idea may change substantially.</td>
                          <td>Production readiness.</td>
                        </tr>
                        <tr>
                          <td>In progress</td>
                          <td>Work is actively being built or tested.</td>
                          <td>Completion.</td>
                        </tr>
                        <tr>
                          <td>Under review</td>
                          <td>Validation or editorial review is pending.</td>
                          <td>Final approval.</td>
                        </tr>
                        <tr>
                          <td>Draft</td>
                          <td>Incomplete writing is intentionally visible.</td>
                          <td>Stable guidance.</td>
                        </tr>
                        <tr>
                          <td>Archived</td>
                          <td>Old material is retained as reference.</td>
                          <td>Current recommendation.</td>
                        </tr>
                        <tr>
                          <td>Deprecated</td>
                          <td>
                            An approach is obsolete but useful for migration.
                          </td>
                          <td>Continued use.</td>
                        </tr>
                        <tr>
                          <td>Verified</td>
                          <td>Implementation or conclusions were checked.</td>
                          <td>Universal applicability.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Section>
            </div>
            <div>
              <Section
                id="data"
                index="06 / COMPONENTS"
                title="Data display"
                description="Use tables for precise comparison, metrics for key results, and progress bars for bounded values."
                className=".data-table · .metric-card · .arcade-progress"
              >
                <div className="cc-stack">
                  <ComponentCard title="Metrics" label="Summary values">
                    <CodePreview>
                      <div className="cc-metric-grid">
                        <MetricCard
                          label="Documents indexed"
                          value="1,284"
                          delta="+18% this run"
                        />
                        <MetricCard
                          label="Median retrieval"
                          value="84ms"
                          delta="−12ms improved"
                        />
                        <MetricCard label="Grounded answers" value="96.2%" />
                      </div>
                    </CodePreview>
                  </ComponentCard>
                  <ComponentCard title="Progress" label="Bounded values">
                    <CodePreview>
                      <ArcadeProgress label="Ingestion" value={86} />
                      <ArcadeProgress label="Validation" value={62} />
                    </CodePreview>
                  </ComponentCard>
                  <ComponentCard title="Comparison table" label=".data-table">
                    <CodePreview>
                      <DataTable columns={tableColumns} rows={tableRows} />
                    </CodePreview>
                  </ComponentCard>
                </div>
              </Section>
            </div>
            <div>
              <Section
                id="structure"
                index="07 / COMPONENTS"
                title="Process & structure"
                description="Explain architecture with pipelines, ordered steps, metadata, and expandable implementation notes."
                className=".pipeline · .steps · .arcade-details"
              >
                <div className="cc-stack">
                  <ComponentCard title="Pipeline" label=".pipeline">
                    <CodePreview>
                      <Pipeline
                        items={[
                          { label: '01', title: 'Extract' },
                          { label: '02', title: 'Chunk' },
                          { label: '03', title: 'Embed' },
                          { label: '04', title: 'Retrieve' },
                        ]}
                      />
                    </CodePreview>
                  </ComponentCard>
                  <ComponentCard title="Ordered implementation" label=".steps">
                    <CodePreview>
                      <Steps>
                        <li>
                          <strong>Define the test</strong>
                          <p>Write the expected outcome first.</p>
                        </li>
                        <li>
                          <strong>Capture evidence</strong>
                          <p>Record inputs, environment, output, and timing.</p>
                        </li>
                        <li>
                          <strong>Publish limitations</strong>
                          <p>State where the result may not generalize.</p>
                        </li>
                      </Steps>
                    </CodePreview>
                  </ComponentCard>
                  <ComponentCard
                    title="Expandable notes"
                    label=".arcade-details"
                  >
                    <CodePreview>
                      <ArcadeDetails summary="Why use a standalone CSS token layer?">
                        Posts, prototypes, and framework components can share
                        the same values without a runtime dependency.
                      </ArcadeDetails>
                      <ArcadeDetails summary="Where should new components be added?">
                        Add semantic variables first, then component selectors,
                        a documented example, reduced-motion behavior, and a
                        copy-ready snippet.
                      </ArcadeDetails>
                    </CodePreview>
                  </ComponentCard>
                </div>
              </Section>
            </div>
            <div>
              <Section
                id="media"
                index="08 / COMPONENTS"
                title="Media & figures"
                description="Screenshots, diagrams, and media should include useful alternative text and a caption explaining what readers should notice."
                className=".media-frame · figure · figcaption"
              >
                <ComponentCard
                  title="Media frame"
                  label="Accessible image"
                  codeSnippet={
                    '<MediaFigure src={diagram} alt="Document retrieval architecture" caption="Explain what readers should notice." />'
                  }
                >
                  <CodePreview>
                    <MediaFigure
                      src={architectureDiagram}
                      alt="Document retrieval architecture diagram"
                      caption="A diagram caption explains the evidence or relationship visible in the image."
                    />
                  </CodePreview>
                </ComponentCard>
              </Section>
            </div>
            <div>
              <Section
                id="editorial-blocks"
                index="09 / COMPONENTS"
                title="Editorial blocks"
                description="Help readers understand the result quickly, compare trade-offs, learn terminology, and continue into related material."
                className=".tldr-panel · .pros-cons · .definition-card · .resource-card"
              >
                <div className="cc-stack">
                  <ComponentCard
                    title="Fast summary"
                    label=".tldr-panel"
                    codeSnippet={
                      '<TldrPanel points={["Result", "Trade-off"]}>Summary text.</TldrPanel>'
                    }
                  >
                    <CodePreview>
                      <TldrPanel
                        points={[
                          'Hybrid retrieval improved recall without changing the authoring flow.',
                          'Reranking stays optional because it adds measurable latency.',
                          'Every answer keeps a visible route back to source evidence.',
                        ]}
                      >
                        The selected architecture combines semantic and keyword
                        retrieval, then exposes the supporting chunks beside the
                        generated answer.
                      </TldrPanel>
                    </CodePreview>
                  </ComponentCard>
                  <ComponentCard
                    title="Trade-off comparison"
                    label=".pros-cons"
                    codeSnippet={
                      '<ProsCons pros={["Higher recall"]} cons={["More latency"]} />'
                    }
                  >
                    <CodePreview>
                      <ProsCons
                        pros={[
                          'Finds exact terms and semantically similar passages.',
                          'Produces stronger evidence for technical questions.',
                          'Keeps retrieval behavior explainable.',
                        ]}
                        cons={[
                          'Requires two retrieval paths to maintain.',
                          'Adds ranking and tuning decisions.',
                          'Uses slightly more query time.',
                        ]}
                      />
                    </CodePreview>
                  </ComponentCard>
                  <div className="feature-pair">
                    <DefinitionCard label="TERM_01" term="Grounded answer">
                      A generated response whose claims are supported by
                      inspectable source passages returned by retrieval.
                    </DefinitionCard>
                    <ResourceCard
                      description="Continue into the implementation and validation patterns used by the article."
                      href="#technical-evidence"
                      title="Presenting technical evidence"
                    />
                  </div>
                </div>
              </Section>
            </div>
            <div>
              <Section
                id="technical-evidence"
                index="10 / COMPONENTS"
                title="Technical evidence"
                description="Publish alternate implementations, focused diffs, project structure, and validation output without flattening everything into prose."
                className=".code-tabs · .diff-block · .file-tree · .test-report"
              >
                <div className="cc-stack">
                  <ComponentCard
                    title="Code tabs"
                    label="Keyboard accessible"
                    codeSnippet={
                      '<CodeTabs tabs={[{ id: "ts", label: "TypeScript", code: "..." }]} />'
                    }
                  >
                    <CodePreview>
                      <CodeTabs
                        ariaLabel="Retrieval implementation"
                        tabs={[
                          {
                            id: 'typescript',
                            label: 'TypeScript',
                            language: 'typescript',
                            code: `const matches = await retrieve({
  query,
  limit: 8,
  strategy: 'hybrid',
});`,
                          },
                          {
                            id: 'sql',
                            label: 'SQL',
                            language: 'sql',
                            code: `SELECT content, embedding <-> $1 AS distance
FROM chunks
ORDER BY distance
LIMIT 8;`,
                          },
                          {
                            id: 'shell',
                            label: 'Shell',
                            language: 'bash',
                            code: `npm run typecheck
npm run build`,
                          },
                        ]}
                      />
                    </CodePreview>
                  </ComponentCard>
                  <ComponentCard
                    title="Focused diff"
                    label=".diff-block"
                    codeSnippet={
                      '<DiffBlock file="retrieval.ts" lines={[{ type: "added", content: "..." }]} />'
                    }
                  >
                    <CodePreview>
                      <DiffBlock
                        file="src/retrieval/hybrid.ts"
                        lines={[
                          {
                            type: 'removed',
                            content:
                              'const matches = await vectorSearch(query);',
                          },
                          {
                            type: 'added',
                            content:
                              'const semantic = await vectorSearch(query);',
                          },
                          {
                            type: 'added',
                            content:
                              'const lexical = await keywordSearch(query);',
                          },
                          {
                            type: 'added',
                            content:
                              'return reciprocalRankFusion(semantic, lexical);',
                          },
                        ]}
                      />
                    </CodePreview>
                  </ComponentCard>
                  <div className="feature-pair feature-pair--technical">
                    <FileTree
                      countLabel="5 files"
                      items={[
                        {
                          name: 'src',
                          type: 'folder',
                          children: [
                            {
                              name: 'retrieval',
                              type: 'folder',
                              children: [
                                { name: 'hybrid.ts' },
                                { name: 'rerank.ts' },
                              ],
                            },
                            { name: 'validation.ts' },
                          ],
                        },
                        { name: 'README.md' },
                      ]}
                    />
                    <TestReport
                      duration="4.82s"
                      items={[
                        { label: 'Unit tests', result: '8 passed' },
                        { label: 'Integration tests', result: '3 passed' },
                        { label: 'Build verification', result: 'passed' },
                      ]}
                      summary="12 / 12 passed"
                    />
                  </div>
                </div>
              </Section>
            </div>
            <div>
              <Section
                id="reading-references"
                index="11 / COMPONENTS"
                title="Reading & references"
                description="Support long technical articles with progress feedback, revision history, sources, and navigation between parts of a series."
                className=".reading-progress · .article-timeline · .reference-list · .series-nav"
              >
                <div className="cc-stack">
                  <ComponentCard
                    title="Reading utilities"
                    label="Live on this page"
                    codeSnippet={'<ReadingUtilities />'}
                  >
                    <CodePreview>
                      <div className="reading-utility-demo">
                        <div>
                          <span>ARTICLE_POSITION</span>
                          <strong>Progress + return control</strong>
                        </div>
                        <p>
                          The thin fixed line at the top of this page and the
                          back-to-top button are provided by one reusable React
                          component.
                        </p>
                      </div>
                    </CodePreview>
                  </ComponentCard>
                  <ComponentCard
                    title="Article changelog"
                    label=".article-timeline"
                    codeSnippet={
                      '<ArticleTimeline items={[{ date: "2026-07-21", title: "Published" }]} />'
                    }
                  >
                    <CodePreview>
                      <ArticleTimeline
                        items={[
                          {
                            date: '2026-07-21',
                            title: 'Expanded component catalogue',
                            description:
                              'Added editorial, evidence, and reference patterns.',
                          },
                          {
                            date: '2026-07-18',
                            title: 'Validated examples',
                            description:
                              'Rechecked build output and reduced-motion behavior.',
                          },
                          {
                            date: '2026-07-16',
                            title: 'Initial field log',
                            description:
                              'Published architecture and implementation notes.',
                          },
                        ]}
                      />
                    </CodePreview>
                  </ComponentCard>
                  <ComponentCard
                    title="References"
                    label=".reference-list"
                    codeSnippet={
                      '<ReferenceList items={[{ href: "#", label: "Source" }]} />'
                    }
                  >
                    <CodePreview>
                      <ReferenceList
                        items={[
                          {
                            description:
                              'Shared semantic and Arcade color definitions used by the examples.',
                            href: '#colors',
                            label: 'Design-token source',
                            returnHref: '#reading-references',
                          },
                          {
                            description:
                              'Code, diff, project-tree, and test-result presentation patterns.',
                            href: '#technical-evidence',
                            label: 'Validation evidence',
                            returnHref: '#reading-references',
                          },
                        ]}
                      />
                    </CodePreview>
                  </ComponentCard>
                  <SeriesNav
                    current={2}
                    next={{
                      href: '#technical-evidence',
                      meta: 'Part 3 of 3',
                      title: 'Validating the result',
                    }}
                    previous={{
                      href: '#structure',
                      meta: 'Part 1 of 3',
                      title: 'Designing the pipeline',
                    }}
                    total={3}
                  />
                </div>
              </Section>
            </div>
            <div>
              <Section
                id="word-glitches"
                index="12 / EFFECTS"
                title="Word glitch types"
                description="Six reusable treatments for short decorative emphasis. Glitched text is never required to understand the article."
                className=".word-glitch · .word-glitch--*"
              >
                <div className="cc-glitch-grid">
                  {(
                    [
                      ['Split signal', 'default', 'signal'],
                      ['Subtle drift', 'subtle', 'stable'],
                      ['Hard cut', 'hard-cut', 'warning'],
                      ['Scanline', 'scanline', 'indexed'],
                      ['Ghost echo', 'ghost', 'memory'],
                      ['Interaction burst', 'hover', 'inspect'],
                    ] as const
                  ).map(([title, type, text]) => (
                    <article className="cc-glitch-card" key={title}>
                      <header>
                        <span>{title}</span>
                        <code>{type}</code>
                      </header>
                      <div>
                        <WordGlitch
                          type={type}
                          tabIndex={type === 'hover' ? 0 : undefined}
                        >
                          {text}
                        </WordGlitch>
                      </div>
                      <p>Decorative emphasis for short editorial language.</p>
                    </article>
                  ))}
                </div>
                <Callout title="Usage constraint" type="warning">
                  <p>
                    Never use glitches for commands, measurements, status
                    values, or content required to understand the article.
                  </p>
                </Callout>
              </Section>
            </div>
            <div>
              <Section
                id="effects"
                index="13 / EFFECTS"
                title="Arcade effects"
                description="Supporting visual treatments for separating article sections without introducing another bordered component."
                className=".arcade-divider"
              >
                <ComponentCard
                  title="Section dividers"
                  label="Standard and pixel"
                  codeSnippet={'<ArcadeDivider />\n<ArcadeDivider pixel />'}
                >
                  <CodePreview>
                    <ArcadeDivider />
                    <ArcadeDivider pixel />
                  </CodePreview>
                </ComponentCard>
              </Section>
            </div>
            <div>
              <Section
                id="class-reference"
                index="14 / REFERENCE"
                title="Class reference"
                description="Stable selectors intended for static HTML, MDX mappings, React components, and future component packs."
                className="HTML · CSS · MDX"
              >
                <div className="cc-class-table-wrap">
                  <table className="cc-class-table">
                    <thead>
                      <tr>
                        <th>Class</th>
                        <th>Purpose</th>
                        <th>Element</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <code>.article-copy</code>
                        </td>
                        <td>Long-form semantic article content.</td>
                        <td>article</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.word-glitch</code>
                        </td>
                        <td>Default split-signal decorative text.</td>
                        <td>span</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.word-glitch--*</code>
                        </td>
                        <td>
                          Subtle, hard-cut, scanline, ghost, and interaction
                          variants.
                        </td>
                        <td>span / a</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.blog-tags</code>
                        </td>
                        <td>Shared article taxonomy list.</td>
                        <td>ul</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.blog-status-badge</code>
                        </td>
                        <td>Semantic animated post status.</td>
                        <td>span</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.callout</code>
                        </td>
                        <td>Contextual note with semantic variants.</td>
                        <td>aside</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.terminal-block</code>
                        </td>
                        <td>Command output or shell transcript.</td>
                        <td>div</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.data-table-wrap</code>
                        </td>
                        <td>Responsive comparison-table container.</td>
                        <td>div</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.metric-card</code>
                        </td>
                        <td>Single high-value result with optional delta.</td>
                        <td>article</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.arcade-progress</code>
                        </td>
                        <td>Bounded progress with visible value.</td>
                        <td>div</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.pipeline</code>
                        </td>
                        <td>Directional process sequence.</td>
                        <td>div</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.steps</code>
                        </td>
                        <td>Vertical ordered procedure.</td>
                        <td>ol</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.arcade-details</code>
                        </td>
                        <td>Expandable implementation note.</td>
                        <td>details</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.media-frame</code>
                        </td>
                        <td>Accessible image or diagram with caption.</td>
                        <td>figure</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.tldr-panel</code>
                        </td>
                        <td>Fast article summary with key takeaways.</td>
                        <td>aside</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.pros-cons</code>
                        </td>
                        <td>Two-column benefits and costs comparison.</td>
                        <td>div</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.definition-card</code>
                        </td>
                        <td>Glossary term or compact concept explanation.</td>
                        <td>aside</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.resource-card</code>
                        </td>
                        <td>Internal or external related-resource preview.</td>
                        <td>a</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.code-tabs</code>
                        </td>
                        <td>Keyboard-accessible alternate code examples.</td>
                        <td>div</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.diff-block</code>
                        </td>
                        <td>Focused added, removed, and context lines.</td>
                        <td>div</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.file-tree</code>
                        </td>
                        <td>Project or directory structure.</td>
                        <td>article</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.test-report</code>
                        </td>
                        <td>Compact validation and test-run summary.</td>
                        <td>article</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.reading-progress</code>
                        </td>
                        <td>Fixed document-scroll progress indicator.</td>
                        <td>div</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.back-to-top</code>
                        </td>
                        <td>Long-article return control.</td>
                        <td>button</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.article-timeline</code>
                        </td>
                        <td>
                          Article changelog, release history, or milestones.
                        </td>
                        <td>ol</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.reference-list</code>
                        </td>
                        <td>Numbered sources, citations, or bibliography.</td>
                        <td>ol</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.series-nav</code>
                        </td>
                        <td>
                          Previous and next navigation for article series.
                        </td>
                        <td>nav</td>
                      </tr>
                      <tr>
                        <td>
                          <code>.arcade-divider</code>
                        </td>
                        <td>Article section separator.</td>
                        <td>div</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="cc-docs-subsection">
                  <h3>Minimal post shell</h3>
                  <div className="cc-snippet">
                    <CopyButton
                      value={
                        '<main class="article-page">\n  <header class="article-hero arcade-panel">...</header>\n  <article class="article-copy">...</article>\n</main>'
                      }
                    />
                    <pre>
                      <code>
                        {
                          '<main class="article-page">\n  <header class="article-hero arcade-panel">...</header>\n  <article class="article-copy">...</article>\n</main>'
                        }
                      </code>
                    </pre>
                  </div>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </main>
      <footer className="cc-footer">
        <span>UHANKU_OS · BLOG DESIGN SYSTEM</span>
        <span>Live React components · MDX ready · keyboard accessible</span>
      </footer>
    </div>
  );
}
