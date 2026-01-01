import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetTable } from './AssetTable';
import type { AssetRow } from '../types';

const ROWS: AssetRow[] = [
  { id: 'AST-0394', name: 'Leased Charlie', category: 'Monitor', amount: 431051 },
  { id: 'AST-0395', name: 'Leased Delta', category: 'Laptop', amount: 280845 },
  { id: 'AST-0396', name: 'Spare Echo', category: 'Printer', amount: 790909 },
  { id: 'AST-0397', name: 'Assigned Delta', category: 'Laptop', amount: 823665 },
  { id: 'AST-0398', name: 'Leased Charlie', category: 'Tablet', amount: 674850 },
  { id: 'AST-0399', name: 'Repaired Hotel', category: 'Laptop', amount: 229276 },
  { id: 'AST-0400', name: 'New Echo', category: 'Tablet', amount: 181578 },
  { id: 'AST-0401', name: 'Leased Hotel', category: 'Tablet', amount: 642871 },
  { id: 'AST-0402', name: 'Leased Delta', category: 'Laptop', amount: 703635 },
  { id: 'AST-0403', name: 'Refurbished Bravo', category: 'Laptop', amount: 710564 },
  { id: 'AST-0404', name: 'Shared Foxtrot', category: 'Monitor', amount: 105002 },
  { id: 'AST-0405', name: 'Spare Echo', category: 'Laptop', amount: 637979 },
  { id: 'AST-0406', name: 'Repaired Bravo', category: 'Tablet', amount: 826360 },
  { id: 'AST-0407', name: 'Refurbished Foxtrot', category: 'Tablet', amount: 142033 },
  { id: 'AST-0408', name: 'Refurbished Golf', category: 'Phone', amount: 681600 },
  { id: 'AST-0409', name: 'Shared India', category: 'Laptop', amount: 668774 },
  { id: 'AST-0410', name: 'Spare Bravo', category: 'Tablet', amount: 656913 },
  { id: 'AST-0411', name: 'Refurbished Foxtrot', category: 'Monitor', amount: 630842 },
];

describe('AssetTable search', () => {
  it('filters, sorts and pages through 18 assets', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<AssetTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0404');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0394');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('AST-0394');
  });
});
