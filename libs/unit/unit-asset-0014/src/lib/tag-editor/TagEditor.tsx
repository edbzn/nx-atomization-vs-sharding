import { useState } from 'react';
import { Button, TextField, pluralize } from '@bench/shared-ui';

export interface TagEditorProps {
  initial?: string[];
  max?: number;
  label?: string;
  onChange?: (tags: string[]) => void;
}

export function normalizeTag(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, '-');
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
      setMessage(`"${tag}" is already added`);
      return;
    }
    if (tags.length >= max) {
      setMessage(`At most ${max} tags`);
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
              aria-label={`Remove ${tag}`}
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
