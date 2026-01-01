import { useMemo, useState } from 'react';
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

export function EmployeeBoard({ initial = [] }: { initial?: BoardCard[] }) {
  const [cards, setCards] = useState<BoardCard[]>(initial);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState('');

  const add = () => {
    const title = draft.trim();
    setDraft('');
    if (!title) return;
    if (cards.some((c) => c.title.toLowerCase() === title.toLowerCase())) {
      setMessage(`"${title}" already exists`);
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
    <section className="board" aria-label="Employee board">
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
            <div key={col.status} className="board-column" data-testid={`column-${col.status}`}>
              <h3>
                {col.label} ({items.length})
              </h3>
              <ul>
                {items.map((card) => (
                  <li key={card.id} data-testid="card">
                    <span>{card.title}</span>
                    {MOVES[card.status].map((m) => (
                      <Button key={m.verb} variant="secondary" aria-label={`${m.verb} ${card.title}`} onClick={() => move(card.id, m.to)}>
                        {m.verb}
                      </Button>
                    ))}
                    <Button variant="danger" aria-label={`Delete ${card.title}`} onClick={() => remove(card.id)}>
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
