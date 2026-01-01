import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0265', name: 'Spring Newsletter', category: 'Display', amount: 966499 },
  { id: 'CMP-0266', name: 'Holiday Survey', category: 'Social', amount: 935592 },
  { id: 'CMP-0267', name: 'Spring Giveaway', category: 'Event', amount: 99936 },
  { id: 'CMP-0268', name: 'Summer Teaser', category: 'Event', amount: 208330 },
  { id: 'CMP-0269', name: 'Launch Digest', category: 'Social', amount: 969296 },
  { id: 'CMP-0270', name: 'Holiday Promo', category: 'Email', amount: 52375 },
  { id: 'CMP-0271', name: 'Spring Giveaway', category: 'Display', amount: 559718 },
  { id: 'CMP-0272', name: 'Launch Giveaway', category: 'Search', amount: 871846 },
  { id: 'CMP-0273', name: 'Spring Webinar', category: 'Social', amount: 658895 },
  { id: 'CMP-0274', name: 'Holiday Contest', category: 'Display', amount: 982141 },
  { id: 'CMP-0275', name: 'Loyalty Newsletter', category: 'Social', amount: 857462 },
  { id: 'CMP-0276', name: 'Holiday Newsletter', category: 'Search', amount: 842958 },
  { id: 'CMP-0277', name: 'Winter Contest', category: 'Social', amount: 432264 },
  { id: 'CMP-0278', name: 'Referral Teaser', category: 'Display', amount: 976936 },
  { id: 'CMP-0279', name: 'Retargeting Webinar', category: 'Social', amount: 879642 },
  { id: 'CMP-0280', name: 'Launch Newsletter', category: 'Email', amount: 278202 },
  { id: 'CMP-0281', name: 'Clearance Newsletter', category: 'Search', amount: 620537 },
  { id: 'CMP-0282', name: 'Referral Digest', category: 'Email', amount: 381166 },
];

describe('CampaignTable filtering', () => {
  it('filters, sorts and pages through 18 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'bun');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'webina');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    await user.type(filter, 'Wint');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0265');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0265');
    await user.clear(filter);
    await user.type(filter, 'cmp-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0275');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0265');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0265');
  });
});
