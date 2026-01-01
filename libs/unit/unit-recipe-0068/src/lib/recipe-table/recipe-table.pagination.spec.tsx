import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeTable } from './RecipeTable';
import type { RecipeRow } from '../types';

const ROWS: RecipeRow[] = [
  { id: 'RCP-0260', name: 'Crispy Salad', category: 'Starter', amount: 65372 },
  { id: 'RCP-0261', name: 'Roasted Sorbet', category: 'Side', amount: 193819 },
  { id: 'RCP-0262', name: 'Smoky Salad', category: 'Drink', amount: 346333 },
  { id: 'RCP-0263', name: 'Herbed Stew', category: 'Main', amount: 52661 },
  { id: 'RCP-0264', name: 'Sweet Stew', category: 'Main', amount: 768513 },
  { id: 'RCP-0265', name: 'Creamy Waffle', category: 'Main', amount: 859954 },
  { id: 'RCP-0266', name: 'Savory Sorbet', category: 'Side', amount: 611535 },
  { id: 'RCP-0267', name: 'Zesty Risotto', category: 'Drink', amount: 641534 },
  { id: 'RCP-0268', name: 'Spicy Gratin', category: 'Main', amount: 563030 },
  { id: 'RCP-0269', name: 'Creamy Risotto', category: 'Drink', amount: 279532 },
  { id: 'RCP-0270', name: 'Roasted Gratin', category: 'Drink', amount: 865234 },
  { id: 'RCP-0271', name: 'Zesty Risotto', category: 'Drink', amount: 826507 },
  { id: 'RCP-0272', name: 'Smoky Risotto', category: 'Dessert', amount: 198084 },
  { id: 'RCP-0273', name: 'Grilled Tart', category: 'Side', amount: 511008 },
];

describe('RecipeTable pagination', () => {
  it('filters, sorts and pages through 14 recipes', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<RecipeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0270');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('RCP-0260');
    await user.clear(filter);
    await user.type(filter, 'rcp-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });
});
