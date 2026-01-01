import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0131', name: 'Shared Delta', category: 'Laptop', amount: 758941 },
  { id: 'AST-0132', name: 'Repaired Bravo', category: 'Phone', amount: 320697 },
  { id: 'AST-0133', name: 'Refurbished Alpha', category: 'Laptop', amount: 106213 },
  { id: 'AST-0134', name: 'Loaner Echo', category: 'Laptop', amount: 7729 },
  { id: 'AST-0135', name: 'Assigned Charlie', category: 'Printer', amount: 30925 },
  { id: 'AST-0136', name: 'Spare Golf', category: 'Phone', amount: 382996 },
  { id: 'AST-0137', name: 'Refurbished Delta', category: 'Laptop', amount: 410543 },
  { id: 'AST-0138', name: 'Reserved Golf', category: 'Laptop', amount: 740635 },
  { id: 'AST-0139', name: 'Refurbished Alpha', category: 'Tablet', amount: 476797 },
  { id: 'AST-0140', name: 'New Delta', category: 'Phone', amount: 49737 },
  { id: 'AST-0141', name: 'Loaner India', category: 'Tablet', amount: 219251 },
  { id: 'AST-0142', name: 'Repaired India', category: 'Tablet', amount: 174258 },
  { id: 'AST-0143', name: 'Loaner India', category: 'Tablet', amount: 62878 },
  { id: 'AST-0144', name: 'Reserved Bravo', category: 'Printer', amount: 362795 },
  { id: 'AST-0145', name: 'Leased India', category: 'Monitor', amount: 598542 },
  { id: 'AST-0146', name: 'Refurbished Alpha', category: 'Phone', amount: 180778 },
  { id: 'AST-0147', name: 'Refurbished Foxtrot', category: 'Tablet', amount: 991474 },
  { id: 'AST-0148', name: 'Loaner India', category: 'Monitor', amount: 201834 },
];

describe('AssetTable filtering', () => {
  it('filters, sorts and pages through 18 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0141');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0131');
    await user.clear(filter);
    await user.type(filter, 'Spare');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });
});
