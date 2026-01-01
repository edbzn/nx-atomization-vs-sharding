import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0260', name: 'Referral Digest', category: 'Display', amount: 330502 },
  { id: 'CMP-0261', name: 'Winter Survey', category: 'Search', amount: 636059 },
  { id: 'CMP-0262', name: 'Spring Preview', category: 'Email', amount: 122377 },
  { id: 'CMP-0263', name: 'Holiday Webinar', category: 'Display', amount: 130637 },
  { id: 'CMP-0264', name: 'Referral Digest', category: 'Email', amount: 592751 },
  { id: 'CMP-0265', name: 'Referral Contest', category: 'Email', amount: 295893 },
  { id: 'CMP-0266', name: 'Winter Promo', category: 'Event', amount: 398537 },
  { id: 'CMP-0267', name: 'Summer Digest', category: 'Display', amount: 908731 },
  { id: 'CMP-0268', name: 'Loyalty Survey', category: 'Search', amount: 386420 },
  { id: 'CMP-0269', name: 'Autumn Webinar', category: 'Search', amount: 319219 },
  { id: 'CMP-0270', name: 'Launch Newsletter', category: 'Event', amount: 258572 },
  { id: 'CMP-0271', name: 'Winter Promo', category: 'Social', amount: 612289 },
  { id: 'CMP-0272', name: 'Launch Giveaway', category: 'Social', amount: 548254 },
  { id: 'CMP-0273', name: 'Retargeting Newsletter', category: 'Search', amount: 8227 },
  { id: 'CMP-0274', name: 'Summer Teaser', category: 'Search', amount: 726220 },
  { id: 'CMP-0275', name: 'Retargeting Promo', category: 'Social', amount: 442265 },
  { id: 'CMP-0276', name: 'Winter Digest', category: 'Event', amount: 423387 },
  { id: 'CMP-0277', name: 'Loyalty Promo', category: 'Event', amount: 197710 },
  { id: 'CMP-0278', name: 'Autumn Bundle', category: 'Social', amount: 701618 },
];

describe('CampaignTable sorting', () => {
  it('filters, sorts and pages through 19 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0260');
    await user.clear(filter);
    await user.type(filter, 'Reta');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0260');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0278');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0278');
  });

  it('filters, sorts and pages through 19 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0273');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0278');
    await user.clear(filter);
    await user.type(filter, 'event');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0266');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0270');
  });
});
