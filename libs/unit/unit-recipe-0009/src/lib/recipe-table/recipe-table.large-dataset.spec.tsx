import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0172', name: 'Creamy Curry', category: 'Dessert', amount: 828993 },
  { id: 'RCP-0173', name: 'Savory Risotto', category: 'Starter', amount: 342290 },
  { id: 'RCP-0174', name: 'Herbed Stew', category: 'Drink', amount: 704577 },
  { id: 'RCP-0175', name: 'Savory Sorbet', category: 'Main', amount: 448998 },
  { id: 'RCP-0176', name: 'Crispy Sorbet', category: 'Side', amount: 860629 },
  { id: 'RCP-0177', name: 'Roasted Noodles', category: 'Main', amount: 103235 },
  { id: 'RCP-0178', name: 'Savory Salad', category: 'Dessert', amount: 632860 },
  { id: 'RCP-0179', name: 'Herbed Noodles', category: 'Side', amount: 901943 },
  { id: 'RCP-0180', name: 'Roasted Risotto', category: 'Starter', amount: 213949 },
  { id: 'RCP-0181', name: 'Sweet Risotto', category: 'Dessert', amount: 218471 },
  { id: 'RCP-0182', name: 'Herbed Waffle', category: 'Drink', amount: 757204 },
  { id: 'RCP-0183', name: 'Spicy Waffle', category: 'Dessert', amount: 315425 },
];

describe('RecipeTable large dataset', () => {
  it('filters, sorts and pages through 12 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0172');
    await user.clear(filter);
    await user.type(filter, 'stew');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'ste');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
  });

  it('filters, sorts and pages through 12 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'salad');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0178');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0177');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-12 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0176');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0177');
  });
});
