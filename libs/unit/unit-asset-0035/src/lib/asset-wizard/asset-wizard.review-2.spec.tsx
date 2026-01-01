import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AssetWizard } from './AssetWizard';

describe('AssetWizard review 2', () => {
  it('creates a asset in three steps with 1 tags', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<AssetWizard onComplete={onComplete} />);
    const step = () => screen.getByTestId('wizard-step').textContent;
    expect(step()).toBe('Step 1 of 3: Details');
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'New Echo');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Monitor');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(step()).toBe('Step 2 of 3: Tags');
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'sage fern{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('review-name').textContent).toBe('New Echo');
    expect(screen.getByTestId('review-category').textContent).toBe('Monitor');
    expect(screen.getByTestId('review-tags').textContent).toBe('sage-fern');
    await user.click(screen.getByRole('button', { name: 'Create asset' }));
    expect(onComplete).toHaveBeenCalledExactlyOnceWith({"name":"New Echo","category":"Monitor","tags":["sage-fern"]});
    expect(screen.getByRole('status')).toHaveTextContent('Created New Echo');
  });
});
