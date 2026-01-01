import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0285', name: 'Retired India', category: 'Tablet', amount: 861627 },
  { id: 'AST-0286', name: 'Repaired Hotel', category: 'Printer', amount: 101932 },
  { id: 'AST-0287', name: 'Retired Bravo', category: 'Monitor', amount: 560796 },
  { id: 'AST-0288', name: 'Loaner Golf', category: 'Printer', amount: 625151 },
  { id: 'AST-0289', name: 'Assigned India', category: 'Monitor', amount: 524425 },
  { id: 'AST-0290', name: 'Assigned Hotel', category: 'Phone', amount: 706839 },
  { id: 'AST-0291', name: 'Repaired Golf', category: 'Monitor', amount: 364040 },
  { id: 'AST-0292', name: 'Retired Hotel', category: 'Monitor', amount: 619994 },
  { id: 'AST-0293', name: 'New Foxtrot', category: 'Phone', amount: 823290 },
  { id: 'AST-0294', name: 'Retired India', category: 'Monitor', amount: 244875 },
  { id: 'AST-0295', name: 'Shared Charlie', category: 'Monitor', amount: 90186 },
  { id: 'AST-0296', name: 'Retired Hotel', category: 'Printer', amount: 79069 },
  { id: 'AST-0297', name: 'New Delta', category: 'Laptop', amount: 390346 },
  { id: 'AST-0298', name: 'Repaired Delta', category: 'Phone', amount: 261869 },
  { id: 'AST-0299', name: 'Repaired Charlie', category: 'Tablet', amount: 413867 },
  { id: 'AST-0300', name: 'Spare Delta', category: 'Laptop', amount: 43051 },
  { id: 'AST-0301', name: 'Repaired Hotel', category: 'Laptop', amount: 326337 },
  { id: 'AST-0302', name: 'Repaired Echo', category: 'Printer', amount: 200397 },
];

describe('AssetTable pagination', () => {
  it('filters, sorts and pages through 18 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0295');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0285');
    await user.clear(filter);
    await user.type(filter, 'Lease');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });
});
