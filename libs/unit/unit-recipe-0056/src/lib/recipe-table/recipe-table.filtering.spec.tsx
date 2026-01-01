import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0199', name: 'Sweet Waffle', category: 'Main', amount: 838602 },
  { id: 'RCP-0200', name: 'Savory Curry', category: 'Starter', amount: 13525 },
  { id: 'RCP-0201', name: 'Zesty Tart', category: 'Main', amount: 585716 },
  { id: 'RCP-0202', name: 'Crispy Stew', category: 'Side', amount: 476542 },
  { id: 'RCP-0203', name: 'Sweet Salad', category: 'Main', amount: 74519 },
  { id: 'RCP-0204', name: 'Zesty Tart', category: 'Drink', amount: 628356 },
  { id: 'RCP-0205', name: 'Creamy Salad', category: 'Side', amount: 603649 },
  { id: 'RCP-0206', name: 'Herbed Curry', category: 'Main', amount: 194369 },
  { id: 'RCP-0207', name: 'Grilled Noodles', category: 'Main', amount: 777016 },
  { id: 'RCP-0208', name: 'Smoky Salad', category: 'Starter', amount: 874666 },
  { id: 'RCP-0209', name: 'Spicy Noodles', category: 'Side', amount: 661935 },
  { id: 'RCP-0210', name: 'Sweet Sorbet', category: 'Main', amount: 677190 },
  { id: 'RCP-0211', name: 'Smoky Gratin', category: 'Starter', amount: 93829 },
  { id: 'RCP-0212', name: 'Zesty Gratin', category: 'Side', amount: 447086 },
  { id: 'RCP-0213', name: 'Crispy Tart', category: 'Drink', amount: 172912 },
];

describe('RecipeTable filtering', () => {
  it('filters, sorts and pages through 15 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0200');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0209');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0200');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0208');
    await user.clear(filter);
    await user.type(filter, 'riso');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'RCP-0206');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'RCP-0203');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'noo');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0208');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0206');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0208');
  });
});
