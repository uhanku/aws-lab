import './TocConsole.css';

export interface TocConsoleItem {
  id: string;
  label: string;
  level: 2 | 3;
}

interface TocConsoleProps {
  items: TocConsoleItem[];
}

export function TocConsole({ items }: TocConsoleProps) {
  return (
    <nav
      className="toc-console blog-reveal blog-reveal--3"
      aria-labelledby="toc-console-title"
    >
      <div className="toc-console__bar">
        <span id="toc-console-title">NAV_MAP</span>
        <span>{String(items.length).padStart(2, '0')} NODES</span>
      </div>
      <ol className="toc-console__list">
        {items.map((item, index) => (
          <li
            className={`toc-console__item toc-console__item--level-${item.level}`}
            key={item.id}
          >
            <a href={`#${item.id}`}>
              <span aria-hidden="true">
                {String(index + 1).padStart(2, '0')} /{' '}
              </span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
