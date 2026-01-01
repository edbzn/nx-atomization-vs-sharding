import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0177', name: 'Pilot Charter', category: 'Signed', amount: 996048 },
  { id: 'CTR-0178', name: 'Pilot Notice', category: 'Review', amount: 812906 },
  { id: 'CTR-0179', name: 'Pilot Accord', category: 'Expired', amount: 68713 },
  { id: 'CTR-0180', name: 'License Order', category: 'Signed', amount: 443132 },
  { id: 'CTR-0181', name: 'Hosting Order', category: 'Expired', amount: 750448 },
  { id: 'CTR-0182', name: 'Framework Waiver', category: 'Renewal', amount: 899866 },
  { id: 'CTR-0183', name: 'Master Charter', category: 'Draft', amount: 805477 },
  { id: 'CTR-0184', name: 'Service Schedule', category: 'Renewal', amount: 36572 },
  { id: 'CTR-0185', name: 'License Addendum', category: 'Draft', amount: 978547 },
  { id: 'CTR-0186', name: 'License Agreement', category: 'Draft', amount: 386497 },
  { id: 'CTR-0187', name: 'Pilot Notice', category: 'Draft', amount: 762681 },
  { id: 'CTR-0188', name: 'Master Charter', category: 'Signed', amount: 842939 },
  { id: 'CTR-0189', name: 'Pilot Schedule', category: 'Draft', amount: 88920 },
  { id: 'CTR-0190', name: 'Pilot Accord', category: 'Review', amount: 706285 },
  { id: 'CTR-0191', name: 'Supply Mandate', category: 'Renewal', amount: 954829 },
  { id: 'CTR-0192', name: 'Framework Notice', category: 'Signed', amount: 583685 },
  { id: 'CTR-0193', name: 'Lease Notice', category: 'Draft', amount: 1108 },
  { id: 'CTR-0194', name: 'Supply Order', category: 'Review', amount: 179392 },
  { id: 'CTR-0195', name: 'Lease Notice', category: 'Draft', amount: 827264 },
  { id: 'CTR-0196', name: 'Lease Accord', category: 'Draft', amount: 835782 },
];

describe('ContractTable filtering', () => {
  it('filters, sorts and pages through 20 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'CTR-0187');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'ctr-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0177');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0177');
  });
});
