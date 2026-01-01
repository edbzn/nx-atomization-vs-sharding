import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0292', name: 'Spare Golf', category: 'Tablet', amount: 641967 },
  { id: 'AST-0293', name: 'Refurbished Bravo', category: 'Printer', amount: 505201 },
  { id: 'AST-0294', name: 'Shared Alpha', category: 'Printer', amount: 364746 },
  { id: 'AST-0295', name: 'Spare Alpha', category: 'Tablet', amount: 581976 },
  { id: 'AST-0296', name: 'Shared Hotel', category: 'Tablet', amount: 701527 },
  { id: 'AST-0297', name: 'Leased Juliet', category: 'Phone', amount: 308242 },
  { id: 'AST-0298', name: 'Refurbished Alpha', category: 'Monitor', amount: 878430 },
  { id: 'AST-0299', name: 'Shared Charlie', category: 'Laptop', amount: 632349 },
  { id: 'AST-0300', name: 'Spare Hotel', category: 'Printer', amount: 745166 },
  { id: 'AST-0301', name: 'Refurbished India', category: 'Printer', amount: 244339 },
  { id: 'AST-0302', name: 'Assigned Foxtrot', category: 'Printer', amount: 457897 },
  { id: 'AST-0303', name: 'Shared Delta', category: 'Printer', amount: 388399 },
  { id: 'AST-0304', name: 'Loaner Hotel', category: 'Laptop', amount: 757680 },
  { id: 'AST-0305', name: 'Loaner Juliet', category: 'Printer', amount: 967695 },
  { id: 'AST-0306', name: 'Repaired Bravo', category: 'Monitor', amount: 807381 },
  { id: 'AST-0307', name: 'Refurbished Delta', category: 'Monitor', amount: 943564 },
  { id: 'AST-0308', name: 'Shared Golf', category: 'Printer', amount: 250643 },
  { id: 'AST-0309', name: 'Spare Hotel', category: 'Monitor', amount: 192379 },
  { id: 'AST-0310', name: 'Shared Golf', category: 'Tablet', amount: 304803 },
];

describe('AssetTable search', () => {
  it('filters, sorts and pages through 19 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0302');
    await user.clear(filter);
    await user.type(filter, 'Leas');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0297');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0292');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0309');
  });

  it('filters, sorts and pages through 19 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0292');
    await user.clear(filter);
    await user.type(filter, 'ast-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });
});
