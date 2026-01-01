import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0073', name: 'Roasted Risotto', category: 'Side', amount: 744275 },
  { id: 'RCP-0074', name: 'Creamy Sorbet', category: 'Drink', amount: 882543 },
  { id: 'RCP-0075', name: 'Smoky Sorbet', category: 'Side', amount: 895069 },
  { id: 'RCP-0076', name: 'Crispy Tart', category: 'Starter', amount: 333141 },
  { id: 'RCP-0077', name: 'Smoky Tart', category: 'Dessert', amount: 144907 },
  { id: 'RCP-0078', name: 'Sweet Tart', category: 'Main', amount: 107137 },
  { id: 'RCP-0079', name: 'Smoky Gratin', category: 'Drink', amount: 699473 },
  { id: 'RCP-0080', name: 'Creamy Risotto', category: 'Starter', amount: 303585 },
  { id: 'RCP-0081', name: 'Roasted Risotto', category: 'Drink', amount: 857687 },
  { id: 'RCP-0082', name: 'Creamy Soup', category: 'Dessert', amount: 806199 },
  { id: 'RCP-0083', name: 'Zesty Risotto', category: 'Starter', amount: 192317 },
  { id: 'RCP-0084', name: 'Crispy Tart', category: 'Drink', amount: 534932 },
  { id: 'RCP-0085', name: 'Herbed Waffle', category: 'Starter', amount: 23185 },
  { id: 'RCP-0086', name: 'Creamy Tart', category: 'Starter', amount: 917226 },
  { id: 'RCP-0087', name: 'Sweet Waffle', category: 'Dessert', amount: 955279 },
  { id: 'RCP-0088', name: 'Crispy Gratin', category: 'Drink', amount: 806605 },
  { id: 'RCP-0089', name: 'Herbed Tart', category: 'Dessert', amount: 121735 },
];

describe('RecipeTable sorting', () => {
  it('filters, sorts and pages through 17 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0073');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0083');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0073');
    await user.clear(filter);
    await user.type(filter, 'rcp-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0073');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0083');
  });

  it('filters, sorts and pages through 17 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'rcp-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0073');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0083');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0073');
  });
});
