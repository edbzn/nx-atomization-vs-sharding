import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0379', name: 'New Echo', category: 'Tablet', amount: 896351 },
  { id: 'AST-0380', name: 'Refurbished Charlie', category: 'Printer', amount: 582783 },
  { id: 'AST-0381', name: 'Shared Foxtrot', category: 'Phone', amount: 726309 },
  { id: 'AST-0382', name: 'Spare India', category: 'Printer', amount: 105631 },
  { id: 'AST-0383', name: 'Retired India', category: 'Printer', amount: 739960 },
  { id: 'AST-0384', name: 'Shared Bravo', category: 'Printer', amount: 997931 },
  { id: 'AST-0385', name: 'Refurbished Alpha', category: 'Laptop', amount: 650198 },
  { id: 'AST-0386', name: 'Shared Hotel', category: 'Tablet', amount: 765686 },
  { id: 'AST-0387', name: 'Repaired India', category: 'Laptop', amount: 535928 },
  { id: 'AST-0388', name: 'Repaired Echo', category: 'Tablet', amount: 143779 },
  { id: 'AST-0389', name: 'Assigned India', category: 'Printer', amount: 376083 },
  { id: 'AST-0390', name: 'Repaired Hotel', category: 'Tablet', amount: 362881 },
  { id: 'AST-0391', name: 'Leased Charlie', category: 'Phone', amount: 267811 },
  { id: 'AST-0392', name: 'Loaner Charlie', category: 'Monitor', amount: 342553 },
  { id: 'AST-0393', name: 'Refurbished Echo', category: 'Laptop', amount: 459752 },
  { id: 'AST-0394', name: 'Leased Bravo', category: 'Monitor', amount: 87997 },
  { id: 'AST-0395', name: 'Loaner India', category: 'Laptop', amount: 548172 },
  { id: 'AST-0396', name: 'Shared Bravo', category: 'Monitor', amount: 545350 },
  { id: 'AST-0397', name: 'Shared Bravo', category: 'Monitor', amount: 61207 },
  { id: 'AST-0398', name: 'Shared Alpha', category: 'Laptop', amount: 809310 },
];

describe('AssetTable filtering 2', () => {
  it('filters, sorts and pages through 20 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-20 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0389');
    await user.clear(filter);
    await user.type(filter, 'ech');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0379');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0397');
  });
});
