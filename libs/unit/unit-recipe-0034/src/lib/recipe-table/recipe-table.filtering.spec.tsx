import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0242', name: 'Sweet Sorbet', category: 'Dessert', amount: 999344 },
  { id: 'RCP-0243', name: 'Smoky Sorbet', category: 'Dessert', amount: 766645 },
  { id: 'RCP-0244', name: 'Zesty Noodles', category: 'Dessert', amount: 28629 },
  { id: 'RCP-0245', name: 'Spicy Noodles', category: 'Drink', amount: 299997 },
  { id: 'RCP-0246', name: 'Roasted Soup', category: 'Drink', amount: 560675 },
  { id: 'RCP-0247', name: 'Crispy Gratin', category: 'Dessert', amount: 523648 },
  { id: 'RCP-0248', name: 'Roasted Waffle', category: 'Drink', amount: 855040 },
  { id: 'RCP-0249', name: 'Grilled Gratin', category: 'Starter', amount: 156556 },
  { id: 'RCP-0250', name: 'Savory Stew', category: 'Side', amount: 742123 },
  { id: 'RCP-0251', name: 'Creamy Soup', category: 'Starter', amount: 380279 },
  { id: 'RCP-0252', name: 'Herbed Sorbet', category: 'Main', amount: 898624 },
  { id: 'RCP-0253', name: 'Spicy Curry', category: 'Main', amount: 453575 },
  { id: 'RCP-0254', name: 'Creamy Risotto', category: 'Dessert', amount: 813838 },
  { id: 'RCP-0255', name: 'Herbed Sorbet', category: 'Drink', amount: 448324 },
];

describe('RecipeTable filtering', () => {
  it('filters, sorts and pages through 14 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'risot');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0242');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0254');
  });
});
