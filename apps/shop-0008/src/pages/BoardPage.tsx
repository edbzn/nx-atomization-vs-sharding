import { useEffect, useMemo, useState } from 'react';
import { Button, TextField } from '@bench/shared-ui';
import { useDocumentTitle } from '../router';

type Status = 'todo' | 'doing' | 'done';
interface Card {
  id: number;
  title: string;
  status: Status;
}

const STORAGE_KEY = 'shop-0008.board';
const COLUMNS: { status: Status; label: string }[] = [
  { status: 'todo', label: 'To do' },
  { status: 'doing', label: 'In progress' },
  { status: 'done', label: 'Done' },
];
const NEXT: Record<Status, { verb: string; to: Status }> = {
  todo: { verb: 'Start', to: 'doing' },
  doing: { verb: 'Finish', to: 'done' },
  done: { verb: 'Reopen', to: 'todo' },
};

function load(): Card[] {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]') as Card[];
  } catch {
    return [];
  }
}

export function BoardPage() {
  useDocumentTitle('Board');
  const [cards, setCards] = useState<Card[]>(load);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('');
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);
  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return q ? cards.filter((c) => c.title.toLowerCase().includes(q)) : cards;
  }, [cards, filter]);
  const add = () => {
    const title = draft.trim();
    setDraft('');
    if (!title || cards.some((c) => c.title === title)) return;
    setCards((prev) => [...prev, { id: (prev.at(-1)?.id ?? 0) + 1, title, status: 'todo' }]);
  };
  return (
    <>
      <h1>Board</h1>
      <TextField label="New card" name="new-card" value={draft} onChange={setDraft} onEnter={add} />
      <TextField label="Filter cards" name="card-filter" type="search" value={filter} onChange={setFilter} />
      <p data-testid="board-summary">
        {cards.filter((c) => c.status === 'done').length} of {cards.length} done
      </p>
      <div className="board-columns">
        {COLUMNS.map((col) => {
          const items = visible.filter((c) => c.status === col.status);
          return (
            <section key={col.status} aria-label={col.label} data-testid={`column-${col.status}`}>
              <h2>
                {col.label} ({items.length})
              </h2>
              <ul>
                {items.map((c) => (
                  <li key={c.id} data-testid="card">
                    {c.title}
                    <Button variant="secondary" aria-label={`${NEXT[c.status].verb} ${c.title}`} onClick={() => setCards((prev) => prev.map((p) => (p.id === c.id ? { ...p, status: NEXT[c.status].to } : p)))}>
                      {NEXT[c.status].verb}
                    </Button>
                    <Button variant="danger" aria-label={`Delete ${c.title}`} onClick={() => setCards((prev) => prev.filter((p) => p.id !== c.id))}>
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
