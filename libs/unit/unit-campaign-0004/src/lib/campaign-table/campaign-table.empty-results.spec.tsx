import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0301', name: 'Retargeting Preview', category: 'Social', amount: 906911 },
  { id: 'CMP-0302', name: 'Retargeting Newsletter', category: 'Display', amount: 63352 },
  { id: 'CMP-0303', name: 'Referral Digest', category: 'Social', amount: 173258 },
  { id: 'CMP-0304', name: 'Autumn Newsletter', category: 'Social', amount: 202141 },
  { id: 'CMP-0305', name: 'Summer Preview', category: 'Email', amount: 974253 },
  { id: 'CMP-0306', name: 'Loyalty Survey', category: 'Search', amount: 558849 },
  { id: 'CMP-0307', name: 'Referral Newsletter', category: 'Search', amount: 566247 },
  { id: 'CMP-0308', name: 'Clearance Giveaway', category: 'Event', amount: 417019 },
  { id: 'CMP-0309', name: 'Loyalty Contest', category: 'Event', amount: 949339 },
  { id: 'CMP-0310', name: 'Spring Contest', category: 'Social', amount: 632192 },
  { id: 'CMP-0311', name: 'Launch Teaser', category: 'Event', amount: 350769 },
  { id: 'CMP-0312', name: 'Referral Preview', category: 'Social', amount: 945763 },
  { id: 'CMP-0313', name: 'Clearance Preview', category: 'Display', amount: 932258 },
  { id: 'CMP-0314', name: 'Retargeting Contest', category: 'Display', amount: 33268 },
  { id: 'CMP-0315', name: 'Launch Newsletter', category: 'Event', amount: 51374 },
];

describe('CampaignTable empty results', () => {
  it('filters, sorts and pages through 15 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0301');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0304');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0314');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0314');
  });
});
