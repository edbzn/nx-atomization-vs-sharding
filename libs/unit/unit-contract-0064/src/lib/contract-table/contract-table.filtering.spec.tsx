import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0087', name: 'Reseller Annex', category: 'Review', amount: 332495 },
  { id: 'CTR-0088', name: 'Lease Order', category: 'Signed', amount: 631263 },
  { id: 'CTR-0089', name: 'Master Agreement', category: 'Renewal', amount: 670510 },
  { id: 'CTR-0090', name: 'Pilot Annex', category: 'Renewal', amount: 190547 },
  { id: 'CTR-0091', name: 'License Waiver', category: 'Signed', amount: 61262 },
  { id: 'CTR-0092', name: 'Lease Accord', category: 'Review', amount: 974240 },
  { id: 'CTR-0093', name: 'Reseller Accord', category: 'Signed', amount: 129964 },
  { id: 'CTR-0094', name: 'License Notice', category: 'Renewal', amount: 489904 },
  { id: 'CTR-0095', name: 'Master Schedule', category: 'Review', amount: 252777 },
  { id: 'CTR-0096', name: 'Supply Waiver', category: 'Draft', amount: 788293 },
  { id: 'CTR-0097', name: 'Pilot Agreement', category: 'Expired', amount: 88511 },
  { id: 'CTR-0098', name: 'Reseller Agreement', category: 'Review', amount: 670121 },
];

describe('ContractTable filtering', () => {
  it('filters, sorts and pages through 12 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0087');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0087');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0098');
    await user.clear(filter);
    await user.type(filter, 'waiver');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
  });
});
