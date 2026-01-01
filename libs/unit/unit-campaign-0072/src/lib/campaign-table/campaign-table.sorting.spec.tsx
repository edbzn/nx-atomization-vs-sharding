import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0058', name: 'Spring Giveaway', category: 'Display', amount: 294513 },
  { id: 'CMP-0059', name: 'Launch Bundle', category: 'Display', amount: 124652 },
  { id: 'CMP-0060', name: 'Autumn Survey', category: 'Email', amount: 592110 },
  { id: 'CMP-0061', name: 'Referral Bundle', category: 'Social', amount: 1129 },
  { id: 'CMP-0062', name: 'Winter Promo', category: 'Social', amount: 271419 },
  { id: 'CMP-0063', name: 'Winter Teaser', category: 'Event', amount: 831871 },
  { id: 'CMP-0064', name: 'Autumn Newsletter', category: 'Social', amount: 7077 },
  { id: 'CMP-0065', name: 'Winter Teaser', category: 'Search', amount: 889279 },
  { id: 'CMP-0066', name: 'Referral Webinar', category: 'Display', amount: 133389 },
  { id: 'CMP-0067', name: 'Clearance Bundle', category: 'Search', amount: 180458 },
  { id: 'CMP-0068', name: 'Referral Promo', category: 'Email', amount: 849692 },
  { id: 'CMP-0069', name: 'Holiday Giveaway', category: 'Event', amount: 101911 },
  { id: 'CMP-0070', name: 'Loyalty Survey', category: 'Event', amount: 186760 },
  { id: 'CMP-0071', name: 'Spring Webinar', category: 'Search', amount: 181272 },
  { id: 'CMP-0072', name: 'Summer Webinar', category: 'Social', amount: 389057 },
  { id: 'CMP-0073', name: 'Retargeting Webinar', category: 'Social', amount: 686145 },
];

describe('CampaignTable sorting', () => {
  it('filters, sorts and pages through 16 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0058');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0064');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0064');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0063');
    await user.clear(filter);
    await user.type(filter, 'Hol');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0063');
    await user.clear(filter);
    await user.type(filter, 'search');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    await user.type(filter, 'cmp-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'Holid');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'cmp-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'search');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0063');
  });
});
