import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0236', name: 'Assigned Golf', category: 'Tablet', amount: 185131 },
  { id: 'AST-0237', name: 'Retired Bravo', category: 'Monitor', amount: 287446 },
  { id: 'AST-0238', name: 'Leased Delta', category: 'Monitor', amount: 738072 },
  { id: 'AST-0239', name: 'Spare Hotel', category: 'Phone', amount: 928465 },
  { id: 'AST-0240', name: 'Repaired India', category: 'Laptop', amount: 538144 },
  { id: 'AST-0241', name: 'Repaired Hotel', category: 'Laptop', amount: 33100 },
  { id: 'AST-0242', name: 'Loaner Golf', category: 'Laptop', amount: 709823 },
  { id: 'AST-0243', name: 'Spare Bravo', category: 'Printer', amount: 28115 },
  { id: 'AST-0244', name: 'Refurbished Alpha', category: 'Monitor', amount: 34292 },
  { id: 'AST-0245', name: 'Loaner India', category: 'Printer', amount: 610450 },
  { id: 'AST-0246', name: 'Reserved Hotel', category: 'Phone', amount: 93709 },
  { id: 'AST-0247', name: 'Repaired Bravo', category: 'Laptop', amount: 640006 },
  { id: 'AST-0248', name: 'Repaired Alpha', category: 'Monitor', amount: 212254 },
  { id: 'AST-0249', name: 'Assigned Golf', category: 'Tablet', amount: 35748 },
  { id: 'AST-0250', name: 'Shared Alpha', category: 'Laptop', amount: 745432 },
];

describe('AssetTable sorting', () => {
  it('filters, sorts and pages through 15 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0236');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0236');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0236');
  });

  it('filters, sorts and pages through 15 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'bravo');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0236');
    await user.clear(filter);
    await user.type(filter, 'alpha');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
  });
});
