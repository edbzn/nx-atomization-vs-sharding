import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0167', name: 'Smoky Gratin', category: 'Side', amount: 889524 },
  { id: 'RCP-0168', name: 'Zesty Soup', category: 'Side', amount: 393931 },
  { id: 'RCP-0169', name: 'Zesty Tart', category: 'Side', amount: 98700 },
  { id: 'RCP-0170', name: 'Grilled Waffle', category: 'Dessert', amount: 593699 },
  { id: 'RCP-0171', name: 'Savory Soup', category: 'Side', amount: 114764 },
  { id: 'RCP-0172', name: 'Grilled Sorbet', category: 'Drink', amount: 107190 },
  { id: 'RCP-0173', name: 'Zesty Risotto', category: 'Main', amount: 267079 },
  { id: 'RCP-0174', name: 'Savory Noodles', category: 'Starter', amount: 56083 },
  { id: 'RCP-0175', name: 'Grilled Risotto', category: 'Side', amount: 259784 },
  { id: 'RCP-0176', name: 'Herbed Salad', category: 'Starter', amount: 616980 },
  { id: 'RCP-0177', name: 'Sweet Stew', category: 'Main', amount: 861486 },
  { id: 'RCP-0178', name: 'Roasted Gratin', category: 'Main', amount: 142888 },
  { id: 'RCP-0179', name: 'Grilled Salad', category: 'Main', amount: 874925 },
  { id: 'RCP-0180', name: 'Spicy Gratin', category: 'Side', amount: 350699 },
  { id: 'RCP-0181', name: 'Herbed Risotto', category: 'Main', amount: 29306 },
  { id: 'RCP-0182', name: 'Creamy Risotto', category: 'Starter', amount: 439883 },
  { id: 'RCP-0183', name: 'Spicy Curry', category: 'Starter', amount: 198361 },
];

describe('RecipeTable filtering', () => {
  it('filters, sorts and pages through 17 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'waffl');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'Cre');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });

  it('filters, sorts and pages through 17 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0167');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0167');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0167');
  });
});
