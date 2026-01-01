import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0375', name: 'Refurbished Hotel', category: 'Monitor', amount: 21528 },
  { id: 'AST-0376', name: 'Shared Alpha', category: 'Monitor', amount: 360221 },
  { id: 'AST-0377', name: 'Assigned Echo', category: 'Printer', amount: 899510 },
  { id: 'AST-0378', name: 'Leased Alpha', category: 'Laptop', amount: 54565 },
  { id: 'AST-0379', name: 'Repaired Hotel', category: 'Laptop', amount: 264175 },
  { id: 'AST-0380', name: 'Refurbished Alpha', category: 'Printer', amount: 672874 },
  { id: 'AST-0381', name: 'Retired India', category: 'Printer', amount: 648962 },
  { id: 'AST-0382', name: 'Repaired Golf', category: 'Monitor', amount: 333494 },
  { id: 'AST-0383', name: 'Shared Golf', category: 'Tablet', amount: 665924 },
  { id: 'AST-0384', name: 'New India', category: 'Laptop', amount: 170869 },
  { id: 'AST-0385', name: 'New Delta', category: 'Phone', amount: 935644 },
  { id: 'AST-0386', name: 'New Charlie', category: 'Monitor', amount: 129664 },
  { id: 'AST-0387', name: 'Shared Alpha', category: 'Phone', amount: 25411 },
  { id: 'AST-0388', name: 'New Alpha', category: 'Printer', amount: 296476 },
];

describe('AssetTable sorting 2', () => {
  it('filters, sorts and pages through 14 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0385');
    await user.clear(filter);
    await user.type(filter, 'hot');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    await user.type(filter, 'New');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.clear(filter);
    await user.type(filter, 'AST-0384');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0375');
  });

  it('filters, sorts and pages through 14 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0375');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0377');
    await user.clear(filter);
    await user.type(filter, 'ast-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0377');
  });
});
