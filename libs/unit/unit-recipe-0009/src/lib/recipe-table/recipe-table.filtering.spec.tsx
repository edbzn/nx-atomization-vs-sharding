import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0027', name: 'Spicy Waffle', category: 'Starter', amount: 399085 },
  { id: 'RCP-0028', name: 'Smoky Tart', category: 'Drink', amount: 540080 },
  { id: 'RCP-0029', name: 'Savory Risotto', category: 'Side', amount: 214374 },
  { id: 'RCP-0030', name: 'Spicy Waffle', category: 'Starter', amount: 216003 },
  { id: 'RCP-0031', name: 'Savory Tart', category: 'Dessert', amount: 819621 },
  { id: 'RCP-0032', name: 'Creamy Waffle', category: 'Main', amount: 205999 },
  { id: 'RCP-0033', name: 'Creamy Risotto', category: 'Side', amount: 557377 },
  { id: 'RCP-0034', name: 'Crispy Soup', category: 'Drink', amount: 207852 },
  { id: 'RCP-0035', name: 'Crispy Curry', category: 'Drink', amount: 250337 },
  { id: 'RCP-0036', name: 'Roasted Soup', category: 'Dessert', amount: 559114 },
  { id: 'RCP-0037', name: 'Smoky Soup', category: 'Side', amount: 334889 },
  { id: 'RCP-0038', name: 'Savory Tart', category: 'Main', amount: 260920 },
  { id: 'RCP-0039', name: 'Grilled Stew', category: 'Main', amount: 380875 },
  { id: 'RCP-0040', name: 'Sweet Salad', category: 'Drink', amount: 242363 },
  { id: 'RCP-0041', name: 'Crispy Tart', category: 'Dessert', amount: 618073 },
  { id: 'RCP-0042', name: 'Savory Salad', category: 'Side', amount: 1090 },
  { id: 'RCP-0043', name: 'Grilled Noodles', category: 'Drink', amount: 558589 },
];

describe('RecipeTable filtering', () => {
  it('filters, sorts and pages through 17 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0037');
    await user.clear(filter);
    await user.type(filter, 'main');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0027');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0033');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0033');
  });
});
