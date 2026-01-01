import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0179', name: 'Retargeting Digest', category: 'Event', amount: 38562 },
  { id: 'CMP-0180', name: 'Spring Digest', category: 'Display', amount: 122278 },
  { id: 'CMP-0181', name: 'Loyalty Newsletter', category: 'Search', amount: 149176 },
  { id: 'CMP-0182', name: 'Clearance Newsletter', category: 'Search', amount: 648145 },
  { id: 'CMP-0183', name: 'Referral Newsletter', category: 'Display', amount: 551250 },
  { id: 'CMP-0184', name: 'Autumn Giveaway', category: 'Search', amount: 775200 },
  { id: 'CMP-0185', name: 'Spring Digest', category: 'Search', amount: 246345 },
  { id: 'CMP-0186', name: 'Clearance Webinar', category: 'Event', amount: 871479 },
  { id: 'CMP-0187', name: 'Autumn Digest', category: 'Event', amount: 734195 },
  { id: 'CMP-0188', name: 'Launch Digest', category: 'Email', amount: 793622 },
  { id: 'CMP-0189', name: 'Autumn Newsletter', category: 'Email', amount: 955721 },
  { id: 'CMP-0190', name: 'Referral Bundle', category: 'Social', amount: 926853 },
  { id: 'CMP-0191', name: 'Clearance Giveaway', category: 'Search', amount: 661048 },
  { id: 'CMP-0192', name: 'Referral Contest', category: 'Event', amount: 487595 },
];

describe('CampaignTable large dataset', () => {
  it('filters, sorts and pages through 14 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'CMP-0188');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'CMP-0187');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0179');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0179');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0189');
    await user.clear(filter);
    await user.type(filter, 'CMP-0186');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0179');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0179');
  });

  it('filters, sorts and pages through 14 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0179');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0189');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0179');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0179');
  });
});
