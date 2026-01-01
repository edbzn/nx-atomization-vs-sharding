import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0077', name: 'Reserved Bravo', category: 'Printer', amount: 899386 },
  { id: 'AST-0078', name: 'Loaner Echo', category: 'Phone', amount: 471790 },
  { id: 'AST-0079', name: 'Reserved India', category: 'Phone', amount: 15416 },
  { id: 'AST-0080', name: 'Retired India', category: 'Laptop', amount: 727011 },
  { id: 'AST-0081', name: 'Spare Charlie', category: 'Tablet', amount: 329988 },
  { id: 'AST-0082', name: 'Refurbished Golf', category: 'Laptop', amount: 801914 },
  { id: 'AST-0083', name: 'New Foxtrot', category: 'Phone', amount: 802580 },
  { id: 'AST-0084', name: 'Repaired Juliet', category: 'Laptop', amount: 463163 },
  { id: 'AST-0085', name: 'Refurbished India', category: 'Laptop', amount: 781665 },
  { id: 'AST-0086', name: 'Reserved Foxtrot', category: 'Phone', amount: 270204 },
  { id: 'AST-0087', name: 'Assigned Echo', category: 'Printer', amount: 867283 },
  { id: 'AST-0088', name: 'Leased Delta', category: 'Monitor', amount: 535885 },
  { id: 'AST-0089', name: 'Loaner India', category: 'Phone', amount: 136936 },
  { id: 'AST-0090', name: 'Repaired India', category: 'Monitor', amount: 850345 },
  { id: 'AST-0091', name: 'Repaired Juliet', category: 'Monitor', amount: 516977 },
];

describe('AssetTable search', () => {
  it('filters, sorts and pages through 15 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0077');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0079');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0087');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0081');
    await user.clear(filter);
    await user.type(filter, 'brav');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0081');
    await user.clear(filter);
    await user.type(filter, 'Loane');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0078');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0089');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0078');
    await user.clear(filter);
    await user.type(filter, 'AST-0078');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0087');
  });
});
