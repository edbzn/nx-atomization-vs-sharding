import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0397', name: 'Refurbished Delta', category: 'Printer', amount: 415645 },
  { id: 'AST-0398', name: 'Assigned Bravo', category: 'Tablet', amount: 204987 },
  { id: 'AST-0399', name: 'Shared Delta', category: 'Laptop', amount: 519464 },
  { id: 'AST-0400', name: 'Refurbished Golf', category: 'Laptop', amount: 672652 },
  { id: 'AST-0401', name: 'Refurbished Golf', category: 'Laptop', amount: 288043 },
  { id: 'AST-0402', name: 'Assigned Foxtrot', category: 'Phone', amount: 159973 },
  { id: 'AST-0403', name: 'Retired Echo', category: 'Printer', amount: 970003 },
  { id: 'AST-0404', name: 'Assigned Echo', category: 'Tablet', amount: 260673 },
  { id: 'AST-0405', name: 'Refurbished Hotel', category: 'Printer', amount: 140700 },
  { id: 'AST-0406', name: 'Loaner Charlie', category: 'Phone', amount: 428132 },
  { id: 'AST-0407', name: 'Loaner India', category: 'Monitor', amount: 658668 },
  { id: 'AST-0408', name: 'Leased Charlie', category: 'Printer', amount: 536394 },
  { id: 'AST-0409', name: 'Shared Charlie', category: 'Monitor', amount: 602394 },
  { id: 'AST-0410', name: 'Leased Bravo', category: 'Tablet', amount: 103228 },
  { id: 'AST-0411', name: 'Repaired Bravo', category: 'Printer', amount: 705047 },
  { id: 'AST-0412', name: 'Spare Charlie', category: 'Monitor', amount: 819172 },
  { id: 'AST-0413', name: 'Assigned Hotel', category: 'Printer', amount: 292655 },
  { id: 'AST-0414', name: 'Leased Foxtrot', category: 'Monitor', amount: 240720 },
  { id: 'AST-0415', name: 'Retired Hotel', category: 'Printer', amount: 276498 },
  { id: 'AST-0416', name: 'Reserved Echo', category: 'Monitor', amount: 519214 },
];

describe('AssetTable filtering', () => {
  it('filters, sorts and pages through 17 assets', async () => {
    const rows = ROWS.slice(0, 17);
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'AST-0403');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0403');
    await user.clear(filter);
    await user.type(filter, 'Rese');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });
});
