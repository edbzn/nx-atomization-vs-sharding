import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RecipeWizard } from './RecipeWizard';

describe('RecipeWizard navigation', () => {
  it('creates a recipe in three steps with 3 tags', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<RecipeWizard onComplete={onComplete} />);
    const step = () => screen.getByTestId('wizard-step').textContent;
    expect(step()).toBe('Step 1 of 3: Details');
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Lena Lemmens');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Side');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(step()).toBe('Step 2 of 3: Tags');
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'fern sable{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'quartz sage{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('2 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(2);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'frost summit{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('3 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(3);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('review-name').textContent).toBe('Lena Lemmens');
    expect(screen.getByTestId('review-category').textContent).toBe('Side');
    expect(screen.getByTestId('review-tags').textContent).toBe('fern-sable, quartz-sage, frost-summit');
    await user.click(screen.getByRole('button', { name: 'Create recipe' }));
    expect(onComplete).toHaveBeenCalledExactlyOnceWith({"name":"Lena Lemmens","category":"Side","tags":["fern-sable","quartz-sage","frost-summit"]});
    expect(screen.getByRole('status')).toHaveTextContent('Created Lena Lemmens');
  });
});
