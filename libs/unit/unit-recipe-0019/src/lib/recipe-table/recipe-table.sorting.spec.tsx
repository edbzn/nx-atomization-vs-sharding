import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0306', name: 'Smoky Stew', category: 'Side', amount: 198739 },
  { id: 'RCP-0307', name: 'Herbed Gratin', category: 'Drink', amount: 896008 },
  { id: 'RCP-0308', name: 'Crispy Sorbet', category: 'Drink', amount: 740412 },
  { id: 'RCP-0309', name: 'Herbed Waffle', category: 'Dessert', amount: 833549 },
  { id: 'RCP-0310', name: 'Zesty Stew', category: 'Starter', amount: 714780 },
  { id: 'RCP-0311', name: 'Crispy Noodles', category: 'Drink', amount: 805247 },
  { id: 'RCP-0312', name: 'Crispy Stew', category: 'Main', amount: 639753 },
  { id: 'RCP-0313', name: 'Spicy Tart', category: 'Dessert', amount: 759932 },
  { id: 'RCP-0314', name: 'Crispy Risotto', category: 'Dessert', amount: 539535 },
  { id: 'RCP-0315', name: 'Creamy Waffle', category: 'Drink', amount: 752079 },
  { id: 'RCP-0316', name: 'Herbed Sorbet', category: 'Starter', amount: 461044 },
  { id: 'RCP-0317', name: 'Grilled Tart', category: 'Side', amount: 549039 },
  { id: 'RCP-0318', name: 'Roasted Risotto', category: 'Drink', amount: 847355 },
  { id: 'RCP-0319', name: 'Smoky Salad', category: 'Main', amount: 880855 },
  { id: 'RCP-0320', name: 'Herbed Soup', category: 'Side', amount: 19180 },
  { id: 'RCP-0321', name: 'Grilled Curry', category: 'Dessert', amount: 750053 },
];

describe('RecipeTable sorting', () => {
  it('filters, sorts and pages through 16 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0320');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-16 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0313');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0320');
    await user.clear(filter);
    await user.type(filter, 'drink');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
  });

  it('filters, sorts and pages through 16 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0306');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-16 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0316');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0315');
  });
});
