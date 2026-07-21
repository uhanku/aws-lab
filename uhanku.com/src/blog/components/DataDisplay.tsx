import type { ReactNode } from 'react';
import type { CSSProperties } from 'react';

export interface Metric {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
}

export function MetricCard({ label, value, delta }: Metric) {
  return (
    <article className="metric-card">
      <span className="metric-card__label">{label}</span>
      <strong className="metric-card__value">{value}</strong>
      {delta ? <span className="metric-card__delta">{delta}</span> : null}
    </article>
  );
}

interface ProgressProps {
  label: string;
  value: number;
}

export function ArcadeProgress({ label, value }: ProgressProps) {
  const boundedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="arcade-progress">
      <span className="arcade-progress__label">{label}</span>
      <div className="arcade-progress__track">
        <div
          className="arcade-progress__fill"
          style={{ '--progress': `${boundedValue}%` } as CSSProperties}
        />
      </div>
      <span className="arcade-progress__value">{boundedValue}%</span>
    </div>
  );
}

export interface DataColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataColumn<T>[];
  rows: T[];
  getRowKey?: (row: T, index: number) => string | number;
}

export function DataTable<T>({ columns, rows, getRowKey }: DataTableProps<T>) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={getRowKey?.(row, index) ?? index}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render
                    ? column.render(row)
                    : String(
                        (row as Record<string, unknown>)[column.key] ?? '',
                      )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
