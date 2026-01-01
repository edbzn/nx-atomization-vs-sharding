import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0309', name: 'Roasted Sorbet', category: 'Starter', amount: 902086 },
  { id: 'RCP-0310', name: 'Roasted Waffle', category: 'Dessert', amount: 531919 },
  { id: 'RCP-0311', name: 'Spicy Risotto', category: 'Drink', amount: 733090 },
  { id: 'RCP-0312', name: 'Zesty Tart', category: 'Main', amount: 769819 },
  { id: 'RCP-0313', name: 'Grilled Gratin', category: 'Side', amount: 532671 },
  { id: 'RCP-0314', name: 'Zesty Risotto', category: 'Drink', amount: 589162 },
  { id: 'RCP-0315', name: 'Roasted Soup', category: 'Side', amount: 658174 },
  { id: 'RCP-0316', name: 'Smoky Risotto', category: 'Drink', amount: 472382 },
  { id: 'RCP-0317', name: 'Creamy Noodles', category: 'Starter', amount: 325845 },
  { id: 'RCP-0318', name: 'Sweet Gratin', category: 'Side', amount: 848770 },
  { id: 'RCP-0319', name: 'Smoky Salad', category: 'Starter', amount: 458457 },
  { id: 'RCP-0320', name: 'Roasted Curry', category: 'Starter', amount: 390603 },
  { id: 'RCP-0321', name: 'Herbed Noodles', category: 'Dessert', amount: 239814 },
  { id: 'RCP-0322', name: 'Savory Noodles', category: 'Starter', amount: 13203 },
  { id: 'RCP-0323', name: 'Roasted Salad', category: 'Main', amount: 714577 },
  { id: 'RCP-0324', name: 'Grilled Soup', category: 'Side', amount: 588054 },
  { id: 'RCP-0325', name: 'Savory Curry', category: 'Dessert', amount: 963948 },
  { id: 'RCP-0326', name: 'Creamy Stew', category: 'Dessert', amount: 79068 },
];

describe('RecipeTable filtering', () => {
  it('filters, sorts and pages through 18 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'noodl');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0309');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0317');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0325');
  });
});
