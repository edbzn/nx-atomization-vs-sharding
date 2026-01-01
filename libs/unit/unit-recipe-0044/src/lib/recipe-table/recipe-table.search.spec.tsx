import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0171', name: 'Creamy Sorbet', category: 'Main', amount: 661447 },
  { id: 'RCP-0172', name: 'Grilled Stew', category: 'Drink', amount: 30931 },
  { id: 'RCP-0173', name: 'Roasted Soup', category: 'Main', amount: 304486 },
  { id: 'RCP-0174', name: 'Smoky Salad', category: 'Main', amount: 180582 },
  { id: 'RCP-0175', name: 'Savory Tart', category: 'Side', amount: 590887 },
  { id: 'RCP-0176', name: 'Creamy Noodles', category: 'Drink', amount: 696717 },
  { id: 'RCP-0177', name: 'Zesty Salad', category: 'Main', amount: 51713 },
  { id: 'RCP-0178', name: 'Spicy Sorbet', category: 'Drink', amount: 771615 },
  { id: 'RCP-0179', name: 'Smoky Salad', category: 'Starter', amount: 500845 },
  { id: 'RCP-0180', name: 'Herbed Gratin', category: 'Drink', amount: 362657 },
  { id: 'RCP-0181', name: 'Smoky Soup', category: 'Drink', amount: 342772 },
  { id: 'RCP-0182', name: 'Grilled Curry', category: 'Drink', amount: 72696 },
];

describe('RecipeTable search', () => {
  it('filters, sorts and pages through 12 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0172');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-12 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0176');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0176');
    await user.clear(filter);
    await user.type(filter, 'Smoky');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
  });
});
