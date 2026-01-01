import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0105', name: 'Sweet Curry', category: 'Dessert', amount: 479279 },
  { id: 'RCP-0106', name: 'Herbed Waffle', category: 'Drink', amount: 435557 },
  { id: 'RCP-0107', name: 'Smoky Stew', category: 'Side', amount: 948310 },
  { id: 'RCP-0108', name: 'Sweet Risotto', category: 'Side', amount: 703632 },
  { id: 'RCP-0109', name: 'Roasted Gratin', category: 'Side', amount: 222638 },
  { id: 'RCP-0110', name: 'Savory Stew', category: 'Starter', amount: 714886 },
  { id: 'RCP-0111', name: 'Savory Tart', category: 'Drink', amount: 372062 },
  { id: 'RCP-0112', name: 'Smoky Soup', category: 'Drink', amount: 843130 },
  { id: 'RCP-0113', name: 'Herbed Gratin', category: 'Dessert', amount: 130248 },
  { id: 'RCP-0114', name: 'Spicy Sorbet', category: 'Main', amount: 225747 },
  { id: 'RCP-0115', name: 'Smoky Gratin', category: 'Dessert', amount: 793325 },
  { id: 'RCP-0116', name: 'Creamy Waffle', category: 'Side', amount: 669476 },
  { id: 'RCP-0117', name: 'Sweet Risotto', category: 'Side', amount: 723830 },
];

describe('RecipeTable pagination', () => {
  it('filters, sorts and pages through 13 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0113');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-13 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0115');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0113');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0113');
    await user.clear(filter);
    await user.type(filter, 'Savo');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0113');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0113');
    await user.clear(filter);
    await user.type(filter, 'RCP-0115');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'waffle');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    await user.type(filter, 'rcp-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0113');
    await user.clear(filter);
    await user.type(filter, 'rcp-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });
});
