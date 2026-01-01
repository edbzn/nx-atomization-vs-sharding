import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0100', name: 'Spare Alpha', category: 'Printer', amount: 593012 },
  { id: 'AST-0101', name: 'Spare Hotel', category: 'Printer', amount: 993103 },
  { id: 'AST-0102', name: 'Shared Echo', category: 'Phone', amount: 315067 },
  { id: 'AST-0103', name: 'Refurbished Bravo', category: 'Tablet', amount: 56840 },
  { id: 'AST-0104', name: 'Shared Delta', category: 'Printer', amount: 282346 },
  { id: 'AST-0105', name: 'Assigned Delta', category: 'Laptop', amount: 693460 },
  { id: 'AST-0106', name: 'Reserved Echo', category: 'Monitor', amount: 860157 },
  { id: 'AST-0107', name: 'Assigned Golf', category: 'Printer', amount: 466948 },
  { id: 'AST-0108', name: 'Shared Hotel', category: 'Printer', amount: 663203 },
  { id: 'AST-0109', name: 'New Bravo', category: 'Monitor', amount: 466464 },
  { id: 'AST-0110', name: 'Shared Charlie', category: 'Printer', amount: 917516 },
  { id: 'AST-0111', name: 'Reserved Alpha', category: 'Tablet', amount: 166243 },
  { id: 'AST-0112', name: 'Refurbished Bravo', category: 'Tablet', amount: 981283 },
  { id: 'AST-0113', name: 'Loaner Alpha', category: 'Tablet', amount: 340949 },
  { id: 'AST-0114', name: 'Assigned Echo', category: 'Phone', amount: 682071 },
  { id: 'AST-0115', name: 'New Foxtrot', category: 'Monitor', amount: 143595 },
  { id: 'AST-0116', name: 'New Bravo', category: 'Tablet', amount: 807840 },
  { id: 'AST-0117', name: 'Spare Golf', category: 'Monitor', amount: 562316 },
];

describe('AssetTable sorting', () => {
  it('filters, sorts and pages through 18 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0103');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0108');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0105');
  });
});
