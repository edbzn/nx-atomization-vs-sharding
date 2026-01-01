import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0207', name: 'New Echo', category: 'Phone', amount: 564118 },
  { id: 'AST-0208', name: 'New Juliet', category: 'Printer', amount: 939919 },
  { id: 'AST-0209', name: 'Shared Delta', category: 'Phone', amount: 981836 },
  { id: 'AST-0210', name: 'Refurbished Delta', category: 'Printer', amount: 238879 },
  { id: 'AST-0211', name: 'Loaner Hotel', category: 'Phone', amount: 192758 },
  { id: 'AST-0212', name: 'Retired Charlie', category: 'Phone', amount: 907941 },
  { id: 'AST-0213', name: 'New Alpha', category: 'Laptop', amount: 531472 },
  { id: 'AST-0214', name: 'Repaired Alpha', category: 'Printer', amount: 891021 },
  { id: 'AST-0215', name: 'Retired Bravo', category: 'Monitor', amount: 133304 },
  { id: 'AST-0216', name: 'Leased Foxtrot', category: 'Printer', amount: 819917 },
  { id: 'AST-0217', name: 'Reserved Alpha', category: 'Tablet', amount: 839078 },
  { id: 'AST-0218', name: 'Loaner Golf', category: 'Monitor', amount: 254732 },
];

describe('AssetTable sorting', () => {
  it('filters, sorts and pages through 12 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0216');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0216');
    await user.clear(filter);
    await user.type(filter, 'del');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    await user.type(filter, 'laptop');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });
});
