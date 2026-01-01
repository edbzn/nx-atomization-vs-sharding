import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AssetWizard } from './AssetWizard';

describe('AssetWizard validation', () => {
  it('creates a asset in three steps with 1 tags', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<AssetWizard onComplete={onComplete} />);
    const step = () => screen.getByTestId('wizard-step').textContent;
    expect(step()).toBe('Step 1 of 3: Details');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Category is required')).toBeInTheDocument();
    expect(step()).toBe('Step 1 of 3: Details');
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Tom Hendrickx');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Phone');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(step()).toBe('Step 2 of 3: Tags');
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'delta{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('review-name').textContent).toBe('Tom Hendrickx');
    expect(screen.getByTestId('review-category').textContent).toBe('Phone');
    expect(screen.getByTestId('review-tags').textContent).toBe('delta');
    await user.click(screen.getByRole('button', { name: 'Create asset' }));
    expect(onComplete).toHaveBeenCalledExactlyOnceWith({"name":"Tom Hendrickx","category":"Phone","tags":["delta"]});
    expect(screen.getByRole('status')).toHaveTextContent('Created Tom Hendrickx');
  });
});
