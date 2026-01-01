import { useCallback, useState } from 'react';

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
  if (rule.required && value.length === 0) return `${rule.label} is required`;
  if (value.length === 0) return undefined;
  if (rule.minLength !== undefined && value.length < rule.minLength) {
    return `${rule.label} must be at least ${rule.minLength} characters`;
  }
  if (rule.maxLength !== undefined && value.length > rule.maxLength) {
    return `${rule.label} must be at most ${rule.maxLength} characters`;
  }
  if (rule.pattern && !rule.pattern.test(value)) return rule.patternMessage ?? `${rule.label} is invalid`;
  if (rule.min !== undefined || rule.max !== undefined) {
    const n = Number(value);
    if (Number.isNaN(n) || (rule.min !== undefined && n < rule.min) || (rule.max !== undefined && n > rule.max)) {
      return `${rule.label} must be between ${rule.min ?? '-inf'} and ${rule.max ?? 'inf'}`;
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
