import { Button, SelectField, TextArea, TextField, pluralize, useForm, type FormRules } from '@bench/shared-ui';
import { RECIPE_CATEGORIES } from '../types';

export interface RecipeFormValues extends Record<string, unknown> {
  name: string;
  email: string;
  category: string;
  amount: string;
  notes: string;
}

export interface RecipeFormResult {
  name: string;
  email: string;
  category: string;
  amount: number;
  notes: string;
}

const rules: FormRules<RecipeFormValues> = {
  name: { label: 'Name', required: true, minLength: 3, maxLength: 60 },
  email: { label: 'Email', required: true, pattern: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i, patternMessage: 'Enter a valid email address' },
  category: { label: 'Category', required: true },
  amount: { label: 'Amount', required: true, min: 1, max: 100000 },
  notes: { label: 'Notes', maxLength: 200 },
};

const empty: RecipeFormValues = { name: '', email: '', category: '', amount: '', notes: '' };

export function RecipeForm({ onSubmit, initial = empty }: { onSubmit: (value: RecipeFormResult) => void; initial?: RecipeFormValues }) {
  const { values, errors, setValue, handleSubmit } = useForm<RecipeFormValues>(initial, rules);
  const errorCount = Object.keys(errors).length;
  return (
    <form
      aria-label="Recipe form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit((v) => onSubmit({ ...v, amount: Number(v.amount) }));
      }}
    >
      <TextField label="Name" name="name" value={values.name} error={errors.name} onChange={(v) => setValue('name', v)} />
      <TextField label="Email" name="email" type="email" value={values.email} error={errors.email} onChange={(v) => setValue('email', v)} />
      <SelectField label="Category" name="category" options={RECIPE_CATEGORIES} value={values.category} error={errors.category} onChange={(v) => setValue('category', v)} />
      <TextField label="Amount" name="amount" hint="Between 1 and 100000" value={values.amount} error={errors.amount} onChange={(v) => setValue('amount', v)} />
      <TextArea label="Notes" name="notes" maxLength={200} value={values.notes} error={errors.notes} onChange={(v) => setValue('notes', v)} />
      {errorCount > 0 ? (
        <p role="status" data-testid="error-summary">
          {pluralize(errorCount, 'error')}
        </p>
      ) : null}
      <Button type="submit">Save recipe</Button>
    </form>
  );
}
