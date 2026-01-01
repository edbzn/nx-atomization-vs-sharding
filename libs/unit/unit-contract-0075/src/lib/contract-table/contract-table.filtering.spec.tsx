import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0226', name: 'Master Accord', category: 'Expired', amount: 56836 },
  { id: 'CTR-0227', name: 'Framework Annex', category: 'Renewal', amount: 898363 },
  { id: 'CTR-0228', name: 'Service Order', category: 'Review', amount: 809713 },
  { id: 'CTR-0229', name: 'Service Schedule', category: 'Renewal', amount: 389923 },
  { id: 'CTR-0230', name: 'Framework Agreement', category: 'Renewal', amount: 778653 },
  { id: 'CTR-0231', name: 'Lease Mandate', category: 'Signed', amount: 611606 },
  { id: 'CTR-0232', name: 'Reseller Charter', category: 'Draft', amount: 453832 },
  { id: 'CTR-0233', name: 'Reseller Addendum', category: 'Signed', amount: 678142 },
  { id: 'CTR-0234', name: 'Reseller Charter', category: 'Signed', amount: 694889 },
  { id: 'CTR-0235', name: 'Supply Accord', category: 'Draft', amount: 717280 },
  { id: 'CTR-0236', name: 'Pilot Charter', category: 'Review', amount: 56107 },
  { id: 'CTR-0237', name: 'Hosting Order', category: 'Signed', amount: 861801 },
];

describe('ContractTable filtering', () => {
  it('filters, sorts and pages through 12 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0226');
    await user.clear(filter);
    await user.type(filter, 'sche');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0226');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0226');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0236');
  });

  it('filters, sorts and pages through 12 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-12 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0236');
    await user.clear(filter);
    await user.type(filter, 'annex');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0226');
  });
});
