import { useState } from 'react';
import { Button, SelectField, TextField, validateField } from '@bench/shared-ui';
import { TagEditor } from '../tag-editor/TagEditor';
import { PRODUCT_CATEGORIES } from '../types';

export interface ProductWizardResult {
  name: string;
  category: string;
  tags: string[];
}

const STEPS = ['Details', 'Tags', 'Review'] as const;

export function ProductWizard({ onComplete }: { onComplete: (result: ProductWizardResult) => void }) {
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
    <section className="wizard" aria-label="New product">
      <h2 data-testid="wizard-step">
        Step {step + 1} of {STEPS.length}: {STEPS[step]}
      </h2>
      {step === 0 ? (
        <>
          <TextField label="Name" name="wizard-name" value={name} error={errors.name} onChange={setName} />
          <SelectField label="Category" name="wizard-category" options={PRODUCT_CATEGORIES} value={category} error={errors.category} onChange={setCategory} />
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
            Create product
          </Button>
        )}
      </div>
    </section>
  );
}
