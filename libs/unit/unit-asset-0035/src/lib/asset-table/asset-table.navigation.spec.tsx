import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0108', name: 'Refurbished Juliet', category: 'Phone', amount: 63190 },
  { id: 'AST-0109', name: 'Repaired India', category: 'Monitor', amount: 5758 },
  { id: 'AST-0110', name: 'Retired Alpha', category: 'Printer', amount: 41733 },
  { id: 'AST-0111', name: 'Shared Bravo', category: 'Printer', amount: 110596 },
  { id: 'AST-0112', name: 'Refurbished Juliet', category: 'Laptop', amount: 720585 },
  { id: 'AST-0113', name: 'Loaner Delta', category: 'Laptop', amount: 563724 },
  { id: 'AST-0114', name: 'New Bravo', category: 'Tablet', amount: 947129 },
  { id: 'AST-0115', name: 'Spare Delta', category: 'Printer', amount: 566501 },
  { id: 'AST-0116', name: 'Retired Echo', category: 'Laptop', amount: 841637 },
  { id: 'AST-0117', name: 'Shared Alpha', category: 'Tablet', amount: 317720 },
  { id: 'AST-0118', name: 'Leased Foxtrot', category: 'Phone', amount: 833098 },
  { id: 'AST-0119', name: 'Loaner Hotel', category: 'Phone', amount: 375292 },
  { id: 'AST-0120', name: 'Reserved Hotel', category: 'Monitor', amount: 137374 },
  { id: 'AST-0121', name: 'Leased Foxtrot', category: 'Monitor', amount: 295678 },
  { id: 'AST-0122', name: 'Spare Echo', category: 'Printer', amount: 405202 },
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
    await user.type(filter, 'brav');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0108');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0118');
    await user.clear(filter);
    await user.type(filter, 'ast-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });

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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0118');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0108');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0118');
    await user.clear(filter);
    await user.type(filter, 'laptop');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0116');
  });
});
