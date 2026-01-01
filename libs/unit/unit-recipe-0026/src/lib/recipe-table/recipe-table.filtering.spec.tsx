import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0228', name: 'Zesty Salad', category: 'Main', amount: 199981 },
  { id: 'RCP-0229', name: 'Sweet Noodles', category: 'Main', amount: 306518 },
  { id: 'RCP-0230', name: 'Roasted Curry', category: 'Dessert', amount: 725929 },
  { id: 'RCP-0231', name: 'Spicy Gratin', category: 'Side', amount: 975397 },
  { id: 'RCP-0232', name: 'Roasted Tart', category: 'Main', amount: 703715 },
  { id: 'RCP-0233', name: 'Spicy Curry', category: 'Starter', amount: 694466 },
  { id: 'RCP-0234', name: 'Roasted Curry', category: 'Drink', amount: 974981 },
  { id: 'RCP-0235', name: 'Crispy Soup', category: 'Main', amount: 339905 },
  { id: 'RCP-0236', name: 'Herbed Waffle', category: 'Drink', amount: 680573 },
  { id: 'RCP-0237', name: 'Creamy Soup', category: 'Drink', amount: 176322 },
  { id: 'RCP-0238', name: 'Spicy Waffle', category: 'Main', amount: 868132 },
  { id: 'RCP-0239', name: 'Sweet Salad', category: 'Side', amount: 597205 },
  { id: 'RCP-0240', name: 'Savory Risotto', category: 'Side', amount: 763083 },
  { id: 'RCP-0241', name: 'Crispy Risotto', category: 'Side', amount: 784653 },
  { id: 'RCP-0242', name: 'Sweet Tart', category: 'Side', amount: 157765 },
  { id: 'RCP-0243', name: 'Roasted Noodles', category: 'Starter', amount: 698053 },
  { id: 'RCP-0244', name: 'Crispy Waffle', category: 'Starter', amount: 35245 },
  { id: 'RCP-0245', name: 'Roasted Waffle', category: 'Drink', amount: 964275 },
];

describe('RecipeTable filtering', () => {
  it('filters, sorts and pages through 18 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0238');
    await user.clear(filter);
    await user.type(filter, 'side');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0231');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0228');
  });

  it('filters, sorts and pages through 18 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0244');
    await user.clear(filter);
    await user.type(filter, 'Crea');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0237');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0237');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0228');
  });
});
