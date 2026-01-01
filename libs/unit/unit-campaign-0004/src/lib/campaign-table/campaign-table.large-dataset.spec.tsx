import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0137', name: 'Summer Promo', category: 'Display', amount: 269052 },
  { id: 'CMP-0138', name: 'Clearance Contest', category: 'Social', amount: 727288 },
  { id: 'CMP-0139', name: 'Referral Contest', category: 'Email', amount: 411731 },
  { id: 'CMP-0140', name: 'Referral Preview', category: 'Social', amount: 379129 },
  { id: 'CMP-0141', name: 'Launch Promo', category: 'Event', amount: 745888 },
  { id: 'CMP-0142', name: 'Autumn Digest', category: 'Display', amount: 998430 },
  { id: 'CMP-0143', name: 'Autumn Teaser', category: 'Display', amount: 494560 },
  { id: 'CMP-0144', name: 'Retargeting Giveaway', category: 'Display', amount: 814958 },
  { id: 'CMP-0145', name: 'Clearance Preview', category: 'Display', amount: 951694 },
  { id: 'CMP-0146', name: 'Referral Bundle', category: 'Email', amount: 364738 },
  { id: 'CMP-0147', name: 'Autumn Survey', category: 'Search', amount: 568265 },
  { id: 'CMP-0148', name: 'Holiday Webinar', category: 'Event', amount: 185776 },
  { id: 'CMP-0149', name: 'Clearance Survey', category: 'Social', amount: 743040 },
  { id: 'CMP-0150', name: 'Autumn Bundle', category: 'Event', amount: 263595 },
  { id: 'CMP-0151', name: 'Holiday Teaser', category: 'Search', amount: 597361 },
  { id: 'CMP-0152', name: 'Holiday Promo', category: 'Display', amount: 850854 },
  { id: 'CMP-0153', name: 'Holiday Giveaway', category: 'Email', amount: 157952 },
  { id: 'CMP-0154', name: 'Referral Teaser', category: 'Search', amount: 18723 },
];

describe('CampaignTable large dataset', () => {
  it('filters, sorts and pages through 18 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0147');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0137');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0137');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0147');
  });

  it('filters, sorts and pages through 18 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0147');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0137');
    await user.clear(filter);
    await user.type(filter, 'Summ');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });
});
