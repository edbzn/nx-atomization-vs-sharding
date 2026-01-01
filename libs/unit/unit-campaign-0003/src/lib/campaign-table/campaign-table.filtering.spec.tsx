import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0211', name: 'Winter Survey', category: 'Search', amount: 358042 },
  { id: 'CMP-0212', name: 'Summer Bundle', category: 'Search', amount: 100043 },
  { id: 'CMP-0213', name: 'Holiday Teaser', category: 'Search', amount: 36398 },
  { id: 'CMP-0214', name: 'Referral Preview', category: 'Display', amount: 85404 },
  { id: 'CMP-0215', name: 'Retargeting Preview', category: 'Search', amount: 490495 },
  { id: 'CMP-0216', name: 'Loyalty Newsletter', category: 'Event', amount: 820890 },
  { id: 'CMP-0217', name: 'Referral Digest', category: 'Search', amount: 267629 },
  { id: 'CMP-0218', name: 'Autumn Giveaway', category: 'Event', amount: 900489 },
  { id: 'CMP-0219', name: 'Retargeting Bundle', category: 'Social', amount: 194908 },
  { id: 'CMP-0220', name: 'Spring Survey', category: 'Event', amount: 213778 },
  { id: 'CMP-0221', name: 'Launch Webinar', category: 'Email', amount: 557786 },
  { id: 'CMP-0222', name: 'Autumn Digest', category: 'Social', amount: 555205 },
  { id: 'CMP-0223', name: 'Loyalty Contest', category: 'Social', amount: 96362 },
  { id: 'CMP-0224', name: 'Spring Preview', category: 'Search', amount: 339582 },
  { id: 'CMP-0225', name: 'Holiday Preview', category: 'Search', amount: 792565 },
  { id: 'CMP-0226', name: 'Retargeting Promo', category: 'Event', amount: 777575 },
  { id: 'CMP-0227', name: 'Clearance Giveaway', category: 'Display', amount: 970262 },
  { id: 'CMP-0228', name: 'Winter Digest', category: 'Search', amount: 971719 },
  { id: 'CMP-0229', name: 'Holiday Preview', category: 'Email', amount: 943043 },
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0221');
    await user.clear(filter);
    await user.type(filter, 'prev');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0211');
    await user.clear(filter);
    await user.type(filter, 'cmp-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0211');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0211');
  });

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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0221');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0211');
  });
});
