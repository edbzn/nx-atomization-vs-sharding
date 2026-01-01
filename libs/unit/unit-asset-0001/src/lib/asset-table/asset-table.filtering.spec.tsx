import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0216', name: 'Shared Foxtrot', category: 'Printer', amount: 961315 },
  { id: 'AST-0217', name: 'New Juliet', category: 'Tablet', amount: 495770 },
  { id: 'AST-0218', name: 'Shared Golf', category: 'Monitor', amount: 564567 },
  { id: 'AST-0219', name: 'Retired Bravo', category: 'Printer', amount: 720346 },
  { id: 'AST-0220', name: 'Loaner Bravo', category: 'Phone', amount: 382008 },
  { id: 'AST-0221', name: 'Assigned India', category: 'Tablet', amount: 639191 },
  { id: 'AST-0222', name: 'Spare Echo', category: 'Phone', amount: 180674 },
  { id: 'AST-0223', name: 'Retired Juliet', category: 'Laptop', amount: 728237 },
  { id: 'AST-0224', name: 'Refurbished India', category: 'Monitor', amount: 596615 },
  { id: 'AST-0225', name: 'Reserved Juliet', category: 'Tablet', amount: 871999 },
  { id: 'AST-0226', name: 'Leased Echo', category: 'Phone', amount: 865796 },
  { id: 'AST-0227', name: 'Leased Juliet', category: 'Printer', amount: 340755 },
  { id: 'AST-0228', name: 'Loaner Bravo', category: 'Phone', amount: 1983 },
  { id: 'AST-0229', name: 'Loaner Delta', category: 'Tablet', amount: 280214 },
  { id: 'AST-0230', name: 'Refurbished Golf', category: 'Phone', amount: 627147 },
  { id: 'AST-0231', name: 'Assigned Juliet', category: 'Laptop', amount: 360214 },
];

describe('AssetTable filtering', () => {
  it('filters, sorts and pages through 16 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-16 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0226');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0216');
    await user.clear(filter);
    await user.type(filter, 'AST-0223');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0223');
  });
});
