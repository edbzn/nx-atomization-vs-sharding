import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0307', name: 'Summer Promo', category: 'Email', amount: 943952 },
  { id: 'CMP-0308', name: 'Loyalty Newsletter', category: 'Display', amount: 173628 },
  { id: 'CMP-0309', name: 'Spring Survey', category: 'Social', amount: 212830 },
  { id: 'CMP-0310', name: 'Winter Promo', category: 'Event', amount: 996440 },
  { id: 'CMP-0311', name: 'Autumn Promo', category: 'Email', amount: 194853 },
  { id: 'CMP-0312', name: 'Launch Webinar', category: 'Event', amount: 482902 },
  { id: 'CMP-0313', name: 'Winter Webinar', category: 'Display', amount: 922884 },
  { id: 'CMP-0314', name: 'Loyalty Promo', category: 'Email', amount: 178152 },
  { id: 'CMP-0315', name: 'Retargeting Survey', category: 'Email', amount: 876217 },
  { id: 'CMP-0316', name: 'Referral Contest', category: 'Event', amount: 952136 },
  { id: 'CMP-0317', name: 'Autumn Newsletter', category: 'Email', amount: 520490 },
  { id: 'CMP-0318', name: 'Winter Giveaway', category: 'Email', amount: 812214 },
  { id: 'CMP-0319', name: 'Referral Preview', category: 'Event', amount: 108832 },
  { id: 'CMP-0320', name: 'Holiday Contest', category: 'Email', amount: 456708 },
  { id: 'CMP-0321', name: 'Holiday Contest', category: 'Social', amount: 169119 },
  { id: 'CMP-0322', name: 'Autumn Preview', category: 'Search', amount: 830606 },
  { id: 'CMP-0323', name: 'Retargeting Webinar', category: 'Email', amount: 471689 },
  { id: 'CMP-0324', name: 'Winter Newsletter', category: 'Search', amount: 300378 },
  { id: 'CMP-0325', name: 'Autumn Contest', category: 'Email', amount: 901191 },
];

describe('CampaignTable filtering', () => {
  it('filters, sorts and pages through 18 campaigns', async () => {
    const rows = ROWS.slice(0, 18);
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'CMP-0320');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0307');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0317');
  });

  it('filters, sorts and pages through 19 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0325');
    await user.clear(filter);
    await user.type(filter, 'bundl');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0313');
  });

  it('filters, sorts and pages through 19 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'search');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0324');
  });
});
