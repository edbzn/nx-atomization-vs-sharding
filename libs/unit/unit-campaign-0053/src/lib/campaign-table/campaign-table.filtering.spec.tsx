import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0088', name: 'Loyalty Newsletter', category: 'Email', amount: 746036 },
  { id: 'CMP-0089', name: 'Spring Digest', category: 'Email', amount: 527590 },
  { id: 'CMP-0090', name: 'Summer Promo', category: 'Event', amount: 894323 },
  { id: 'CMP-0091', name: 'Summer Giveaway', category: 'Social', amount: 307755 },
  { id: 'CMP-0092', name: 'Autumn Survey', category: 'Display', amount: 603925 },
  { id: 'CMP-0093', name: 'Autumn Digest', category: 'Social', amount: 351524 },
  { id: 'CMP-0094', name: 'Holiday Preview', category: 'Display', amount: 79549 },
  { id: 'CMP-0095', name: 'Spring Contest', category: 'Event', amount: 441122 },
  { id: 'CMP-0096', name: 'Autumn Contest', category: 'Display', amount: 240590 },
  { id: 'CMP-0097', name: 'Retargeting Digest', category: 'Display', amount: 280083 },
  { id: 'CMP-0098', name: 'Loyalty Bundle', category: 'Event', amount: 753071 },
  { id: 'CMP-0099', name: 'Clearance Bundle', category: 'Event', amount: 276367 },
  { id: 'CMP-0100', name: 'Launch Newsletter', category: 'Search', amount: 76368 },
  { id: 'CMP-0101', name: 'Retargeting Promo', category: 'Email', amount: 50807 },
];

describe('CampaignTable filtering', () => {
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0088');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0098');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0088');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0098');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0101');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0091');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0091');
  });
});
