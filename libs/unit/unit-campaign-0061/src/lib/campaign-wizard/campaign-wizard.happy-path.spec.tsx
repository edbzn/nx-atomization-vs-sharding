import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CampaignWizard } from './CampaignWizard';

describe('CampaignWizard happy path', () => {
  it('creates a campaign in three steps with 1 tags', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<CampaignWizard onComplete={onComplete} />);
    const step = () => screen.getByTestId('wizard-step').textContent;
    expect(step()).toBe('Step 1 of 3: Details');
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Launch Teaser');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Event');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(step()).toBe('Step 2 of 3: Tags');
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'meadow river{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Launch Teaser');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('review-name').textContent).toBe('Launch Teaser');
    expect(screen.getByTestId('review-category').textContent).toBe('Event');
    expect(screen.getByTestId('review-tags').textContent).toBe('meadow-river');
    await user.click(screen.getByRole('button', { name: 'Create campaign' }));
    expect(onComplete).toHaveBeenCalledExactlyOnceWith({"name":"Launch Teaser","category":"Event","tags":["meadow-river"]});
    expect(screen.getByRole('status')).toHaveTextContent('Created Launch Teaser');
  });
});
