import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0318', name: 'Shared Foxtrot', category: 'Tablet', amount: 27527 },
  { id: 'AST-0319', name: 'Spare Golf', category: 'Laptop', amount: 568206 },
  { id: 'AST-0320', name: 'Loaner Delta', category: 'Monitor', amount: 269914 },
  { id: 'AST-0321', name: 'Leased Bravo', category: 'Phone', amount: 397567 },
  { id: 'AST-0322', name: 'Assigned Juliet', category: 'Printer', amount: 593806 },
  { id: 'AST-0323', name: 'Retired India', category: 'Laptop', amount: 610715 },
  { id: 'AST-0324', name: 'Reserved Delta', category: 'Printer', amount: 827098 },
  { id: 'AST-0325', name: 'Refurbished Bravo', category: 'Phone', amount: 706939 },
  { id: 'AST-0326', name: 'Reserved Foxtrot', category: 'Monitor', amount: 809542 },
  { id: 'AST-0327', name: 'Retired Alpha', category: 'Tablet', amount: 286268 },
  { id: 'AST-0328', name: 'Leased Bravo', category: 'Printer', amount: 52978 },
  { id: 'AST-0329', name: 'Leased India', category: 'Printer', amount: 868640 },
  { id: 'AST-0330', name: 'Loaner Juliet', category: 'Printer', amount: 703226 },
];

describe('AssetTable filtering', () => {
  it('filters, sorts and pages through 13 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'ast-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });
});
