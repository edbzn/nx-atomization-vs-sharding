import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0103', name: 'Spicy Stew', category: 'Dessert', amount: 262666 },
  { id: 'RCP-0104', name: 'Roasted Salad', category: 'Side', amount: 322579 },
  { id: 'RCP-0105', name: 'Herbed Soup', category: 'Drink', amount: 717446 },
  { id: 'RCP-0106', name: 'Grilled Salad', category: 'Side', amount: 554050 },
  { id: 'RCP-0107', name: 'Herbed Stew', category: 'Dessert', amount: 57520 },
  { id: 'RCP-0108', name: 'Zesty Stew', category: 'Side', amount: 620048 },
  { id: 'RCP-0109', name: 'Zesty Noodles', category: 'Starter', amount: 151321 },
  { id: 'RCP-0110', name: 'Creamy Stew', category: 'Starter', amount: 133834 },
  { id: 'RCP-0111', name: 'Sweet Noodles', category: 'Starter', amount: 428 },
  { id: 'RCP-0112', name: 'Roasted Risotto', category: 'Drink', amount: 840789 },
  { id: 'RCP-0113', name: 'Creamy Tart', category: 'Dessert', amount: 554973 },
  { id: 'RCP-0114', name: 'Herbed Curry', category: 'Main', amount: 692857 },
  { id: 'RCP-0115', name: 'Smoky Soup', category: 'Drink', amount: 272013 },
  { id: 'RCP-0116', name: 'Sweet Soup', category: 'Dessert', amount: 101295 },
  { id: 'RCP-0117', name: 'Savory Stew', category: 'Main', amount: 762413 },
  { id: 'RCP-0118', name: 'Savory Soup', category: 'Main', amount: 872429 },
  { id: 'RCP-0119', name: 'Herbed Soup', category: 'Drink', amount: 496996 },
  { id: 'RCP-0120', name: 'Creamy Waffle', category: 'Dessert', amount: 742333 },
  { id: 'RCP-0121', name: 'Zesty Sorbet', category: 'Drink', amount: 668271 },
];

describe('RecipeTable sorting', () => {
  it('filters, sorts and pages through 19 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0111');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0110');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0118');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0110');
    await user.clear(filter);
    await user.type(filter, 'sorbet');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });

  it('filters, sorts and pages through 18 recipes', async () => {
    const rows = ROWS.slice(0, 18);
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'curry');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0114');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0111');
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0103');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0111');
  });
});
