import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0351', name: 'Clearance Contest', category: 'Social', amount: 537069 },
  { id: 'CMP-0352', name: 'Holiday Digest', category: 'Social', amount: 982042 },
  { id: 'CMP-0353', name: 'Retargeting Promo', category: 'Email', amount: 466435 },
  { id: 'CMP-0354', name: 'Launch Survey', category: 'Display', amount: 807303 },
  { id: 'CMP-0355', name: 'Autumn Newsletter', category: 'Social', amount: 998926 },
  { id: 'CMP-0356', name: 'Autumn Survey', category: 'Event', amount: 224860 },
  { id: 'CMP-0357', name: 'Launch Webinar', category: 'Event', amount: 355926 },
  { id: 'CMP-0358', name: 'Launch Digest', category: 'Search', amount: 512807 },
  { id: 'CMP-0359', name: 'Summer Teaser', category: 'Search', amount: 651620 },
  { id: 'CMP-0360', name: 'Spring Giveaway', category: 'Display', amount: 902448 },
  { id: 'CMP-0361', name: 'Retargeting Bundle', category: 'Social', amount: 136671 },
  { id: 'CMP-0362', name: 'Winter Digest', category: 'Search', amount: 105549 },
  { id: 'CMP-0363', name: 'Retargeting Teaser', category: 'Email', amount: 855316 },
  { id: 'CMP-0364', name: 'Summer Survey', category: 'Email', amount: 313921 },
  { id: 'CMP-0365', name: 'Launch Teaser', category: 'Search', amount: 268821 },
  { id: 'CMP-0366', name: 'Retargeting Teaser', category: 'Display', amount: 825590 },
  { id: 'CMP-0367', name: 'Launch Survey', category: 'Event', amount: 387928 },
  { id: 'CMP-0368', name: 'Loyalty Preview', category: 'Display', amount: 401975 },
];

describe('CampaignTable pagination', () => {
  it('filters, sorts and pages through 18 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0351');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0351');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0368');
    await user.clear(filter);
    await user.type(filter, 'display');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
  });
});
