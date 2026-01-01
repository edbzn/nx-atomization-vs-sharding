import { useId, type ChangeEvent, type KeyboardEvent } from 'react';

interface BaseFieldProps {
  label: string;
  error?: string;
  hint?: string;
}

function FieldMessages({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  return (
    <>
      {hint && !error ? (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field-error" role="alert" id={`${id}-error`}>
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
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
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
