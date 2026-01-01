import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0361', name: 'Spare India', category: 'Printer', amount: 281212 },
  { id: 'AST-0362', name: 'Refurbished Charlie', category: 'Laptop', amount: 770626 },
  { id: 'AST-0363', name: 'Retired Delta', category: 'Monitor', amount: 488490 },
  { id: 'AST-0364', name: 'Assigned Juliet', category: 'Laptop', amount: 530765 },
  { id: 'AST-0365', name: 'Loaner Golf', category: 'Phone', amount: 314212 },
  { id: 'AST-0366', name: 'Reserved Hotel', category: 'Monitor', amount: 339535 },
  { id: 'AST-0367', name: 'Shared Juliet', category: 'Monitor', amount: 923825 },
  { id: 'AST-0368', name: 'Leased Juliet', category: 'Monitor', amount: 664038 },
  { id: 'AST-0369', name: 'Shared Juliet', category: 'Monitor', amount: 896724 },
  { id: 'AST-0370', name: 'Leased Bravo', category: 'Printer', amount: 895660 },
  { id: 'AST-0371', name: 'Refurbished Juliet', category: 'Tablet', amount: 263996 },
  { id: 'AST-0372', name: 'Reserved Foxtrot', category: 'Phone', amount: 710634 },
  { id: 'AST-0373', name: 'Loaner Golf', category: 'Phone', amount: 83603 },
  { id: 'AST-0374', name: 'Loaner Juliet', category: 'Monitor', amount: 263204 },
  { id: 'AST-0375', name: 'New Golf', category: 'Laptop', amount: 93637 },
  { id: 'AST-0376', name: 'Reserved Bravo', category: 'Tablet', amount: 436745 },
  { id: 'AST-0377', name: 'Loaner Delta', category: 'Printer', amount: 138554 },
];

describe('AssetTable sorting 2', () => {
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0361');
    await user.clear(filter);
    await user.type(filter, 'golf');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0361');
    await user.clear(filter);
    await user.type(filter, 'AST-0370');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0370');
    await user.clear(filter);
    await user.type(filter, 'Retir');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0364');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0361');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0371');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0371');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0361');
  });
});
