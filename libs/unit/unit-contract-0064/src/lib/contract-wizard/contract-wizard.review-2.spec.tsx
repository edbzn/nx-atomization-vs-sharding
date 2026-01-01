import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContractWizard } from './ContractWizard';

describe('ContractWizard review 2', () => {
  it('creates a contract in three steps with 1 tags', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<ContractWizard onComplete={onComplete} />);
    const step = () => screen.getByTestId('wizard-step').textContent;
    expect(step()).toBe('Step 1 of 3: Details');
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ruben De Smet');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Review');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(step()).toBe('Step 2 of 3: Tags');
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'juniper lagoon{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('review-name').textContent).toBe('Ruben De Smet');
    expect(screen.getByTestId('review-category').textContent).toBe('Review');
    expect(screen.getByTestId('review-tags').textContent).toBe('juniper-lagoon');
    await user.click(screen.getByRole('button', { name: 'Create contract' }));
    expect(onComplete).toHaveBeenCalledExactlyOnceWith({"name":"Ruben De Smet","category":"Review","tags":["juniper-lagoon"]});
    expect(screen.getByRole('status')).toHaveTextContent('Created Ruben De Smet');
  });
});
