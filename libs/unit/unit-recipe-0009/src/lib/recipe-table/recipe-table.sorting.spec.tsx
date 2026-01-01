import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0369', name: 'Creamy Waffle', category: 'Main', amount: 568722 },
  { id: 'RCP-0370', name: 'Savory Sorbet', category: 'Dessert', amount: 429780 },
  { id: 'RCP-0371', name: 'Creamy Sorbet', category: 'Dessert', amount: 282492 },
  { id: 'RCP-0372', name: 'Spicy Curry', category: 'Dessert', amount: 957069 },
  { id: 'RCP-0373', name: 'Creamy Gratin', category: 'Side', amount: 18757 },
  { id: 'RCP-0374', name: 'Crispy Waffle', category: 'Starter', amount: 281206 },
  { id: 'RCP-0375', name: 'Crispy Stew', category: 'Main', amount: 598577 },
  { id: 'RCP-0376', name: 'Savory Salad', category: 'Main', amount: 131793 },
  { id: 'RCP-0377', name: 'Spicy Risotto', category: 'Side', amount: 384009 },
  { id: 'RCP-0378', name: 'Roasted Salad', category: 'Side', amount: 140632 },
  { id: 'RCP-0379', name: 'Grilled Risotto', category: 'Side', amount: 377640 },
  { id: 'RCP-0380', name: 'Grilled Waffle', category: 'Main', amount: 193971 },
  { id: 'RCP-0381', name: 'Crispy Sorbet', category: 'Drink', amount: 330910 },
  { id: 'RCP-0382', name: 'Creamy Noodles', category: 'Drink', amount: 629206 },
  { id: 'RCP-0383', name: 'Roasted Salad', category: 'Drink', amount: 767870 },
  { id: 'RCP-0384', name: 'Grilled Noodles', category: 'Side', amount: 336538 },
  { id: 'RCP-0385', name: 'Spicy Waffle', category: 'Dessert', amount: 92014 },
  { id: 'RCP-0386', name: 'Roasted Curry', category: 'Side', amount: 645365 },
  { id: 'RCP-0387', name: 'Grilled Sorbet', category: 'Dessert', amount: 320779 },
];

describe('RecipeTable sorting', () => {
  it('filters, sorts and pages through 19 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'waffle');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0369');
    await user.clear(filter);
    await user.type(filter, 'Gril');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0373');
    await user.clear(filter);
    await user.type(filter, 'RCP-0374');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });
});
