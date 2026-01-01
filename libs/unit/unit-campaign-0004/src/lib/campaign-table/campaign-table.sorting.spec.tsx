import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0296', name: 'Retargeting Survey', category: 'Event', amount: 698667 },
  { id: 'CMP-0297', name: 'Holiday Digest', category: 'Event', amount: 542059 },
  { id: 'CMP-0298', name: 'Spring Survey', category: 'Event', amount: 267519 },
  { id: 'CMP-0299', name: 'Clearance Newsletter', category: 'Social', amount: 370440 },
  { id: 'CMP-0300', name: 'Clearance Newsletter', category: 'Social', amount: 396001 },
  { id: 'CMP-0301', name: 'Summer Preview', category: 'Display', amount: 563174 },
  { id: 'CMP-0302', name: 'Clearance Contest', category: 'Display', amount: 349849 },
  { id: 'CMP-0303', name: 'Holiday Promo', category: 'Social', amount: 775130 },
  { id: 'CMP-0304', name: 'Autumn Bundle', category: 'Event', amount: 301822 },
  { id: 'CMP-0305', name: 'Referral Preview', category: 'Search', amount: 528302 },
  { id: 'CMP-0306', name: 'Spring Bundle', category: 'Display', amount: 631465 },
  { id: 'CMP-0307', name: 'Holiday Bundle', category: 'Display', amount: 782552 },
  { id: 'CMP-0308', name: 'Autumn Promo', category: 'Display', amount: 314452 },
  { id: 'CMP-0309', name: 'Launch Webinar', category: 'Display', amount: 831997 },
  { id: 'CMP-0310', name: 'Summer Bundle', category: 'Display', amount: 139100 },
  { id: 'CMP-0311', name: 'Spring Survey', category: 'Display', amount: 989230 },
  { id: 'CMP-0312', name: 'Clearance Bundle', category: 'Display', amount: 30040 },
  { id: 'CMP-0313', name: 'Winter Preview', category: 'Search', amount: 275924 },
];

describe('CampaignTable sorting', () => {
  it('filters, sorts and pages through 15 campaigns', async () => {
    const rows = ROWS.slice(0, 15);
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0296');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0296');
  });

  it('filters, sorts and pages through 18 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0296');
    await user.clear(filter);
    await user.type(filter, 'cmp-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0296');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0296');
  });
});
