import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmployeeWizard } from './EmployeeWizard';

describe('EmployeeWizard tags step', () => {
  it('creates a employee in three steps with 1 tags', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<EmployeeWizard onComplete={onComplete} />);
    const step = () => screen.getByTestId('wizard-step').textContent;
    expect(step()).toBe('Step 1 of 3: Details');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Category is required')).toBeInTheDocument();
    expect(step()).toBe('Step 1 of 3: Details');
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Pia Coppens');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Engineering');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(step()).toBe('Step 2 of 3: Tags');
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'lumen alpha{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Pia Coppens');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('review-name').textContent).toBe('Pia Coppens');
    expect(screen.getByTestId('review-category').textContent).toBe('Engineering');
    expect(screen.getByTestId('review-tags').textContent).toBe('lumen-alpha');
    await user.click(screen.getByRole('button', { name: 'Create employee' }));
    expect(onComplete).toHaveBeenCalledExactlyOnceWith({"name":"Pia Coppens","category":"Engineering","tags":["lumen-alpha"]});
    expect(screen.getByRole('status')).toHaveTextContent('Created Pia Coppens');
  });
});
