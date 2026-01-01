import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0102', name: 'Loyalty Digest', category: 'Social', amount: 259062 },
  { id: 'CMP-0103', name: 'Loyalty Webinar', category: 'Social', amount: 635457 },
  { id: 'CMP-0104', name: 'Launch Newsletter', category: 'Social', amount: 165718 },
  { id: 'CMP-0105', name: 'Retargeting Survey', category: 'Event', amount: 946206 },
  { id: 'CMP-0106', name: 'Clearance Survey', category: 'Search', amount: 342762 },
  { id: 'CMP-0107', name: 'Clearance Preview', category: 'Display', amount: 48479 },
  { id: 'CMP-0108', name: 'Clearance Bundle', category: 'Email', amount: 113641 },
  { id: 'CMP-0109', name: 'Loyalty Newsletter', category: 'Email', amount: 335390 },
  { id: 'CMP-0110', name: 'Winter Teaser', category: 'Email', amount: 513939 },
  { id: 'CMP-0111', name: 'Winter Bundle', category: 'Social', amount: 787418 },
  { id: 'CMP-0112', name: 'Retargeting Survey', category: 'Display', amount: 959818 },
  { id: 'CMP-0113', name: 'Referral Contest', category: 'Display', amount: 271698 },
  { id: 'CMP-0114', name: 'Clearance Newsletter', category: 'Social', amount: 935750 },
  { id: 'CMP-0115', name: 'Spring Preview', category: 'Search', amount: 132767 },
  { id: 'CMP-0116', name: 'Loyalty Promo', category: 'Event', amount: 438739 },
  { id: 'CMP-0117', name: 'Autumn Promo', category: 'Social', amount: 565499 },
  { id: 'CMP-0118', name: 'Winter Teaser', category: 'Event', amount: 798828 },
  { id: 'CMP-0119', name: 'Retargeting Newsletter', category: 'Event', amount: 972371 },
  { id: 'CMP-0120', name: 'Launch Digest', category: 'Social', amount: 99992 },
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0112');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0107');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0117');
    await user.clear(filter);
    await user.type(filter, 'event');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0116');
    await user.clear(filter);
    await user.type(filter, 'social');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-7 of 7');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0107');
  });

  it('filters, sorts and pages through 19 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'bundl');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0102');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0102');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0102');
  });
});
