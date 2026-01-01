import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0031', name: 'Spicy Stew', category: 'Dessert', amount: 503340 },
  { id: 'RCP-0032', name: 'Roasted Gratin', category: 'Side', amount: 31656 },
  { id: 'RCP-0033', name: 'Creamy Salad', category: 'Dessert', amount: 137714 },
  { id: 'RCP-0034', name: 'Sweet Noodles', category: 'Dessert', amount: 164854 },
  { id: 'RCP-0035', name: 'Zesty Sorbet', category: 'Dessert', amount: 209070 },
  { id: 'RCP-0036', name: 'Savory Stew', category: 'Drink', amount: 319787 },
  { id: 'RCP-0037', name: 'Crispy Risotto', category: 'Main', amount: 812777 },
  { id: 'RCP-0038', name: 'Zesty Risotto', category: 'Starter', amount: 823057 },
  { id: 'RCP-0039', name: 'Grilled Tart', category: 'Side', amount: 654688 },
  { id: 'RCP-0040', name: 'Herbed Salad', category: 'Main', amount: 717422 },
  { id: 'RCP-0041', name: 'Grilled Waffle', category: 'Starter', amount: 471009 },
  { id: 'RCP-0042', name: 'Crispy Gratin', category: 'Starter', amount: 526657 },
  { id: 'RCP-0043', name: 'Zesty Stew', category: 'Drink', amount: 908299 },
  { id: 'RCP-0044', name: 'Savory Soup', category: 'Starter', amount: 907647 },
  { id: 'RCP-0045', name: 'Zesty Noodles', category: 'Side', amount: 958090 },
  { id: 'RCP-0046', name: 'Spicy Gratin', category: 'Main', amount: 874325 },
  { id: 'RCP-0047', name: 'Herbed Waffle', category: 'Starter', amount: 640630 },
];

describe('RecipeTable sorting', () => {
  it('filters, sorts and pages through 17 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0041');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0031');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0041');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0031');
  });

  it('filters, sorts and pages through 17 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0041');
    await user.clear(filter);
    await user.type(filter, 'main');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    await user.type(filter, 'RCP-0039');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0031');
    await user.clear(filter);
    await user.type(filter, 'side');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    await user.type(filter, 'side');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0031');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0041');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0041');
  });
});
