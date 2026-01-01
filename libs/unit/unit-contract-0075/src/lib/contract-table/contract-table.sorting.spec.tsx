import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0100', name: 'Escrow Order', category: 'Renewal', amount: 809897 },
  { id: 'CTR-0101', name: 'Lease Annex', category: 'Expired', amount: 398898 },
  { id: 'CTR-0102', name: 'Lease Schedule', category: 'Expired', amount: 698656 },
  { id: 'CTR-0103', name: 'Supply Schedule', category: 'Expired', amount: 647981 },
  { id: 'CTR-0104', name: 'Framework Annex', category: 'Renewal', amount: 818812 },
  { id: 'CTR-0105', name: 'Hosting Agreement', category: 'Expired', amount: 902617 },
  { id: 'CTR-0106', name: 'Supply Addendum', category: 'Draft', amount: 690494 },
  { id: 'CTR-0107', name: 'Service Waiver', category: 'Expired', amount: 376324 },
  { id: 'CTR-0108', name: 'Pilot Agreement', category: 'Renewal', amount: 474758 },
  { id: 'CTR-0109', name: 'Reseller Notice', category: 'Expired', amount: 865873 },
  { id: 'CTR-0110', name: 'Master Mandate', category: 'Signed', amount: 706647 },
  { id: 'CTR-0111', name: 'Lease Addendum', category: 'Review', amount: 77206 },
  { id: 'CTR-0112', name: 'Reseller Agreement', category: 'Draft', amount: 904403 },
];

describe('ContractTable sorting', () => {
  it('filters, sorts and pages through 13 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-13 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0110');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0100');
  });

  it('filters, sorts and pages through 13 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'ctr-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'Serv');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });
});
