import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0125', name: 'Loaner Echo', category: 'Laptop', amount: 351463 },
  { id: 'AST-0126', name: 'Loaner Hotel', category: 'Phone', amount: 772416 },
  { id: 'AST-0127', name: 'Retired India', category: 'Monitor', amount: 726316 },
  { id: 'AST-0128', name: 'Reserved Foxtrot', category: 'Laptop', amount: 315317 },
  { id: 'AST-0129', name: 'Loaner Echo', category: 'Laptop', amount: 759234 },
  { id: 'AST-0130', name: 'Reserved Golf', category: 'Phone', amount: 29186 },
  { id: 'AST-0131', name: 'Repaired Delta', category: 'Phone', amount: 681864 },
  { id: 'AST-0132', name: 'Spare Golf', category: 'Monitor', amount: 636629 },
  { id: 'AST-0133', name: 'Loaner Bravo', category: 'Monitor', amount: 789737 },
  { id: 'AST-0134', name: 'Leased Bravo', category: 'Monitor', amount: 68662 },
  { id: 'AST-0135', name: 'Shared India', category: 'Printer', amount: 411794 },
  { id: 'AST-0136', name: 'Reserved Foxtrot', category: 'Tablet', amount: 121480 },
  { id: 'AST-0137', name: 'Spare Alpha', category: 'Monitor', amount: 854711 },
  { id: 'AST-0138', name: 'Loaner Foxtrot', category: 'Phone', amount: 284185 },
  { id: 'AST-0139', name: 'Repaired India', category: 'Printer', amount: 79857 },
  { id: 'AST-0140', name: 'Shared Charlie', category: 'Tablet', amount: 449606 },
  { id: 'AST-0141', name: 'Retired Delta', category: 'Phone', amount: 77846 },
];

describe('AssetTable sorting', () => {
  it('filters, sorts and pages through 17 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'monitor');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    await user.clear(filter);
    await user.type(filter, 'AST-0138');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'Assi');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });
});
