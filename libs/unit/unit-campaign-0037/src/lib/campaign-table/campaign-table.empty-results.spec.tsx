import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0260', name: 'Loyalty Promo', category: 'Display', amount: 308853 },
  { id: 'CMP-0261', name: 'Autumn Newsletter', category: 'Search', amount: 126990 },
  { id: 'CMP-0262', name: 'Winter Promo', category: 'Social', amount: 62271 },
  { id: 'CMP-0263', name: 'Winter Bundle', category: 'Email', amount: 134302 },
  { id: 'CMP-0264', name: 'Holiday Webinar', category: 'Search', amount: 229547 },
  { id: 'CMP-0265', name: 'Autumn Webinar', category: 'Social', amount: 231219 },
  { id: 'CMP-0266', name: 'Spring Promo', category: 'Email', amount: 661748 },
  { id: 'CMP-0267', name: 'Loyalty Teaser', category: 'Email', amount: 909753 },
  { id: 'CMP-0268', name: 'Clearance Webinar', category: 'Social', amount: 341575 },
  { id: 'CMP-0269', name: 'Winter Webinar', category: 'Event', amount: 190634 },
  { id: 'CMP-0270', name: 'Winter Preview', category: 'Search', amount: 68134 },
  { id: 'CMP-0271', name: 'Referral Giveaway', category: 'Search', amount: 417506 },
  { id: 'CMP-0272', name: 'Winter Survey', category: 'Search', amount: 494633 },
  { id: 'CMP-0273', name: 'Referral Newsletter', category: 'Display', amount: 359962 },
  { id: 'CMP-0274', name: 'Retargeting Teaser', category: 'Event', amount: 477108 },
  { id: 'CMP-0275', name: 'Summer Newsletter', category: 'Email', amount: 464708 },
];

describe('CampaignTable empty results', () => {
  it('filters, sorts and pages through 16 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-16 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0270');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0260');
    await user.clear(filter);
    await user.type(filter, 'search');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    await user.clear(filter);
    await user.type(filter, 'bun');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0260');
    await user.clear(filter);
    await user.type(filter, 'cmp-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'give');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });

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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0260');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-16 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0270');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0260');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0262');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-16 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0271');
    await user.clear(filter);
    await user.type(filter, 'Cle');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });
});
