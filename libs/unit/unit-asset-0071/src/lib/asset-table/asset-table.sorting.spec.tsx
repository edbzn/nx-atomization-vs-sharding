import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0112', name: 'Retired Echo', category: 'Laptop', amount: 656572 },
  { id: 'AST-0113', name: 'Retired Delta', category: 'Tablet', amount: 425773 },
  { id: 'AST-0114', name: 'Loaner Juliet', category: 'Phone', amount: 531998 },
  { id: 'AST-0115', name: 'Repaired Golf', category: 'Tablet', amount: 758609 },
  { id: 'AST-0116', name: 'Shared India', category: 'Printer', amount: 109420 },
  { id: 'AST-0117', name: 'New Alpha', category: 'Monitor', amount: 158459 },
  { id: 'AST-0118', name: 'Repaired Charlie', category: 'Monitor', amount: 554027 },
  { id: 'AST-0119', name: 'Assigned Charlie', category: 'Phone', amount: 279710 },
  { id: 'AST-0120', name: 'Spare Alpha', category: 'Monitor', amount: 558281 },
  { id: 'AST-0121', name: 'Spare Golf', category: 'Tablet', amount: 190027 },
  { id: 'AST-0122', name: 'Shared Charlie', category: 'Laptop', amount: 986050 },
  { id: 'AST-0123', name: 'New Echo', category: 'Monitor', amount: 242565 },
  { id: 'AST-0124', name: 'Repaired Bravo', category: 'Laptop', amount: 848411 },
  { id: 'AST-0125', name: 'Leased Bravo', category: 'Laptop', amount: 113307 },
  { id: 'AST-0126', name: 'Spare Charlie', category: 'Laptop', amount: 725497 },
  { id: 'AST-0127', name: 'Repaired Bravo', category: 'Phone', amount: 393230 },
  { id: 'AST-0128', name: 'Spare Hotel', category: 'Tablet', amount: 1899 },
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
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0112');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0122');
    await user.clear(filter);
    await user.type(filter, 'AST-0120');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0120');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0112');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0128');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0128');
  });

  it('filters, sorts and pages through 17 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0122');
    await user.clear(filter);
    await user.type(filter, 'printer');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0112');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0112');
  });
});
