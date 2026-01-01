import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0046', name: 'Zesty Risotto', category: 'Drink', amount: 999869 },
  { id: 'RCP-0047', name: 'Roasted Tart', category: 'Side', amount: 205227 },
  { id: 'RCP-0048', name: 'Smoky Waffle', category: 'Side', amount: 538461 },
  { id: 'RCP-0049', name: 'Creamy Tart', category: 'Main', amount: 554289 },
  { id: 'RCP-0050', name: 'Sweet Curry', category: 'Drink', amount: 136852 },
  { id: 'RCP-0051', name: 'Crispy Stew', category: 'Side', amount: 304887 },
  { id: 'RCP-0052', name: 'Roasted Curry', category: 'Side', amount: 398320 },
  { id: 'RCP-0053', name: 'Creamy Curry', category: 'Dessert', amount: 686548 },
  { id: 'RCP-0054', name: 'Spicy Sorbet', category: 'Side', amount: 184056 },
  { id: 'RCP-0055', name: 'Sweet Noodles', category: 'Main', amount: 906141 },
  { id: 'RCP-0056', name: 'Zesty Salad', category: 'Main', amount: 902651 },
  { id: 'RCP-0057', name: 'Creamy Stew', category: 'Starter', amount: 660988 },
  { id: 'RCP-0058', name: 'Savory Salad', category: 'Drink', amount: 868018 },
  { id: 'RCP-0059', name: 'Zesty Tart', category: 'Main', amount: 442451 },
  { id: 'RCP-0060', name: 'Herbed Risotto', category: 'Drink', amount: 787411 },
  { id: 'RCP-0061', name: 'Creamy Gratin', category: 'Side', amount: 301424 },
  { id: 'RCP-0062', name: 'Sweet Soup', category: 'Starter', amount: 184788 },
  { id: 'RCP-0063', name: 'Smoky Curry', category: 'Starter', amount: 363045 },
  { id: 'RCP-0064', name: 'Savory Curry', category: 'Dessert', amount: 961222 },
  { id: 'RCP-0065', name: 'Smoky Soup', category: 'Main', amount: 496638 },
];

describe('RecipeTable sorting', () => {
  it('filters, sorts and pages through 20 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0046');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-20 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0056');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-20 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0056');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0046');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-20 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0056');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0046');
    await user.clear(filter);
    await user.type(filter, 'Roa');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
  });
});
