import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0382', name: 'Launch Newsletter', category: 'Event', amount: 641754 },
  { id: 'CMP-0383', name: 'Spring Survey', category: 'Email', amount: 779986 },
  { id: 'CMP-0384', name: 'Launch Promo', category: 'Display', amount: 849271 },
  { id: 'CMP-0385', name: 'Winter Digest', category: 'Display', amount: 921128 },
  { id: 'CMP-0386', name: 'Referral Digest', category: 'Search', amount: 939140 },
  { id: 'CMP-0387', name: 'Winter Preview', category: 'Display', amount: 449699 },
  { id: 'CMP-0388', name: 'Loyalty Survey', category: 'Event', amount: 852538 },
  { id: 'CMP-0389', name: 'Launch Contest', category: 'Social', amount: 979987 },
  { id: 'CMP-0390', name: 'Retargeting Promo', category: 'Email', amount: 260033 },
  { id: 'CMP-0391', name: 'Launch Bundle', category: 'Search', amount: 314556 },
  { id: 'CMP-0392', name: 'Autumn Promo', category: 'Social', amount: 805946 },
  { id: 'CMP-0393', name: 'Spring Newsletter', category: 'Display', amount: 780563 },
  { id: 'CMP-0394', name: 'Summer Webinar', category: 'Email', amount: 863545 },
  { id: 'CMP-0395', name: 'Winter Giveaway', category: 'Event', amount: 591059 },
  { id: 'CMP-0396', name: 'Referral Survey', category: 'Search', amount: 851587 },
];

describe('CampaignTable filtering', () => {
  it('filters, sorts and pages through 15 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0392');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0382');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0392');
    await user.clear(filter);
    await user.type(filter, 'search');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
  });
});
