import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { VehicleWizard } from './VehicleWizard';

describe('VehicleWizard happy path', () => {
  it('creates a vehicle in three steps with 1 tags', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<VehicleWizard onComplete={onComplete} />);
    const step = () => screen.getByTestId('wizard-step').textContent;
    expect(step()).toBe('Step 1 of 3: Details');
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Victor Claessens');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Scooter');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(step()).toBe('Step 2 of 3: Tags');
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'indigo{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('review-name').textContent).toBe('Victor Claessens');
    expect(screen.getByTestId('review-category').textContent).toBe('Scooter');
    expect(screen.getByTestId('review-tags').textContent).toBe('indigo');
    await user.click(screen.getByRole('button', { name: 'Create vehicle' }));
    expect(onComplete).toHaveBeenCalledExactlyOnceWith({"name":"Victor Claessens","category":"Scooter","tags":["indigo"]});
    expect(screen.getByRole('status')).toHaveTextContent('Created Victor Claessens');
  });
});
