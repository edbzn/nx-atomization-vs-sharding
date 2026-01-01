import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0148', name: 'Assigned Bravo', category: 'Printer', amount: 154373 },
  { id: 'AST-0149', name: 'Refurbished Foxtrot', category: 'Phone', amount: 154055 },
  { id: 'AST-0150', name: 'New Golf', category: 'Phone', amount: 840535 },
  { id: 'AST-0151', name: 'Leased Hotel', category: 'Phone', amount: 716280 },
  { id: 'AST-0152', name: 'New India', category: 'Tablet', amount: 762492 },
  { id: 'AST-0153', name: 'Shared Bravo', category: 'Tablet', amount: 845008 },
  { id: 'AST-0154', name: 'Reserved Bravo', category: 'Printer', amount: 928090 },
  { id: 'AST-0155', name: 'New Bravo', category: 'Printer', amount: 848200 },
  { id: 'AST-0156', name: 'Reserved Hotel', category: 'Printer', amount: 585107 },
  { id: 'AST-0157', name: 'Leased Golf', category: 'Monitor', amount: 434917 },
  { id: 'AST-0158', name: 'Loaner Foxtrot', category: 'Phone', amount: 664406 },
  { id: 'AST-0159', name: 'Assigned Charlie', category: 'Laptop', amount: 624836 },
];

describe('AssetTable sorting', () => {
  it('filters, sorts and pages through 12 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'brav');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0148');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0153');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0148');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0155');
  });

  it('filters, sorts and pages through 12 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0149');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0149');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-12 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0155');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0149');
  });
});
