import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0255', name: 'Shared Charlie', category: 'Phone', amount: 979326 },
  { id: 'AST-0256', name: 'Spare Golf', category: 'Printer', amount: 666614 },
  { id: 'AST-0257', name: 'New Juliet', category: 'Phone', amount: 262628 },
  { id: 'AST-0258', name: 'Assigned India', category: 'Phone', amount: 446744 },
  { id: 'AST-0259', name: 'Reserved Juliet', category: 'Monitor', amount: 286024 },
  { id: 'AST-0260', name: 'Retired Hotel', category: 'Monitor', amount: 299726 },
  { id: 'AST-0261', name: 'Loaner India', category: 'Tablet', amount: 257169 },
  { id: 'AST-0262', name: 'Reserved Golf', category: 'Printer', amount: 316532 },
  { id: 'AST-0263', name: 'Spare Delta', category: 'Monitor', amount: 202283 },
  { id: 'AST-0264', name: 'New Juliet', category: 'Printer', amount: 341 },
  { id: 'AST-0265', name: 'Leased Foxtrot', category: 'Phone', amount: 967326 },
  { id: 'AST-0266', name: 'Leased India', category: 'Tablet', amount: 805507 },
  { id: 'AST-0267', name: 'Assigned Foxtrot', category: 'Printer', amount: 652709 },
  { id: 'AST-0268', name: 'Refurbished Golf', category: 'Printer', amount: 573092 },
  { id: 'AST-0269', name: 'Spare Bravo', category: 'Laptop', amount: 753976 },
  { id: 'AST-0270', name: 'Leased Hotel', category: 'Laptop', amount: 224004 },
];

describe('AssetTable search', () => {
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0255');
    await user.clear(filter);
    await user.type(filter, 'Res');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0255');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0270');
    await user.clear(filter);
    await user.type(filter, 'foxtro');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    await user.type(filter, 'tablet');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    await user.type(filter, 'New');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    await user.type(filter, 'ast-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0270');
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0265');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0267');
    await user.clear(filter);
    await user.type(filter, 'tablet');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
  });
});
