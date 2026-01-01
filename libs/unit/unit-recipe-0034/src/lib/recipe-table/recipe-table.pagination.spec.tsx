import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0095', name: 'Creamy Sorbet', category: 'Drink', amount: 710887 },
  { id: 'RCP-0096', name: 'Creamy Risotto', category: 'Side', amount: 496572 },
  { id: 'RCP-0097', name: 'Herbed Noodles', category: 'Main', amount: 784385 },
  { id: 'RCP-0098', name: 'Roasted Salad', category: 'Side', amount: 967211 },
  { id: 'RCP-0099', name: 'Roasted Curry', category: 'Starter', amount: 717887 },
  { id: 'RCP-0100', name: 'Zesty Soup', category: 'Drink', amount: 892135 },
  { id: 'RCP-0101', name: 'Crispy Sorbet', category: 'Main', amount: 580905 },
  { id: 'RCP-0102', name: 'Sweet Risotto', category: 'Main', amount: 409465 },
  { id: 'RCP-0103', name: 'Sweet Noodles', category: 'Side', amount: 880976 },
  { id: 'RCP-0104', name: 'Smoky Soup', category: 'Dessert', amount: 843803 },
  { id: 'RCP-0105', name: 'Savory Curry', category: 'Starter', amount: 644937 },
  { id: 'RCP-0106', name: 'Crispy Gratin', category: 'Main', amount: 928617 },
  { id: 'RCP-0107', name: 'Spicy Waffle', category: 'Side', amount: 140764 },
  { id: 'RCP-0108', name: 'Roasted Soup', category: 'Drink', amount: 881842 },
  { id: 'RCP-0109', name: 'Sweet Soup', category: 'Side', amount: 587822 },
  { id: 'RCP-0110', name: 'Creamy Noodles', category: 'Starter', amount: 832560 },
  { id: 'RCP-0111', name: 'Savory Gratin', category: 'Main', amount: 730486 },
  { id: 'RCP-0112', name: 'Grilled Soup', category: 'Main', amount: 790167 },
  { id: 'RCP-0113', name: 'Spicy Stew', category: 'Dessert', amount: 945284 },
];

describe('RecipeTable pagination', () => {
  it('filters, sorts and pages through 19 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0105');
    await user.clear(filter);
    await user.type(filter, 'Cre');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    await user.type(filter, 'sou');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
  });

  it('filters, sorts and pages through 19 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0095');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0095');
    await user.clear(filter);
    await user.type(filter, 'drink');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
  });
});
