import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContractWizard } from './ContractWizard';

describe('ContractWizard back and forth', () => {
  it('creates a contract in three steps with 1 tags', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<ContractWizard onComplete={onComplete} />);
    const step = () => screen.getByTestId('wizard-step').textContent;
    expect(step()).toBe('Step 1 of 3: Details');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Category is required')).toBeInTheDocument();
    expect(step()).toBe('Step 1 of 3: Details');
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Arne Claessens');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Signed');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(step()).toBe('Step 2 of 3: Tags');
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'comet38{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Arne Claessens');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('review-name').textContent).toBe('Arne Claessens');
    expect(screen.getByTestId('review-category').textContent).toBe('Signed');
    expect(screen.getByTestId('review-tags').textContent).toBe('comet38');
    await user.click(screen.getByRole('button', { name: 'Create contract' }));
    expect(onComplete).toHaveBeenCalledExactlyOnceWith({"name":"Arne Claessens","category":"Signed","tags":["comet38"]});
    expect(screen.getByRole('status')).toHaveTextContent('Created Arne Claessens');
  });
});
