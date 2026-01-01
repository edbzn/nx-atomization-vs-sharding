import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0161', name: 'Roasted Salad', category: 'Main', amount: 298254 },
  { id: 'RCP-0162', name: 'Roasted Curry', category: 'Starter', amount: 479975 },
  { id: 'RCP-0163', name: 'Spicy Salad', category: 'Dessert', amount: 740462 },
  { id: 'RCP-0164', name: 'Sweet Salad', category: 'Main', amount: 924261 },
  { id: 'RCP-0165', name: 'Sweet Stew', category: 'Drink', amount: 76303 },
  { id: 'RCP-0166', name: 'Creamy Salad', category: 'Dessert', amount: 281044 },
  { id: 'RCP-0167', name: 'Savory Gratin', category: 'Drink', amount: 293171 },
  { id: 'RCP-0168', name: 'Savory Tart', category: 'Drink', amount: 34261 },
  { id: 'RCP-0169', name: 'Zesty Soup', category: 'Drink', amount: 98250 },
  { id: 'RCP-0170', name: 'Roasted Waffle', category: 'Drink', amount: 351069 },
  { id: 'RCP-0171', name: 'Spicy Waffle', category: 'Main', amount: 745045 },
  { id: 'RCP-0172', name: 'Roasted Curry', category: 'Dessert', amount: 224863 },
  { id: 'RCP-0173', name: 'Roasted Gratin', category: 'Dessert', amount: 271552 },
  { id: 'RCP-0174', name: 'Grilled Soup', category: 'Side', amount: 792354 },
  { id: 'RCP-0175', name: 'Spicy Curry', category: 'Side', amount: 362762 },
  { id: 'RCP-0176', name: 'Creamy Salad', category: 'Main', amount: 217194 },
];

describe('RecipeTable pagination', () => {
  it('filters, sorts and pages through 16 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0166');
  });

  it('filters, sorts and pages through 16 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0161');
    await user.clear(filter);
    await user.type(filter, 'Zes');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0169');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0176');
  });
});
