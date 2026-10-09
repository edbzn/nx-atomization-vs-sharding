// libs/shared-ui: the React component library every other project depends on.
// `variant.buttonSize` is the "full" change: a new Button prop with a default value.

export function sharedUiFiles({ buttonSize = false } = {}) {
  const root = 'libs/shared-ui';
  const files = {};
  files[`${root}/package.json`] = JSON.stringify(
    {
      name: '@bench/shared-ui',
      version: '0.0.0',
      private: true,
      main: './src/index.ts',
      types: './src/index.ts',
      exports: { '.': './src/index.ts' },
      nx: { name: 'shared-ui', tags: ['type:ui'] },
    },
    null,
    2,
  ) + '\n';
  files[`${root}/tsconfig.json`] = JSON.stringify(
    { extends: '../../tsconfig.base.json', include: ['src/**/*.ts', 'src/**/*.tsx'] },
    null,
    2,
  ) + '\n';
  files[`${root}/src/index.ts`] = `export * from './lib/Button';
export * from './lib/fields';
export * from './lib/DataTable';
export * from './lib/useForm';
export * from './lib/Tabs';
export * from './lib/Toast';
export * from './lib/Card';
export * from './lib/format';
`;

  files[`${root}/src/lib/Button.tsx`] = buttonSize
    ? `import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Visual density. Defaults to \`md\` so existing call sites are unchanged. */
  size?: ButtonSize;
}

export function Button({ variant = 'primary', size = 'md', type = 'button', className, ...rest }: ButtonProps) {
  const classes = ['btn', \`btn-\${variant}\`, \`btn-\${size}\`, className].filter(Boolean).join(' ');
  return <button type={type} className={classes} data-size={size} {...rest} />;
}
`
    : `import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', type = 'button', className, ...rest }: ButtonProps) {
  const classes = ['btn', \`btn-\${variant}\`, className].filter(Boolean).join(' ');
  return <button type={type} className={classes} {...rest} />;
}
`;

  files[`${root}/src/lib/fields.tsx`] = `import { useId, type ChangeEvent, type KeyboardEvent } from 'react';

interface BaseFieldProps {
  label: string;
  error?: string;
  hint?: string;
}

function FieldMessages({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  return (
    <>
      {hint && !error ? (
        <p className="field-hint" id={\`\${id}-hint\`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field-error" role="alert" id={\`\${id}-error\`}>
          {error}
        </p>
      ) : null}
    </>
  );
}

export interface TextFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'number' | 'search' | 'tel';
  placeholder?: string;
  name?: string;
  onEnter?: () => void;
}

export function TextField({ label, error, hint, value, onChange, type = 'text', placeholder, name, onEnter }: TextFieldProps) {
  const id = useId();
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };
  return (
    <div className={error ? 'field field-invalid' : 'field'}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? \`\${id}-error\` : hint ? \`\${id}-hint\` : undefined}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <FieldMessages id={id} error={error} hint={hint} />
    </div>
  );
}

export interface TextAreaProps extends BaseFieldProps {
  value: string;
  name?: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
}

export function TextArea({ label, error, hint, value, onChange, rows = 3, maxLength, name }: TextAreaProps) {
  const id = useId();
  return (
    <div className={error ? 'field field-invalid' : 'field'}>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} name={name} rows={rows} value={value} aria-invalid={error ? true : undefined} onChange={(e) => onChange(e.target.value)} />
      {maxLength ? (
        <p className="field-counter" data-testid="char-counter">
          {value.length}/{maxLength}
        </p>
      ) : null}
      <FieldMessages id={id} error={error} hint={hint} />
    </div>
  );
}

export interface SelectFieldProps extends BaseFieldProps {
  value: string;
  name?: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
}

export function SelectField({ label, error, hint, value, onChange, options, placeholder = 'Select...', name }: SelectFieldProps) {
  const id = useId();
  return (
    <div className={error ? 'field field-invalid' : 'field'}>
      <label htmlFor={id}>{label}</label>
      <select id={id} name={name} value={value} aria-invalid={error ? true : undefined} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <FieldMessages id={id} error={error} hint={hint} />
    </div>
  );
}

export interface CheckboxFieldProps {
  label: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxField({ label, checked, onChange, name }: CheckboxFieldProps) {
  const id = useId();
  return (
    <div className="field field-checkbox">
      <input id={id} name={name} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
`;

  files[`${root}/src/lib/useForm.ts`] = `import { useCallback, useState } from 'react';

export interface FieldRule {
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
  min?: number;
  max?: number;
}

export type FormRules<T> = Partial<Record<keyof T & string, FieldRule>>;
export type FormErrors<T> = Partial<Record<keyof T & string, string>>;

export function validateField(raw: unknown, rule: FieldRule): string | undefined {
  const value = raw == null ? '' : String(raw).trim();
  if (rule.required && value.length === 0) return \`\${rule.label} is required\`;
  if (value.length === 0) return undefined;
  if (rule.minLength !== undefined && value.length < rule.minLength) {
    return \`\${rule.label} must be at least \${rule.minLength} characters\`;
  }
  if (rule.maxLength !== undefined && value.length > rule.maxLength) {
    return \`\${rule.label} must be at most \${rule.maxLength} characters\`;
  }
  if (rule.pattern && !rule.pattern.test(value)) return rule.patternMessage ?? \`\${rule.label} is invalid\`;
  if (rule.min !== undefined || rule.max !== undefined) {
    const n = Number(value);
    if (Number.isNaN(n) || (rule.min !== undefined && n < rule.min) || (rule.max !== undefined && n > rule.max)) {
      return \`\${rule.label} must be between \${rule.min ?? '-inf'} and \${rule.max ?? 'inf'}\`;
    }
  }
  return undefined;
}

export function validateAll<T extends Record<string, unknown>>(values: T, rules: FormRules<T>): FormErrors<T> {
  const errors: FormErrors<T> = {};
  for (const key of Object.keys(rules) as (keyof T & string)[]) {
    const rule = rules[key];
    if (!rule) continue;
    const message = validateField(values[key], rule);
    if (message) errors[key] = message;
  }
  return errors;
}

export function useForm<T extends Record<string, unknown>>(initial: T, rules: FormRules<T>) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [submitCount, setSubmitCount] = useState(0);

  const setValue = useCallback(
    <K extends keyof T & string>(key: K, value: T[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const rule = rules[key];
        const next = { ...prev };
        const message = rule ? validateField(value, rule) : undefined;
        if (message) next[key] = message;
        else delete next[key];
        return next;
      });
    },
    [rules],
  );

  const handleSubmit = useCallback(
    (onValid: (values: T) => void) => {
      setSubmitCount((c) => c + 1);
      const nextErrors = validateAll(values, rules);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length === 0) onValid(values);
    },
    [values, rules],
  );

  const reset = useCallback(() => {
    setValues(initial);
    setErrors({});
  }, [initial]);

  return { values, errors, setValue, handleSubmit, reset, submitCount };
}
`;

  files[`${root}/src/lib/DataTable.tsx`] = `import { useMemo, useState, type ReactNode } from 'react';
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
        placeholder={\`Search \${caption.toLowerCase()}\`}
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
        <span data-testid="table-status">{sorted.length === 0 ? 'No results' : \`Showing \${start}-\${end} of \${sorted.length}\`}</span>
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
`;

  files[`${root}/src/lib/Tabs.tsx`] = `import { useState, type ReactNode } from 'react';

export interface TabDef {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({ tabs, initial }: { tabs: TabDef[]; initial?: string }) {
  const [active, setActive] = useState(initial ?? tabs[0]?.id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  return (
    <div className="tabs">
      <div role="tablist">
        {tabs.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={t.id === current?.id} onClick={() => setActive(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-label={current?.label}>
        {current?.content}
      </div>
    </div>
  );
}
`;

  files[`${root}/src/lib/Toast.tsx`] = `import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

interface ToastItem {
  id: number;
  message: string;
}

const ToastContext = createContext<(message: string) => void>(() => undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((message: string) => {
    setItems((prev) => [...prev.slice(-4), { id: (prev.at(-1)?.id ?? 0) + 1, message }]);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <ul className="toasts" aria-live="polite">
        {items.map((t) => (
          <li key={t.id} role="status">
            {t.message}
          </li>
        ))}
      </ul>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
`;

  files[`${root}/src/lib/Card.tsx`] = `import type { ReactNode } from 'react';

export function Card({ title, children, footer }: { title: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
      {footer ? <footer className="card-footer">{footer}</footer> : null}
    </article>
  );
}

export function Badge({ tone = 'neutral', children }: { tone?: 'neutral' | 'success' | 'warning' | 'danger'; children: ReactNode }) {
  return <span className={\`badge badge-\${tone}\`}>{children}</span>;
}
`;

  files[`${root}/src/lib/format.ts`] = `export function formatMoney(cents: number): string {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const whole = Math.floor(abs / 100)
    .toString()
    .replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
  return \`\${sign}$\${whole}.\${String(abs % 100).padStart(2, '0')}\`;
}

/** Stable, human-friendly reference derived from a seed string (djb2 -> base36). */
export function orderReference(seed: string): string {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h + seed.charCodeAt(i)) >>> 0;
  }
  return \`REF-\${h.toString(36).toUpperCase().padStart(7, '0')}\`;
}

export function pluralize(count: number, singular: string, plural = \`\${singular}s\`): string {
  return \`\${count} \${count === 1 ? singular : plural}\`;
}
`;
  return files;
}
