import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0271', name: 'Spare Alpha', category: 'Monitor', amount: 516839 },
  { id: 'AST-0272', name: 'Refurbished Alpha', category: 'Tablet', amount: 500774 },
  { id: 'AST-0273', name: 'Reserved Charlie', category: 'Tablet', amount: 828413 },
  { id: 'AST-0274', name: 'Repaired Foxtrot', category: 'Monitor', amount: 441712 },
  { id: 'AST-0275', name: 'Spare Charlie', category: 'Phone', amount: 438918 },
  { id: 'AST-0276', name: 'New India', category: 'Laptop', amount: 85061 },
  { id: 'AST-0277', name: 'Retired Charlie', category: 'Monitor', amount: 472394 },
  { id: 'AST-0278', name: 'New India', category: 'Phone', amount: 412972 },
  { id: 'AST-0279', name: 'Assigned Golf', category: 'Monitor', amount: 104935 },
  { id: 'AST-0280', name: 'Assigned Delta', category: 'Printer', amount: 700519 },
  { id: 'AST-0281', name: 'Spare Juliet', category: 'Printer', amount: 395392 },
  { id: 'AST-0282', name: 'Loaner Charlie', category: 'Laptop', amount: 3243 },
  { id: 'AST-0283', name: 'Leased Delta', category: 'Tablet', amount: 658037 },
  { id: 'AST-0284', name: 'Reserved Foxtrot', category: 'Tablet', amount: 307256 },
  { id: 'AST-0285', name: 'Spare Charlie', category: 'Monitor', amount: 956723 },
  { id: 'AST-0286', name: 'Retired Delta', category: 'Monitor', amount: 903771 },
  { id: 'AST-0287', name: 'Assigned Foxtrot', category: 'Laptop', amount: 99237 },
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
    await user.type(filter, 'phone');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0271');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0271');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0271');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0271');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0271');
  });

  it('filters, sorts and pages through 17 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0282');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0271');
  });
});
