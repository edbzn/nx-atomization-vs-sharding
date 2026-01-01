import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0334', name: 'Assigned Bravo', category: 'Laptop', amount: 322109 },
  { id: 'AST-0335', name: 'Loaner Juliet', category: 'Phone', amount: 218438 },
  { id: 'AST-0336', name: 'Leased Alpha', category: 'Monitor', amount: 226810 },
  { id: 'AST-0337', name: 'Repaired Bravo', category: 'Phone', amount: 526522 },
  { id: 'AST-0338', name: 'Loaner Golf', category: 'Laptop', amount: 215116 },
  { id: 'AST-0339', name: 'Assigned India', category: 'Phone', amount: 765598 },
  { id: 'AST-0340', name: 'Leased Echo', category: 'Tablet', amount: 709699 },
  { id: 'AST-0341', name: 'Refurbished Foxtrot', category: 'Monitor', amount: 124650 },
  { id: 'AST-0342', name: 'Assigned Golf', category: 'Laptop', amount: 194735 },
  { id: 'AST-0343', name: 'Spare Alpha', category: 'Laptop', amount: 941631 },
  { id: 'AST-0344', name: 'New Hotel', category: 'Laptop', amount: 681509 },
  { id: 'AST-0345', name: 'Reserved Charlie', category: 'Phone', amount: 414248 },
  { id: 'AST-0346', name: 'Retired Bravo', category: 'Printer', amount: 477187 },
  { id: 'AST-0347', name: 'Leased Hotel', category: 'Printer', amount: 786934 },
  { id: 'AST-0348', name: 'Reserved Delta', category: 'Phone', amount: 656701 },
  { id: 'AST-0349', name: 'Assigned Echo', category: 'Tablet', amount: 864564 },
  { id: 'AST-0350', name: 'Retired Foxtrot', category: 'Printer', amount: 770820 },
  { id: 'AST-0351', name: 'New Charlie', category: 'Phone', amount: 418705 },
  { id: 'AST-0352', name: 'Shared Echo', category: 'Laptop', amount: 613255 },
  { id: 'AST-0353', name: 'Assigned Hotel', category: 'Phone', amount: 751625 },
];

describe('AssetTable filtering', () => {
  it('filters, sorts and pages through 20 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0334');
    await user.clear(filter);
    await user.type(filter, 'AST-0341');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0334');
  });
});
