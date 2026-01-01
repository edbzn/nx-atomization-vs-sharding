import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0076', name: 'Sweet Stew', category: 'Main', amount: 602290 },
  { id: 'RCP-0077', name: 'Spicy Noodles', category: 'Side', amount: 787544 },
  { id: 'RCP-0078', name: 'Sweet Sorbet', category: 'Side', amount: 231820 },
  { id: 'RCP-0079', name: 'Grilled Gratin', category: 'Main', amount: 458909 },
  { id: 'RCP-0080', name: 'Spicy Gratin', category: 'Side', amount: 256824 },
  { id: 'RCP-0081', name: 'Grilled Soup', category: 'Side', amount: 531633 },
  { id: 'RCP-0082', name: 'Roasted Salad', category: 'Drink', amount: 297965 },
  { id: 'RCP-0083', name: 'Roasted Waffle', category: 'Starter', amount: 319762 },
  { id: 'RCP-0084', name: 'Roasted Sorbet', category: 'Main', amount: 278908 },
  { id: 'RCP-0085', name: 'Roasted Noodles', category: 'Dessert', amount: 645049 },
  { id: 'RCP-0086', name: 'Herbed Gratin', category: 'Drink', amount: 865733 },
  { id: 'RCP-0087', name: 'Roasted Noodles', category: 'Side', amount: 435692 },
  { id: 'RCP-0088', name: 'Sweet Sorbet', category: 'Dessert', amount: 365703 },
  { id: 'RCP-0089', name: 'Savory Tart', category: 'Dessert', amount: 795323 },
  { id: 'RCP-0090', name: 'Zesty Sorbet', category: 'Dessert', amount: 545461 },
  { id: 'RCP-0091', name: 'Savory Soup', category: 'Side', amount: 415048 },
  { id: 'RCP-0092', name: 'Smoky Sorbet', category: 'Main', amount: 353630 },
  { id: 'RCP-0093', name: 'Smoky Risotto', category: 'Starter', amount: 961673 },
  { id: 'RCP-0094', name: 'Smoky Curry', category: 'Side', amount: 375847 },
];

describe('RecipeTable filtering', () => {
  it('filters, sorts and pages through 19 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'Zest');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0076');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0076');
  });

  it('filters, sorts and pages through 19 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'RCP-0085');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'Cris');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'dessert');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0088');
    await user.clear(filter);
    await user.type(filter, 'RCP-0079');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });

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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0086');
    await user.clear(filter);
    await user.type(filter, 'starter');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
  });
});
