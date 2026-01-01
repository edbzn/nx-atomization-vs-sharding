import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0113', name: 'Holiday Digest', category: 'Display', amount: 412849 },
  { id: 'CMP-0114', name: 'Referral Promo', category: 'Display', amount: 678188 },
  { id: 'CMP-0115', name: 'Retargeting Digest', category: 'Search', amount: 398027 },
  { id: 'CMP-0116', name: 'Launch Bundle', category: 'Display', amount: 434743 },
  { id: 'CMP-0117', name: 'Autumn Promo', category: 'Social', amount: 98102 },
  { id: 'CMP-0118', name: 'Winter Survey', category: 'Display', amount: 264425 },
  { id: 'CMP-0119', name: 'Spring Bundle', category: 'Search', amount: 904305 },
  { id: 'CMP-0120', name: 'Summer Teaser', category: 'Email', amount: 736655 },
  { id: 'CMP-0121', name: 'Clearance Contest', category: 'Search', amount: 965428 },
  { id: 'CMP-0122', name: 'Autumn Bundle', category: 'Social', amount: 803793 },
  { id: 'CMP-0123', name: 'Spring Bundle', category: 'Event', amount: 735462 },
  { id: 'CMP-0124', name: 'Retargeting Survey', category: 'Social', amount: 441023 },
  { id: 'CMP-0125', name: 'Winter Webinar', category: 'Display', amount: 167437 },
  { id: 'CMP-0126', name: 'Clearance Preview', category: 'Search', amount: 222912 },
  { id: 'CMP-0127', name: 'Autumn Promo', category: 'Display', amount: 183956 },
  { id: 'CMP-0128', name: 'Holiday Digest', category: 'Event', amount: 832950 },
];

describe('CampaignTable filtering', () => {
  it('filters, sorts and pages through 16 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'social');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0113');
    await user.clear(filter);
    await user.type(filter, 'CMP-0123');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0113');
  });
});
