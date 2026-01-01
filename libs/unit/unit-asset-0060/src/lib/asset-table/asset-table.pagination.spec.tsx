import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0192', name: 'Refurbished Golf', category: 'Monitor', amount: 893684 },
  { id: 'AST-0193', name: 'Assigned Juliet', category: 'Monitor', amount: 863013 },
  { id: 'AST-0194', name: 'Repaired Golf', category: 'Phone', amount: 120650 },
  { id: 'AST-0195', name: 'Loaner Juliet', category: 'Laptop', amount: 482602 },
  { id: 'AST-0196', name: 'Repaired Juliet', category: 'Phone', amount: 531461 },
  { id: 'AST-0197', name: 'Reserved India', category: 'Tablet', amount: 858301 },
  { id: 'AST-0198', name: 'Reserved Delta', category: 'Monitor', amount: 761872 },
  { id: 'AST-0199', name: 'New Hotel', category: 'Laptop', amount: 184695 },
  { id: 'AST-0200', name: 'Leased Delta', category: 'Laptop', amount: 175046 },
  { id: 'AST-0201', name: 'Refurbished India', category: 'Printer', amount: 806078 },
  { id: 'AST-0202', name: 'Assigned Alpha', category: 'Phone', amount: 973749 },
  { id: 'AST-0203', name: 'Assigned India', category: 'Phone', amount: 782972 },
  { id: 'AST-0204', name: 'Loaner Delta', category: 'Tablet', amount: 823339 },
  { id: 'AST-0205', name: 'Reserved Juliet', category: 'Phone', amount: 972811 },
  { id: 'AST-0206', name: 'Reserved India', category: 'Monitor', amount: 967010 },
  { id: 'AST-0207', name: 'Repaired Echo', category: 'Tablet', amount: 446453 },
  { id: 'AST-0208', name: 'Leased Bravo', category: 'Phone', amount: 209463 },
  { id: 'AST-0209', name: 'Refurbished Golf', category: 'Tablet', amount: 947667 },
  { id: 'AST-0210', name: 'Loaner India', category: 'Monitor', amount: 795994 },
  { id: 'AST-0211', name: 'New Charlie', category: 'Phone', amount: 223380 },
];

describe('AssetTable pagination', () => {
  it('filters, sorts and pages through 20 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'monitor');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0192');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0194');
  });
});
