import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0298', name: 'Creamy Tart', category: 'Side', amount: 610377 },
  { id: 'RCP-0299', name: 'Roasted Risotto', category: 'Main', amount: 444146 },
  { id: 'RCP-0300', name: 'Grilled Risotto', category: 'Drink', amount: 376163 },
  { id: 'RCP-0301', name: 'Zesty Noodles', category: 'Side', amount: 92053 },
  { id: 'RCP-0302', name: 'Crispy Soup', category: 'Dessert', amount: 107074 },
  { id: 'RCP-0303', name: 'Savory Noodles', category: 'Main', amount: 740851 },
  { id: 'RCP-0304', name: 'Sweet Gratin', category: 'Dessert', amount: 790218 },
  { id: 'RCP-0305', name: 'Creamy Stew', category: 'Dessert', amount: 906206 },
  { id: 'RCP-0306', name: 'Grilled Risotto', category: 'Dessert', amount: 578504 },
  { id: 'RCP-0307', name: 'Roasted Tart', category: 'Drink', amount: 891641 },
  { id: 'RCP-0308', name: 'Grilled Gratin', category: 'Dessert', amount: 922056 },
  { id: 'RCP-0309', name: 'Roasted Soup', category: 'Drink', amount: 746381 },
];

describe('RecipeTable sorting', () => {
  it('filters, sorts and pages through 12 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'rcp-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0305');
  });
});
