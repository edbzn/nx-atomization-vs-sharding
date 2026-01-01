import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { VehicleWizard } from './VehicleWizard';

describe('VehicleWizard tags step', () => {
  it('creates a vehicle in three steps with 1 tags', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<VehicleWizard onComplete={onComplete} />);
    const step = () => screen.getByTestId('wizard-step').textContent;
    expect(step()).toBe('Step 1 of 3: Details');
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Al');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Name must be at least 3 characters')).toBeInTheDocument();
    expect(screen.getByText('Category is required')).toBeInTheDocument();
    expect(step()).toBe('Step 1 of 3: Details');
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Cas Van Damme');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Sedan');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(step()).toBe('Step 2 of 3: Tags');
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'tide{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('review-name').textContent).toBe('Cas Van Damme');
    expect(screen.getByTestId('review-category').textContent).toBe('Sedan');
    expect(screen.getByTestId('review-tags').textContent).toBe('tide');
    await user.click(screen.getByRole('button', { name: 'Create vehicle' }));
    expect(onComplete).toHaveBeenCalledExactlyOnceWith({"name":"Cas Van Damme","category":"Sedan","tags":["tide"]});
    expect(screen.getByRole('status')).toHaveTextContent('Created Cas Van Damme');
  });
});
