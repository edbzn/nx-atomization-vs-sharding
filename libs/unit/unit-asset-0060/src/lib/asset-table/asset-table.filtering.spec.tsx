import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0073', name: 'Assigned Echo', category: 'Monitor', amount: 57309 },
  { id: 'AST-0074', name: 'Refurbished Charlie', category: 'Laptop', amount: 359384 },
  { id: 'AST-0075', name: 'Repaired Foxtrot', category: 'Tablet', amount: 22838 },
  { id: 'AST-0076', name: 'Loaner Charlie', category: 'Printer', amount: 635816 },
  { id: 'AST-0077', name: 'Leased Charlie', category: 'Tablet', amount: 540562 },
  { id: 'AST-0078', name: 'Refurbished Alpha', category: 'Laptop', amount: 589079 },
  { id: 'AST-0079', name: 'Loaner Golf', category: 'Tablet', amount: 574362 },
  { id: 'AST-0080', name: 'Refurbished Juliet', category: 'Phone', amount: 994476 },
  { id: 'AST-0081', name: 'Loaner Juliet', category: 'Tablet', amount: 884018 },
  { id: 'AST-0082', name: 'Shared Golf', category: 'Tablet', amount: 184904 },
  { id: 'AST-0083', name: 'Refurbished Juliet', category: 'Phone', amount: 721491 },
  { id: 'AST-0084', name: 'Retired Golf', category: 'Tablet', amount: 70450 },
  { id: 'AST-0085', name: 'Reserved Foxtrot', category: 'Tablet', amount: 8719 },
  { id: 'AST-0086', name: 'Assigned Alpha', category: 'Printer', amount: 493400 },
  { id: 'AST-0087', name: 'Shared Foxtrot', category: 'Phone', amount: 379007 },
  { id: 'AST-0088', name: 'Retired India', category: 'Laptop', amount: 969860 },
  { id: 'AST-0089', name: 'Assigned Golf', category: 'Phone', amount: 408033 },
];

describe('AssetTable filtering', () => {
  it('filters, sorts and pages through 17 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'New');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'AST-0089');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0073');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0073');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0083');
  });

  it('filters, sorts and pages through 17 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0083');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0083');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0085');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0079');
  });
});
