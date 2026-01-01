import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0375', name: 'Refurbished Delta', category: 'Printer', amount: 660642 },
  { id: 'AST-0376', name: 'Shared Charlie', category: 'Phone', amount: 48388 },
  { id: 'AST-0377', name: 'Refurbished Bravo', category: 'Tablet', amount: 271676 },
  { id: 'AST-0378', name: 'New India', category: 'Laptop', amount: 304224 },
  { id: 'AST-0379', name: 'Shared Foxtrot', category: 'Monitor', amount: 966078 },
  { id: 'AST-0380', name: 'New Juliet', category: 'Phone', amount: 821714 },
  { id: 'AST-0381', name: 'Repaired Hotel', category: 'Monitor', amount: 406070 },
  { id: 'AST-0382', name: 'Repaired Hotel', category: 'Phone', amount: 508806 },
  { id: 'AST-0383', name: 'Refurbished Delta', category: 'Monitor', amount: 250068 },
  { id: 'AST-0384', name: 'Retired Echo', category: 'Monitor', amount: 262206 },
  { id: 'AST-0385', name: 'Repaired Echo', category: 'Phone', amount: 47328 },
  { id: 'AST-0386', name: 'Reserved Delta', category: 'Monitor', amount: 211177 },
  { id: 'AST-0387', name: 'New Golf', category: 'Printer', amount: 446013 },
  { id: 'AST-0388', name: 'Repaired Delta', category: 'Laptop', amount: 292928 },
  { id: 'AST-0389', name: 'Assigned Echo', category: 'Monitor', amount: 330288 },
];

describe('AssetTable empty results', () => {
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0385');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0375');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0389');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0382');
    await user.clear(filter);
    await user.type(filter, 'Repa');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.clear(filter);
    await user.type(filter, 'AST-0380');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0385');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0385');
    await user.clear(filter);
    await user.type(filter, 'AST-0385');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0385');
  });
});
