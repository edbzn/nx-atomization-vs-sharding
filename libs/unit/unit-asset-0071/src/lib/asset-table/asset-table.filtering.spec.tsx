import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0010', name: 'Repaired Bravo', category: 'Phone', amount: 563347 },
  { id: 'AST-0011', name: 'Leased Delta', category: 'Printer', amount: 38065 },
  { id: 'AST-0012', name: 'Shared India', category: 'Laptop', amount: 861704 },
  { id: 'AST-0013', name: 'Shared Golf', category: 'Monitor', amount: 49937 },
  { id: 'AST-0014', name: 'Spare Alpha', category: 'Monitor', amount: 933374 },
  { id: 'AST-0015', name: 'Loaner Echo', category: 'Laptop', amount: 856713 },
  { id: 'AST-0016', name: 'Refurbished Charlie', category: 'Printer', amount: 624078 },
  { id: 'AST-0017', name: 'Repaired Charlie', category: 'Printer', amount: 159948 },
  { id: 'AST-0018', name: 'Leased India', category: 'Printer', amount: 42230 },
  { id: 'AST-0019', name: 'Leased India', category: 'Printer', amount: 869969 },
  { id: 'AST-0020', name: 'Assigned Alpha', category: 'Printer', amount: 795769 },
  { id: 'AST-0021', name: 'Refurbished Alpha', category: 'Monitor', amount: 59937 },
];

describe('AssetTable filtering', () => {
  it('filters, sorts and pages through 12 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'AST-0016');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0010');
    await user.clear(filter);
    await user.type(filter, 'Assi');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0010');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-12 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0020');
    await user.clear(filter);
    await user.type(filter, 'AST-0020');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0010');
  });
});
