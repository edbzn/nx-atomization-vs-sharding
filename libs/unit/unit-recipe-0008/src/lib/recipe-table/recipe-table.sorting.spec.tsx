import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0126', name: 'Grilled Curry', category: 'Main', amount: 800718 },
  { id: 'RCP-0127', name: 'Savory Soup', category: 'Dessert', amount: 233320 },
  { id: 'RCP-0128', name: 'Zesty Stew', category: 'Drink', amount: 345385 },
  { id: 'RCP-0129', name: 'Savory Sorbet', category: 'Dessert', amount: 719247 },
  { id: 'RCP-0130', name: 'Grilled Salad', category: 'Side', amount: 191990 },
  { id: 'RCP-0131', name: 'Grilled Risotto', category: 'Main', amount: 387069 },
  { id: 'RCP-0132', name: 'Crispy Tart', category: 'Main', amount: 296105 },
  { id: 'RCP-0133', name: 'Crispy Salad', category: 'Side', amount: 557758 },
  { id: 'RCP-0134', name: 'Smoky Soup', category: 'Main', amount: 275592 },
  { id: 'RCP-0135', name: 'Herbed Curry', category: 'Drink', amount: 530894 },
  { id: 'RCP-0136', name: 'Grilled Sorbet', category: 'Side', amount: 136450 },
  { id: 'RCP-0137', name: 'Herbed Noodles', category: 'Drink', amount: 177413 },
  { id: 'RCP-0138', name: 'Zesty Salad', category: 'Dessert', amount: 671142 },
  { id: 'RCP-0139', name: 'Creamy Noodles', category: 'Starter', amount: 599587 },
  { id: 'RCP-0140', name: 'Herbed Sorbet', category: 'Side', amount: 149205 },
  { id: 'RCP-0141', name: 'Herbed Risotto', category: 'Side', amount: 54252 },
  { id: 'RCP-0142', name: 'Roasted Risotto', category: 'Drink', amount: 251352 },
  { id: 'RCP-0143', name: 'Herbed Sorbet', category: 'Dessert', amount: 479921 },
  { id: 'RCP-0144', name: 'Herbed Salad', category: 'Dessert', amount: 767262 },
];

describe('RecipeTable sorting', () => {
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0136');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0136');
    await user.clear(filter);
    await user.type(filter, 'Cream');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0126');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0126');
    await user.clear(filter);
    await user.type(filter, 'Roast');
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
    await user.clear(filter);
    await user.type(filter, 'rcp-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'noo');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    await user.type(filter, 'noodle');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0126');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0139');
  });

  it('filters, sorts and pages through 15 recipes', async () => {
    const rows = ROWS.slice(0, 15);
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0139');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0139');
  });
});
