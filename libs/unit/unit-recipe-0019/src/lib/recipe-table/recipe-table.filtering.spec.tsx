import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0298', name: 'Zesty Curry', category: 'Drink', amount: 635076 },
  { id: 'RCP-0299', name: 'Creamy Risotto', category: 'Starter', amount: 691794 },
  { id: 'RCP-0300', name: 'Herbed Stew', category: 'Side', amount: 797652 },
  { id: 'RCP-0301', name: 'Smoky Stew', category: 'Main', amount: 72745 },
  { id: 'RCP-0302', name: 'Sweet Salad', category: 'Main', amount: 631663 },
  { id: 'RCP-0303', name: 'Herbed Gratin', category: 'Side', amount: 510035 },
  { id: 'RCP-0304', name: 'Spicy Tart', category: 'Starter', amount: 446545 },
  { id: 'RCP-0305', name: 'Zesty Gratin', category: 'Drink', amount: 999918 },
  { id: 'RCP-0306', name: 'Sweet Salad', category: 'Drink', amount: 692582 },
  { id: 'RCP-0307', name: 'Savory Sorbet', category: 'Starter', amount: 504628 },
  { id: 'RCP-0308', name: 'Smoky Sorbet', category: 'Drink', amount: 32698 },
  { id: 'RCP-0309', name: 'Spicy Curry', category: 'Starter', amount: 606240 },
  { id: 'RCP-0310', name: 'Herbed Waffle', category: 'Starter', amount: 339128 },
  { id: 'RCP-0311', name: 'Sweet Risotto', category: 'Drink', amount: 118743 },
  { id: 'RCP-0312', name: 'Zesty Tart', category: 'Drink', amount: 455360 },
  { id: 'RCP-0313', name: 'Zesty Noodles', category: 'Side', amount: 964505 },
  { id: 'RCP-0314', name: 'Grilled Gratin', category: 'Side', amount: 487004 },
];

describe('RecipeTable filtering', () => {
  it('filters, sorts and pages through 17 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0299');
    await user.clear(filter);
    await user.type(filter, 'gratin');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0299');
  });
});
