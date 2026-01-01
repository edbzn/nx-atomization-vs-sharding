import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0274', name: 'Shared Juliet', category: 'Laptop', amount: 274629 },
  { id: 'AST-0275', name: 'Loaner Hotel', category: 'Laptop', amount: 341805 },
  { id: 'AST-0276', name: 'Spare Foxtrot', category: 'Laptop', amount: 65939 },
  { id: 'AST-0277', name: 'New Bravo', category: 'Tablet', amount: 270629 },
  { id: 'AST-0278', name: 'Assigned Alpha', category: 'Monitor', amount: 789819 },
  { id: 'AST-0279', name: 'Repaired Echo', category: 'Laptop', amount: 618236 },
  { id: 'AST-0280', name: 'Retired Foxtrot', category: 'Monitor', amount: 894992 },
  { id: 'AST-0281', name: 'Assigned Juliet', category: 'Laptop', amount: 189279 },
  { id: 'AST-0282', name: 'Spare Alpha', category: 'Monitor', amount: 570044 },
  { id: 'AST-0283', name: 'Spare Alpha', category: 'Monitor', amount: 453341 },
  { id: 'AST-0284', name: 'Assigned India', category: 'Monitor', amount: 761401 },
  { id: 'AST-0285', name: 'Repaired Juliet', category: 'Tablet', amount: 510897 },
  { id: 'AST-0286', name: 'Shared Golf', category: 'Printer', amount: 924143 },
  { id: 'AST-0287', name: 'Loaner Juliet', category: 'Laptop', amount: 260881 },
];

describe('AssetTable sorting', () => {
  it('filters, sorts and pages through 14 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'Loa');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    await user.type(filter, 'ast-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });
});
