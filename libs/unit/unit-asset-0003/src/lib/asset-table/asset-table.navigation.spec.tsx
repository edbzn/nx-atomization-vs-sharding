import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0376', name: 'Refurbished Golf', category: 'Tablet', amount: 311714 },
  { id: 'AST-0377', name: 'Repaired Echo', category: 'Tablet', amount: 690057 },
  { id: 'AST-0378', name: 'Repaired India', category: 'Printer', amount: 991508 },
  { id: 'AST-0379', name: 'Retired Charlie', category: 'Phone', amount: 276203 },
  { id: 'AST-0380', name: 'New Charlie', category: 'Printer', amount: 184007 },
  { id: 'AST-0381', name: 'Reserved Juliet', category: 'Phone', amount: 759889 },
  { id: 'AST-0382', name: 'Assigned Delta', category: 'Tablet', amount: 394487 },
  { id: 'AST-0383', name: 'Loaner Juliet', category: 'Tablet', amount: 583670 },
  { id: 'AST-0384', name: 'Spare India', category: 'Laptop', amount: 638875 },
  { id: 'AST-0385', name: 'Leased Bravo', category: 'Laptop', amount: 934838 },
  { id: 'AST-0386', name: 'Reserved Foxtrot', category: 'Laptop', amount: 557206 },
  { id: 'AST-0387', name: 'Assigned Bravo', category: 'Printer', amount: 437635 },
  { id: 'AST-0388', name: 'Spare Golf', category: 'Monitor', amount: 428210 },
  { id: 'AST-0389', name: 'New Hotel', category: 'Printer', amount: 741362 },
  { id: 'AST-0390', name: 'Spare Golf', category: 'Tablet', amount: 431784 },
];

describe('AssetTable navigation', () => {
  it('filters, sorts and pages through 15 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'ast-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0376');
    await user.clear(filter);
    await user.type(filter, 'Spare');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
  });
});
