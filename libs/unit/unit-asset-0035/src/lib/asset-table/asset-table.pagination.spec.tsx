import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0386', name: 'New Golf', category: 'Tablet', amount: 879366 },
  { id: 'AST-0387', name: 'Loaner Juliet', category: 'Printer', amount: 516567 },
  { id: 'AST-0388', name: 'Loaner Golf', category: 'Monitor', amount: 831662 },
  { id: 'AST-0389', name: 'Leased Alpha', category: 'Laptop', amount: 740998 },
  { id: 'AST-0390', name: 'Loaner Hotel', category: 'Tablet', amount: 211240 },
  { id: 'AST-0391', name: 'New Echo', category: 'Monitor', amount: 482351 },
  { id: 'AST-0392', name: 'Spare Bravo', category: 'Tablet', amount: 457444 },
  { id: 'AST-0393', name: 'Shared Charlie', category: 'Monitor', amount: 207069 },
  { id: 'AST-0394', name: 'Reserved Echo', category: 'Monitor', amount: 870279 },
  { id: 'AST-0395', name: 'Loaner Golf', category: 'Printer', amount: 165235 },
  { id: 'AST-0396', name: 'Refurbished Charlie', category: 'Monitor', amount: 445684 },
  { id: 'AST-0397', name: 'Assigned Alpha', category: 'Laptop', amount: 638275 },
  { id: 'AST-0398', name: 'Refurbished Bravo', category: 'Laptop', amount: 291098 },
  { id: 'AST-0399', name: 'Loaner Juliet', category: 'Monitor', amount: 235655 },
  { id: 'AST-0400', name: 'Retired Delta', category: 'Laptop', amount: 657696 },
  { id: 'AST-0401', name: 'Repaired Echo', category: 'Phone', amount: 804644 },
  { id: 'AST-0402', name: 'Loaner Alpha', category: 'Printer', amount: 77108 },
];

describe('AssetTable pagination', () => {
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0386');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0396');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0386');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0397');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0397');
    await user.clear(filter);
    await user.type(filter, 'AST-0402');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });

  it('filters, sorts and pages through 17 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'Loane');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-6 of 6');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0386');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0396');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0386');
  });
});
