import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0001', name: 'Leased Charlie', category: 'Tablet', amount: 92307 },
  { id: 'AST-0002', name: 'Loaner Echo', category: 'Printer', amount: 352287 },
  { id: 'AST-0003', name: 'Leased Juliet', category: 'Monitor', amount: 719721 },
  { id: 'AST-0004', name: 'Refurbished Golf', category: 'Laptop', amount: 227257 },
  { id: 'AST-0005', name: 'Repaired Juliet', category: 'Tablet', amount: 921747 },
  { id: 'AST-0006', name: 'Repaired Charlie', category: 'Printer', amount: 802197 },
  { id: 'AST-0007', name: 'Leased Charlie', category: 'Printer', amount: 516142 },
  { id: 'AST-0008', name: 'Refurbished Golf', category: 'Monitor', amount: 554295 },
  { id: 'AST-0009', name: 'Repaired India', category: 'Phone', amount: 583926 },
  { id: 'AST-0010', name: 'Leased Echo', category: 'Tablet', amount: 772959 },
  { id: 'AST-0011', name: 'Retired India', category: 'Laptop', amount: 762101 },
  { id: 'AST-0012', name: 'Repaired Golf', category: 'Printer', amount: 651675 },
  { id: 'AST-0013', name: 'Spare Charlie', category: 'Printer', amount: 694169 },
  { id: 'AST-0014', name: 'Assigned Delta', category: 'Printer', amount: 55974 },
  { id: 'AST-0015', name: 'New Juliet', category: 'Tablet', amount: 340914 },
  { id: 'AST-0016', name: 'Refurbished Golf', category: 'Laptop', amount: 285654 },
];

describe('AssetTable large dataset', () => {
  it('filters, sorts and pages through 16 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0001');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0001');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0001');
    await user.clear(filter);
    await user.type(filter, 'Spar');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'Loane');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0001');
    await user.clear(filter);
    await user.type(filter, 'AST-0015');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0001');
  });

  it('filters, sorts and pages through 16 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'hotel');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0001');
  });
});
