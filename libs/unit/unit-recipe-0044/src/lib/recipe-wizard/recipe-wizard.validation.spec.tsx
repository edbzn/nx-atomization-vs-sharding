import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RecipeWizard } from './RecipeWizard';

describe('RecipeWizard validation', () => {
  it('creates a recipe in three steps with 1 tags', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<RecipeWizard onComplete={onComplete} />);
    const step = () => screen.getByTestId('wizard-step').textContent;
    expect(step()).toBe('Step 1 of 3: Details');
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Bea Verhoeven');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Side');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(step()).toBe('Step 2 of 3: Tags');
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'PINE{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'PINE{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.getByTestId('tag-message').textContent).toBe('"pine" is already added');
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Bea Verhoeven');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('review-name').textContent).toBe('Bea Verhoeven');
    expect(screen.getByTestId('review-category').textContent).toBe('Side');
    expect(screen.getByTestId('review-tags').textContent).toBe('pine');
    await user.click(screen.getByRole('button', { name: 'Create recipe' }));
    expect(onComplete).toHaveBeenCalledExactlyOnceWith({"name":"Bea Verhoeven","category":"Side","tags":["pine"]});
    expect(screen.getByRole('status')).toHaveTextContent('Created Bea Verhoeven');
  });
});
