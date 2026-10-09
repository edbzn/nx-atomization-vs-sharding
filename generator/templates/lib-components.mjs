// React components of a domain library (shared by the Cypress-CT libs and the Vitest libs).
// Each lib gets the same five components, specialised for its domain:
//   <Entity>Table, <Entity>Form, TagEditor, <Entity>Wizard, <Entity>Board
// `touched` is the "partial" change: a small, behaviour-preserving feature added to the lib.

import { kebab, tsString } from '../lib/domain.mjs';

export function componentNames(domain) {
  return {
    table: `${domain.entity}Table`,
    form: `${domain.entity}Form`,
    tags: 'TagEditor',
    wizard: `${domain.entity}Wizard`,
    board: `${domain.entity}Board`,
  };
}

/** Directory (relative to the lib root) of each component. */
export function componentDirs(domain) {
  const n = componentNames(domain);
  return Object.fromEntries(Object.entries(n).map(([k, v]) => [k, `src/lib/${kebab(v)}`]));
}

export function libComponentFiles(root, domain, { touched = false } = {}) {
  const n = componentNames(domain);
  const d = componentDirs(domain);
  const E = domain.entity;
  const rowType = `${E}Row`;
  const files = {};
  const categories = `[${domain.categories.map(tsString).join(', ')}] as const`;

  files[`${root}/src/lib/types.ts`] = `export interface ${rowType} {
  id: string;
  name: string;
  category: string;
  /** Amount in cents. */
  amount: number;
}

export const ${domain.key.toUpperCase()}_CATEGORIES = ${categories};
`;

  files[`${root}/${d.table}/${n.table}.tsx`] = `import { Badge, DataTable, formatMoney, type Column } from '@bench/shared-ui';
import type { ${rowType} } from '../types';

const columns: Column<${rowType}>[] = [
  { key: 'id', header: 'Reference', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'category', header: 'Category', render: (row) => <Badge>{row.category}</Badge> },
  { key: 'amount', header: 'Amount', sortable: true, render: (row) => formatMoney(row.amount) },
];

const filterKeys: (keyof ${rowType} & string)[] = ['id', 'name', 'category'];

export interface ${n.table}Props {
  rows: ${rowType}[];
  pageSize?: number;
  onSelect?: (row: ${rowType}) => void;
}

export function ${n.table}({ rows, pageSize = 10, onSelect }: ${n.table}Props) {
  return <DataTable caption=${tsString(domain.plural).replace(/'/g, '"')} columns={columns} rows={rows} filterKeys={filterKeys} pageSize={pageSize} onRowClick={onSelect} />;
}
`;

  files[`${root}/${d.form}/${n.form}.tsx`] = `import { Button, SelectField, TextArea, TextField, pluralize, useForm, type FormRules } from '@bench/shared-ui';
import { ${domain.key.toUpperCase()}_CATEGORIES } from '../types';

export interface ${n.form}Values extends Record<string, unknown> {
  name: string;
  email: string;
  category: string;
  amount: string;
  notes: string;
}

export interface ${n.form}Result {
  name: string;
  email: string;
  category: string;
  amount: number;
  notes: string;
}

const rules: FormRules<${n.form}Values> = {
  name: { label: 'Name', required: true, minLength: 3, maxLength: 60 },
  email: { label: 'Email', required: true, pattern: /^[^\\s@]+@[^\\s@]+\\.[a-z]{2,}$/i, patternMessage: 'Enter a valid email address' },
  category: { label: 'Category', required: true },
  amount: { label: 'Amount', required: true, min: 1, max: 100000 },
  notes: { label: 'Notes', maxLength: 200 },
};

const empty: ${n.form}Values = { name: '', email: '', category: '', amount: '', notes: '' };

export function ${n.form}({ onSubmit, initial = empty }: { onSubmit: (value: ${n.form}Result) => void; initial?: ${n.form}Values }) {
  const { values, errors, setValue, handleSubmit } = useForm<${n.form}Values>(initial, rules);
  const errorCount = Object.keys(errors).length;
  return (
    <form
      aria-label=${JSON.stringify(`${E} form`)}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit((v) => onSubmit({ ...v, amount: Number(v.amount) }));
      }}
    >
      <TextField label="Name" name="name" value={values.name} error={errors.name} onChange={(v) => setValue('name', v)} />
      <TextField label="Email" name="email" type="email" value={values.email} error={errors.email} onChange={(v) => setValue('email', v)} />
      <SelectField label="Category" name="category" options={${domain.key.toUpperCase()}_CATEGORIES} value={values.category} error={errors.category} onChange={(v) => setValue('category', v)} />
      <TextField label="Amount" name="amount" hint="Between 1 and 100000" value={values.amount} error={errors.amount} onChange={(v) => setValue('amount', v)} />
      <TextArea label="Notes" name="notes" maxLength={200} value={values.notes} error={errors.notes} onChange={(v) => setValue('notes', v)} />
      {errorCount > 0 ? (
        <p role="status" data-testid="error-summary">
          {pluralize(errorCount, 'error')}
        </p>
      ) : null}
      <Button type="submit">Save ${domain.entity.toLowerCase()}</Button>
    </form>
  );
}
`;

  files[`${root}/${d.tags}/${n.tags}.tsx`] = `import { useState } from 'react';
import { Button, TextField, pluralize } from '@bench/shared-ui';

export interface TagEditorProps {
  initial?: string[];
  max?: number;
  label?: string;
  onChange?: (tags: string[]) => void;
}

export function normalizeTag(raw: string): string {
  return raw.trim().toLowerCase().replace(/\\s+/g, '-');
}

export function TagEditor({ initial = [], max = 40, label = 'Tags', onChange }: TagEditorProps) {
  const [tags, setTags] = useState<string[]>(initial);
  const [draft, setDraft] = useState('');
  const [message, setMessage] = useState('');

  const commit = (next: string[]) => {
    setTags(next);
    onChange?.(next);
  };

  const add = () => {
    const tag = normalizeTag(draft);
    setDraft('');
    if (!tag) return;
    if (tags.includes(tag)) {
      setMessage(\`"\${tag}" is already added\`);
      return;
    }
    if (tags.length >= max) {
      setMessage(\`At most \${max} tags\`);
      return;
    }
    setMessage('');
    commit([...tags, tag]);
  };

  return (
    <div className="tag-editor">
      <TextField label="New tag" name="new-tag" value={draft} onChange={setDraft} onEnter={add} />
      <p data-testid="tag-count">{pluralize(tags.length, 'tag')}</p>
      {message ? (
        <p className="tag-message" data-testid="tag-message">
          {message}
        </p>
      ) : null}
      <ul aria-label={label}>
        {tags.map((tag) => (
          <li key={tag} data-testid="tag">
            <span>{tag}</span>
            <button
              type="button"
              aria-label={\`Remove \${tag}\`}
              onClick={() => {
                setMessage('');
                commit(tags.filter((t) => t !== tag));
              }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <Button variant="ghost" disabled={tags.length === 0} onClick={() => commit([])}>
        Clear all
      </Button>
    </div>
  );
}
`;

  files[`${root}/${d.wizard}/${n.wizard}.tsx`] = `import { useState } from 'react';
import { Button, SelectField, TextField, validateField } from '@bench/shared-ui';
import { TagEditor } from '../${kebab(n.tags)}/${n.tags}';
import { ${domain.key.toUpperCase()}_CATEGORIES } from '../types';

export interface ${n.wizard}Result {
  name: string;
  category: string;
  tags: string[];
}

const STEPS = ['Details', 'Tags', 'Review'] as const;

export function ${n.wizard}({ onComplete }: { onComplete: (result: ${n.wizard}Result) => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ name?: string; category?: string }>({});
  const [done, setDone] = useState(false);

  const next = () => {
    if (step === 0) {
      const nextErrors = {
        name: validateField(name, { label: 'Name', required: true, minLength: 3 }),
        category: validateField(category, { label: 'Category', required: true }),
      };
      setErrors(nextErrors);
      if (nextErrors.name || nextErrors.category) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  if (done) {
    return <p role="status">Created {name}</p>;
  }

  return (
    <section className="wizard" aria-label=${JSON.stringify(`New ${domain.entity.toLowerCase()}`)}>
      <h2 data-testid="wizard-step">
        Step {step + 1} of {STEPS.length}: {STEPS[step]}
      </h2>
      {step === 0 ? (
        <>
          <TextField label="Name" name="wizard-name" value={name} error={errors.name} onChange={setName} />
          <SelectField label="Category" name="wizard-category" options={${domain.key.toUpperCase()}_CATEGORIES} value={category} error={errors.category} onChange={setCategory} />
        </>
      ) : null}
      {step === 1 ? <TagEditor initial={tags} onChange={setTags} /> : null}
      {step === 2 ? (
        <dl>
          <dt>Name</dt>
          <dd data-testid="review-name">{name}</dd>
          <dt>Category</dt>
          <dd data-testid="review-category">{category}</dd>
          <dt>Tags</dt>
          <dd data-testid="review-tags">{tags.length ? tags.join(', ') : 'None'}</dd>
        </dl>
      ) : null}
      <div className="wizard-actions">
        <Button variant="secondary" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={next}>Next</Button>
        ) : (
          <Button
            onClick={() => {
              onComplete({ name, category, tags });
              setDone(true);
            }}
          >
            Create ${domain.entity.toLowerCase()}
          </Button>
        )}
      </div>
    </section>
  );
}
`;

  files[`${root}/${d.board}/${n.board}.tsx`] = `import { useMemo, useState } from 'react';
import { Button, TextField } from '@bench/shared-ui';

export type CardStatus = 'todo' | 'doing' | 'done';

export interface BoardCard {
  id: number;
  title: string;
  status: CardStatus;
}

const COLUMNS: { status: CardStatus; label: string }[] = [
  { status: 'todo', label: 'To do' },
  { status: 'doing', label: 'In progress' },
  { status: 'done', label: 'Done' },
];

const MOVES: Record<CardStatus, { verb: string; to: CardStatus }[]> = {
  todo: [{ verb: 'Start', to: 'doing' }],
  doing: [
    { verb: 'Finish', to: 'done' },
    { verb: 'Pause', to: 'todo' },
  ],
  done: [{ verb: 'Reopen', to: 'todo' }],
};

export function ${n.board}({ initial = [] }: { initial?: BoardCard[] }) {
  const [cards, setCards] = useState<BoardCard[]>(initial);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState('');

  const add = () => {
    const title = draft.trim();
    setDraft('');
    if (!title) return;
    if (cards.some((c) => c.title.toLowerCase() === title.toLowerCase())) {
      setMessage(\`"\${title}" already exists\`);
      return;
    }
    setMessage('');
    setCards((prev) => [...prev, { id: (prev.at(-1)?.id ?? 0) + 1, title, status: 'todo' }]);
  };

  const move = (id: number, to: CardStatus) => setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status: to } : c)));
  const remove = (id: number) => setCards((prev) => prev.filter((c) => c.id !== id));

  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return q ? cards.filter((c) => c.title.toLowerCase().includes(q)) : cards;
  }, [cards, filter]);
  const doneCount = cards.filter((c) => c.status === 'done').length;

  return (
    <section className="board" aria-label=${JSON.stringify(`${domain.entity} board`)}>
      <TextField label="New card" name="new-card" value={draft} onChange={setDraft} onEnter={add} />
      <TextField label="Filter cards" name="card-filter" type="search" value={filter} onChange={setFilter} />
      {message ? <p data-testid="board-message">{message}</p> : null}
      <p data-testid="board-summary">
        {doneCount} of {cards.length} done
      </p>
      <div className="board-columns">
        {COLUMNS.map((col) => {
          const items = visible.filter((c) => c.status === col.status);
          return (
            <div key={col.status} className="board-column" data-testid={\`column-\${col.status}\`}${touched ? ' role="region" aria-label={col.label}' : ''}>
              <h3>
                {col.label} ({items.length})
              </h3>
              <ul>
                {items.map((card) => (
                  <li key={card.id} data-testid="card">
                    <span>{card.title}</span>
                    {MOVES[card.status].map((m) => (
                      <Button key={m.verb} variant="secondary" aria-label={\`\${m.verb} \${card.title}\`} onClick={() => move(card.id, m.to)}>
                        {m.verb}
                      </Button>
                    ))}
                    <Button variant="danger" aria-label={\`Delete \${card.title}\`} onClick={() => remove(card.id)}>
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
`;

  files[`${root}/src/index.ts`] = `export * from './lib/types';
export * from './${d.table.slice(4)}/${n.table}';
export * from './${d.form.slice(4)}/${n.form}';
export * from './${d.tags.slice(4)}/${n.tags}';
export * from './${d.wizard.slice(4)}/${n.wizard}';
export * from './${d.board.slice(4)}/${n.board}';
`;
  return files;
}
