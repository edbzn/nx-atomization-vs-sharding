import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0130', name: 'Winter Giveaway', category: 'Event', amount: 60301 },
  { id: 'CMP-0131', name: 'Winter Digest', category: 'Search', amount: 807674 },
  { id: 'CMP-0132', name: 'Launch Webinar', category: 'Social', amount: 90061 },
  { id: 'CMP-0133', name: 'Summer Bundle', category: 'Event', amount: 227877 },
  { id: 'CMP-0134', name: 'Referral Contest', category: 'Email', amount: 44921 },
  { id: 'CMP-0135', name: 'Summer Survey', category: 'Event', amount: 949587 },
  { id: 'CMP-0136', name: 'Summer Webinar', category: 'Display', amount: 95775 },
  { id: 'CMP-0137', name: 'Retargeting Newsletter', category: 'Social', amount: 209775 },
  { id: 'CMP-0138', name: 'Loyalty Giveaway', category: 'Event', amount: 531447 },
  { id: 'CMP-0139', name: 'Loyalty Newsletter', category: 'Event', amount: 175028 },
  { id: 'CMP-0140', name: 'Referral Teaser', category: 'Social', amount: 591707 },
  { id: 'CMP-0141', name: 'Launch Contest', category: 'Search', amount: 301110 },
];

describe('CampaignTable filtering', () => {
  it('filters, sorts and pages through 12 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-12 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0140');
    await user.clear(filter);
    await user.type(filter, 'Wint');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    await user.type(filter, 'news');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
  });
});
