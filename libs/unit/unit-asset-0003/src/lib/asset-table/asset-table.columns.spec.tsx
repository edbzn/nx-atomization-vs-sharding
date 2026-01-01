import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0063', name: 'Leased Alpha', category: 'Monitor', amount: 158080 },
  { id: 'AST-0064', name: 'Loaner India', category: 'Monitor', amount: 543324 },
  { id: 'AST-0065', name: 'Shared Bravo', category: 'Phone', amount: 406542 },
  { id: 'AST-0066', name: 'Repaired Bravo', category: 'Monitor', amount: 690951 },
  { id: 'AST-0067', name: 'Repaired Delta', category: 'Laptop', amount: 327264 },
  { id: 'AST-0068', name: 'Spare Delta', category: 'Laptop', amount: 701037 },
  { id: 'AST-0069', name: 'Loaner Golf', category: 'Tablet', amount: 975440 },
  { id: 'AST-0070', name: 'Loaner Alpha', category: 'Laptop', amount: 392891 },
  { id: 'AST-0071', name: 'New Foxtrot', category: 'Monitor', amount: 374437 },
  { id: 'AST-0072', name: 'Repaired Echo', category: 'Monitor', amount: 265778 },
  { id: 'AST-0073', name: 'Loaner India', category: 'Printer', amount: 109858 },
  { id: 'AST-0074', name: 'Retired Charlie', category: 'Laptop', amount: 540823 },
  { id: 'AST-0075', name: 'Refurbished Charlie', category: 'Monitor', amount: 244564 },
  { id: 'AST-0076', name: 'Spare Delta', category: 'Monitor', amount: 31038 },
  { id: 'AST-0077', name: 'Assigned Foxtrot', category: 'Laptop', amount: 61883 },
  { id: 'AST-0078', name: 'New Golf', category: 'Tablet', amount: 110579 },
];

describe('AssetTable columns', () => {
  it('filters, sorts and pages through 16 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0063');
    await user.clear(filter);
    await user.type(filter, 'Ret');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0074');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0074');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0077');
  });

  it('filters, sorts and pages through 16 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-16 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0073');
    await user.clear(filter);
    await user.type(filter, 'Loane');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
  });
});
