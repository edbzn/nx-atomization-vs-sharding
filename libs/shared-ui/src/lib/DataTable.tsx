import { useMemo, useState, type ReactNode } from 'react';
import { Button } from './Button';
import { TextField } from './fields';

export interface Column<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

export interface DataTableProps<T extends { id: string }> {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  filterKeys: (keyof T & string)[];
  pageSize?: number;
  onRowClick?: (row: T) => void;
}

type SortState<T> = { key: keyof T & string; dir: 'asc' | 'desc' } | null;

export function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  const as = String(a);
  const bs = String(b);
  return as < bs ? -1 : as > bs ? 1 : 0;
}

export function filterRows<T>(rows: T[], keys: (keyof T & string)[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) => keys.some((k) => String(row[k]).toLowerCase().includes(q)));
}

export function DataTable<T extends { id: string }>({ caption, columns, rows, filterKeys, pageSize = 10, onRowClick }: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortState<T>>(null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => filterRows(rows, filterKeys, query), [rows, filterKeys, query]);
  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const out = filtered.slice();
    out.sort((a, b) => {
      const c = compareValues(a[sort.key], b[sort.key]);
      return sort.dir === 'asc' ? c : -c;
    });
    return out;
  }, [filtered, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pageCount - 1);
  const visible = sorted.slice(current * pageSize, (current + 1) * pageSize);
  const start = current * pageSize + 1;
  const end = Math.min(sorted.length, (current + 1) * pageSize);

  const toggleSort = (key: keyof T & string) => {
    setSort((prev) => (prev && prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
    setPage(0);
  };

  return (
    <section className="data-table">
      <TextField
        label="Filter"
        name="filter"
        type="search"
        value={query}
        placeholder={`Search ${caption.toLowerCase()}`}
        onChange={(v) => {
          setQuery(v);
          setPage(0);
        }}
      />
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((col) => {
              const active = sort?.key === col.key;
              return (
                <th key={col.key} scope="col" aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  {col.sortable ? (
                    <button type="button" className="sort-button" onClick={() => toggleSort(col.key)}>
                      {col.header}
                      {active ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ''}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visible.map((row) => (
            <tr key={row.id} data-testid="row" onClick={onRowClick ? () => onRowClick(row) : undefined}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : String(row[col.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <footer className="data-table-footer">
        <span data-testid="table-status">{sorted.length === 0 ? 'No results' : `Showing ${start}-${end} of ${sorted.length}`}</span>
        <Button variant="secondary" disabled={current === 0} onClick={() => setPage(current - 1)}>
          Previous
        </Button>
        <Button variant="secondary" disabled={current >= pageCount - 1} onClick={() => setPage(current + 1)}>
          Next
        </Button>
      </footer>
    </section>
  );
}
