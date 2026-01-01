import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0301', name: 'Reserved Delta', category: 'Printer', amount: 786388 },
  { id: 'AST-0302', name: 'Repaired Hotel', category: 'Monitor', amount: 188267 },
  { id: 'AST-0303', name: 'New Bravo', category: 'Laptop', amount: 636817 },
  { id: 'AST-0304', name: 'Loaner Hotel', category: 'Printer', amount: 542236 },
  { id: 'AST-0305', name: 'Loaner Juliet', category: 'Laptop', amount: 46218 },
  { id: 'AST-0306', name: 'Refurbished Bravo', category: 'Laptop', amount: 404520 },
  { id: 'AST-0307', name: 'Repaired Alpha', category: 'Phone', amount: 295216 },
  { id: 'AST-0308', name: 'Assigned Hotel', category: 'Tablet', amount: 963828 },
  { id: 'AST-0309', name: 'Assigned Echo', category: 'Tablet', amount: 997762 },
  { id: 'AST-0310', name: 'Spare Bravo', category: 'Phone', amount: 180077 },
  { id: 'AST-0311', name: 'New Charlie', category: 'Tablet', amount: 250275 },
  { id: 'AST-0312', name: 'New Golf', category: 'Phone', amount: 345666 },
  { id: 'AST-0313', name: 'Spare Hotel', category: 'Printer', amount: 744790 },
  { id: 'AST-0314', name: 'Retired Echo', category: 'Monitor', amount: 384873 },
  { id: 'AST-0315', name: 'Repaired Delta', category: 'Tablet', amount: 892796 },
];

describe('AssetTable pagination', () => {
  it('filters, sorts and pages through 15 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0305');
    await user.clear(filter);
    await user.type(filter, 'Refu');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0305');
    await user.clear(filter);
    await user.type(filter, 'ast-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'printer');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    await user.type(filter, 'foxtro');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0305');
  });
});
