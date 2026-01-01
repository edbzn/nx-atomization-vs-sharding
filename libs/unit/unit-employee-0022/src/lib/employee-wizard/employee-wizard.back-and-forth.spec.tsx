import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmployeeWizard } from './EmployeeWizard';

describe('EmployeeWizard back and forth', () => {
  it('creates a employee in three steps with 1 tags', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<EmployeeWizard onComplete={onComplete} />);
    const step = () => screen.getByTestId('wizard-step').textContent;
    expect(step()).toBe('Step 1 of 3: Details');
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Al');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Name must be at least 3 characters')).toBeInTheDocument();
    expect(screen.getByText('Category is required')).toBeInTheDocument();
    expect(step()).toBe('Step 1 of 3: Details');
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Cleo Hermans');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Legal');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(step()).toBe('Step 2 of 3: Tags');
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'juniper onyx{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('review-name').textContent).toBe('Cleo Hermans');
    expect(screen.getByTestId('review-category').textContent).toBe('Legal');
    expect(screen.getByTestId('review-tags').textContent).toBe('juniper-onyx');
    await user.click(screen.getByRole('button', { name: 'Create employee' }));
    expect(onComplete).toHaveBeenCalledExactlyOnceWith({"name":"Cleo Hermans","category":"Legal","tags":["juniper-onyx"]});
    expect(screen.getByRole('status')).toHaveTextContent('Created Cleo Hermans');
  });
});
