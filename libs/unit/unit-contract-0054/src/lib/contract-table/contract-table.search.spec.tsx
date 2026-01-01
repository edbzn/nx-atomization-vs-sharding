import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0164', name: 'Lease Waiver', category: 'Renewal', amount: 349920 },
  { id: 'CTR-0165', name: 'Master Mandate', category: 'Signed', amount: 127075 },
  { id: 'CTR-0166', name: 'Escrow Mandate', category: 'Signed', amount: 213664 },
  { id: 'CTR-0167', name: 'Service Annex', category: 'Review', amount: 458406 },
  { id: 'CTR-0168', name: 'Supply Schedule', category: 'Renewal', amount: 971601 },
  { id: 'CTR-0169', name: 'Service Accord', category: 'Draft', amount: 423172 },
  { id: 'CTR-0170', name: 'Supply Annex', category: 'Review', amount: 966336 },
  { id: 'CTR-0171', name: 'Reseller Waiver', category: 'Draft', amount: 42927 },
  { id: 'CTR-0172', name: 'License Order', category: 'Signed', amount: 631427 },
  { id: 'CTR-0173', name: 'Framework Waiver', category: 'Renewal', amount: 543382 },
  { id: 'CTR-0174', name: 'Reseller Waiver', category: 'Renewal', amount: 242515 },
  { id: 'CTR-0175', name: 'Reseller Charter', category: 'Draft', amount: 808215 },
  { id: 'CTR-0176', name: 'Pilot Waiver', category: 'Draft', amount: 683392 },
  { id: 'CTR-0177', name: 'Supply Order', category: 'Renewal', amount: 247293 },
  { id: 'CTR-0178', name: 'Escrow Mandate', category: 'Expired', amount: 212085 },
  { id: 'CTR-0179', name: 'Reseller Order', category: 'Renewal', amount: 790956 },
];

describe('ContractTable search', () => {
  it('filters, sorts and pages through 16 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0164');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0164');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0166');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-16 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0174');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0168');
  });

  it('filters, sorts and pages through 16 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'mand');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    await user.type(filter, 'ctr-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0164');
  });
});
