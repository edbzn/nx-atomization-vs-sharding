import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0344', name: 'Autumn Promo', category: 'Email', amount: 505852 },
  { id: 'CMP-0345', name: 'Summer Survey', category: 'Event', amount: 583906 },
  { id: 'CMP-0346', name: 'Clearance Preview', category: 'Social', amount: 715921 },
  { id: 'CMP-0347', name: 'Loyalty Promo', category: 'Search', amount: 579129 },
  { id: 'CMP-0348', name: 'Winter Newsletter', category: 'Social', amount: 979386 },
  { id: 'CMP-0349', name: 'Winter Webinar', category: 'Social', amount: 577734 },
  { id: 'CMP-0350', name: 'Summer Teaser', category: 'Social', amount: 885060 },
  { id: 'CMP-0351', name: 'Autumn Survey', category: 'Email', amount: 228601 },
  { id: 'CMP-0352', name: 'Summer Preview', category: 'Email', amount: 589136 },
  { id: 'CMP-0353', name: 'Holiday Newsletter', category: 'Search', amount: 170258 },
  { id: 'CMP-0354', name: 'Referral Survey', category: 'Search', amount: 379182 },
  { id: 'CMP-0355', name: 'Referral Giveaway', category: 'Event', amount: 356486 },
  { id: 'CMP-0356', name: 'Launch Teaser', category: 'Email', amount: 370047 },
  { id: 'CMP-0357', name: 'Spring Webinar', category: 'Search', amount: 547784 },
  { id: 'CMP-0358', name: 'Referral Newsletter', category: 'Event', amount: 840567 },
  { id: 'CMP-0359', name: 'Retargeting Giveaway', category: 'Search', amount: 880176 },
];

describe('CampaignTable filtering', () => {
  it('filters, sorts and pages through 16 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0344');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0353');
    await user.clear(filter);
    await user.type(filter, 'event');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0353');
  });
});
