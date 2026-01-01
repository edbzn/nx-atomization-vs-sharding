import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0120', name: 'License Charter', category: 'Review', amount: 556937 },
  { id: 'CTR-0121', name: 'Reseller Schedule', category: 'Signed', amount: 708790 },
  { id: 'CTR-0122', name: 'Lease Addendum', category: 'Renewal', amount: 959482 },
  { id: 'CTR-0123', name: 'Reseller Accord', category: 'Renewal', amount: 856168 },
  { id: 'CTR-0124', name: 'Pilot Addendum', category: 'Expired', amount: 85426 },
  { id: 'CTR-0125', name: 'License Addendum', category: 'Expired', amount: 309561 },
  { id: 'CTR-0126', name: 'Master Waiver', category: 'Review', amount: 192505 },
  { id: 'CTR-0127', name: 'Lease Annex', category: 'Expired', amount: 382537 },
  { id: 'CTR-0128', name: 'Supply Accord', category: 'Expired', amount: 747081 },
  { id: 'CTR-0129', name: 'Supply Addendum', category: 'Review', amount: 963804 },
  { id: 'CTR-0130', name: 'Master Notice', category: 'Renewal', amount: 186582 },
  { id: 'CTR-0131', name: 'Hosting Order', category: 'Draft', amount: 115345 },
  { id: 'CTR-0132', name: 'Pilot Addendum', category: 'Renewal', amount: 882029 },
];

describe('ContractTable pagination', () => {
  it('filters, sorts and pages through 13 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'ctr-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0120');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-13 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0130');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0120');
  });
});
