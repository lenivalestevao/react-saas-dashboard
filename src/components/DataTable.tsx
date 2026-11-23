import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { paginate, sortRows, type SortDir } from '../lib/table';
import { Icon } from './ui';

export interface Column<T> {
  key: string;
  header: string;
  /** Provide a value to make the column sortable. */
  sort?: (row: T) => string | number;
  render: (row: T) => ReactNode;
  align?: 'right';
}

interface Props<T> {
  rows: readonly T[];
  columns: readonly Column<T>[];
  rowKey: (row: T) => string;
  pageSize?: number;
  initialSort?: { key: string; dir: SortDir };
  empty?: string;
}

export function DataTable<T>({ rows, columns, rowKey, pageSize = 8, initialSort, empty = 'Nothing to show.' }: Props<T>) {
  const [sort, setSort] = useState<{ key: string; dir: SortDir } | null>(initialSort ?? null);
  const [page, setPage] = useState(0);

  useEffect(() => setPage(0), [rows]);

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sort?.key);
    return sort && col?.sort ? sortRows(rows, col.sort, sort.dir) : rows;
  }, [rows, columns, sort]);

  const view = paginate(sorted, page, pageSize);

  const toggle = (key: string) =>
    setSort((s) => (s?.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  return (
    <div className="table-wrap">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={c.align === 'right' ? 'right' : ''} aria-sort={sort?.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                  {c.sort ? (
                    <button type="button" className="th-btn" onClick={() => toggle(c.key)}>
                      {c.header}
                      <Icon name="sort" size={14} />
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.items.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((c) => (
                  <td key={c.key} className={c.align === 'right' ? 'right' : ''}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
            {view.total === 0 && (
              <tr>
                <td colSpan={columns.length} className="empty">
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="table-foot">
        <span>
          {view.from}-{view.to} of {view.total}
        </span>
        <div className="pager">
          <button type="button" className="icon-btn" aria-label="Previous page" disabled={view.page === 0} onClick={() => setPage(view.page - 1)}>
            <Icon name="prev" size={16} />
          </button>
          <span>
            {view.page + 1} / {view.pageCount}
          </span>
          <button type="button" className="icon-btn" aria-label="Next page" disabled={view.page >= view.pageCount - 1} onClick={() => setPage(view.page + 1)}>
            <Icon name="next" size={16} />
          </button>
        </div>
      </footer>
    </div>
  );
}
