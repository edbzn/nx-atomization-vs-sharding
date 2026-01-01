import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0361', name: 'Assigned Foxtrot', category: 'Laptop', amount: 696729 },
  { id: 'AST-0362', name: 'Loaner Delta', category: 'Laptop', amount: 792383 },
  { id: 'AST-0363', name: 'New Foxtrot', category: 'Tablet', amount: 123456 },
  { id: 'AST-0364', name: 'New Echo', category: 'Laptop', amount: 490468 },
  { id: 'AST-0365', name: 'Loaner Bravo', category: 'Phone', amount: 576827 },
  { id: 'AST-0366', name: 'Spare Hotel', category: 'Tablet', amount: 621472 },
  { id: 'AST-0367', name: 'Leased Delta', category: 'Laptop', amount: 263081 },
  { id: 'AST-0368', name: 'Assigned Golf', category: 'Printer', amount: 351959 },
  { id: 'AST-0369', name: 'Retired Juliet', category: 'Monitor', amount: 304821 },
  { id: 'AST-0370', name: 'Spare India', category: 'Phone', amount: 540410 },
  { id: 'AST-0371', name: 'New Hotel', category: 'Printer', amount: 885827 },
  { id: 'AST-0372', name: 'Refurbished Echo', category: 'Monitor', amount: 165631 },
  { id: 'AST-0373', name: 'Loaner Delta', category: 'Monitor', amount: 30242 },
  { id: 'AST-0374', name: 'Spare Charlie', category: 'Phone', amount: 636737 },
  { id: 'AST-0375', name: 'Repaired Hotel', category: 'Laptop', amount: 678953 },
];

describe('AssetTable sorting', () => {
  it('filters, sorts and pages through 15 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0371');
    await user.clear(filter);
    await user.type(filter, 'ast-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0361');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0361');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0371');
    await user.clear(filter);
    await user.type(filter, 'bra');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0365');
  });

  it('filters, sorts and pages through 15 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'tablet');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0361');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0373');
  });
});
