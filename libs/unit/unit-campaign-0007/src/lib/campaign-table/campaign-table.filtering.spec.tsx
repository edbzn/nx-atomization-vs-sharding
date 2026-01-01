import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0204', name: 'Spring Preview', category: 'Event', amount: 94888 },
  { id: 'CMP-0205', name: 'Retargeting Contest', category: 'Email', amount: 501946 },
  { id: 'CMP-0206', name: 'Launch Webinar', category: 'Social', amount: 769329 },
  { id: 'CMP-0207', name: 'Holiday Contest', category: 'Social', amount: 271980 },
  { id: 'CMP-0208', name: 'Referral Promo', category: 'Event', amount: 339119 },
  { id: 'CMP-0209', name: 'Holiday Newsletter', category: 'Search', amount: 431765 },
  { id: 'CMP-0210', name: 'Launch Contest', category: 'Event', amount: 754567 },
  { id: 'CMP-0211', name: 'Autumn Newsletter', category: 'Email', amount: 983240 },
  { id: 'CMP-0212', name: 'Winter Survey', category: 'Search', amount: 840192 },
  { id: 'CMP-0213', name: 'Loyalty Promo', category: 'Social', amount: 435384 },
  { id: 'CMP-0214', name: 'Autumn Newsletter', category: 'Display', amount: 988089 },
  { id: 'CMP-0215', name: 'Spring Teaser', category: 'Social', amount: 199145 },
  { id: 'CMP-0216', name: 'Winter Teaser', category: 'Search', amount: 223957 },
  { id: 'CMP-0217', name: 'Holiday Survey', category: 'Search', amount: 22426 },
  { id: 'CMP-0218', name: 'Clearance Bundle', category: 'Search', amount: 669898 },
  { id: 'CMP-0219', name: 'Loyalty Teaser', category: 'Display', amount: 795431 },
  { id: 'CMP-0220', name: 'Retargeting Bundle', category: 'Search', amount: 540419 },
  { id: 'CMP-0221', name: 'Holiday Contest', category: 'Display', amount: 261906 },
  { id: 'CMP-0222', name: 'Loyalty Giveaway', category: 'Email', amount: 562121 },
];

describe('CampaignTable filtering', () => {
  it('filters, sorts and pages through 19 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0214');
    await user.clear(filter);
    await user.type(filter, 'Ret');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0204');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0204');
  });
});
