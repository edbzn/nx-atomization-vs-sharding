import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0202', name: 'Autumn Preview', category: 'Email', amount: 886998 },
  { id: 'CMP-0203', name: 'Summer Teaser', category: 'Display', amount: 708054 },
  { id: 'CMP-0204', name: 'Summer Bundle', category: 'Event', amount: 810526 },
  { id: 'CMP-0205', name: 'Launch Bundle', category: 'Display', amount: 374603 },
  { id: 'CMP-0206', name: 'Winter Newsletter', category: 'Event', amount: 779895 },
  { id: 'CMP-0207', name: 'Clearance Contest', category: 'Display', amount: 165809 },
  { id: 'CMP-0208', name: 'Holiday Giveaway', category: 'Email', amount: 353396 },
  { id: 'CMP-0209', name: 'Retargeting Promo', category: 'Email', amount: 467777 },
  { id: 'CMP-0210', name: 'Autumn Teaser', category: 'Event', amount: 191996 },
  { id: 'CMP-0211', name: 'Referral Giveaway', category: 'Event', amount: 522871 },
  { id: 'CMP-0212', name: 'Holiday Preview', category: 'Search', amount: 506243 },
  { id: 'CMP-0213', name: 'Clearance Webinar', category: 'Email', amount: 433864 },
  { id: 'CMP-0214', name: 'Winter Preview', category: 'Email', amount: 557421 },
  { id: 'CMP-0215', name: 'Autumn Promo', category: 'Search', amount: 637033 },
  { id: 'CMP-0216', name: 'Retargeting Newsletter', category: 'Search', amount: 988002 },
  { id: 'CMP-0217', name: 'Loyalty Survey', category: 'Email', amount: 692494 },
  { id: 'CMP-0218', name: 'Referral Teaser', category: 'Email', amount: 87497 },
  { id: 'CMP-0219', name: 'Launch Survey', category: 'Display', amount: 836027 },
  { id: 'CMP-0220', name: 'Launch Promo', category: 'Social', amount: 97247 },
  { id: 'CMP-0221', name: 'Holiday Survey', category: 'Social', amount: 620689 },
];

describe('CampaignTable sorting', () => {
  it('filters, sorts and pages through 20 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'news');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0202');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0202');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0202');
    await user.clear(filter);
    await user.type(filter, 'prev');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0202');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0202');
  });

  it('filters, sorts and pages through 20 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0202');
    await user.clear(filter);
    await user.type(filter, 'Refer');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
  });
});
