import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0330', name: 'Leased Foxtrot', category: 'Tablet', amount: 982058 },
  { id: 'AST-0331', name: 'Shared Golf', category: 'Monitor', amount: 868558 },
  { id: 'AST-0332', name: 'Reserved Charlie', category: 'Laptop', amount: 278931 },
  { id: 'AST-0333', name: 'Retired Juliet', category: 'Laptop', amount: 451984 },
  { id: 'AST-0334', name: 'Repaired Delta', category: 'Monitor', amount: 945047 },
  { id: 'AST-0335', name: 'New India', category: 'Printer', amount: 493303 },
  { id: 'AST-0336', name: 'Shared Delta', category: 'Laptop', amount: 216605 },
  { id: 'AST-0337', name: 'Loaner Charlie', category: 'Monitor', amount: 305519 },
  { id: 'AST-0338', name: 'Spare Juliet', category: 'Monitor', amount: 315980 },
  { id: 'AST-0339', name: 'Shared Hotel', category: 'Laptop', amount: 197891 },
  { id: 'AST-0340', name: 'Repaired Hotel', category: 'Tablet', amount: 101734 },
  { id: 'AST-0341', name: 'Leased India', category: 'Phone', amount: 344469 },
];

describe('AssetTable pagination', () => {
  it('filters, sorts and pages through 12 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-12 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0340');
    await user.clear(filter);
    await user.type(filter, 'ast-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0330');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-12 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0340');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0330');
  });
});
