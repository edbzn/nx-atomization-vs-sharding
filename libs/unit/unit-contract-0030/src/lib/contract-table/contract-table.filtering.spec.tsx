import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0182', name: 'Reseller Addendum', category: 'Draft', amount: 221234 },
  { id: 'CTR-0183', name: 'Service Notice', category: 'Renewal', amount: 426133 },
  { id: 'CTR-0184', name: 'Lease Agreement', category: 'Draft', amount: 108303 },
  { id: 'CTR-0185', name: 'License Agreement', category: 'Renewal', amount: 820403 },
  { id: 'CTR-0186', name: 'Service Agreement', category: 'Renewal', amount: 945332 },
  { id: 'CTR-0187', name: 'Lease Accord', category: 'Signed', amount: 627950 },
  { id: 'CTR-0188', name: 'Service Schedule', category: 'Draft', amount: 290367 },
  { id: 'CTR-0189', name: 'Lease Accord', category: 'Renewal', amount: 579044 },
  { id: 'CTR-0190', name: 'Reseller Agreement', category: 'Draft', amount: 132113 },
  { id: 'CTR-0191', name: 'Supply Notice', category: 'Review', amount: 903802 },
  { id: 'CTR-0192', name: 'License Mandate', category: 'Expired', amount: 14687 },
  { id: 'CTR-0193', name: 'Escrow Addendum', category: 'Signed', amount: 797265 },
  { id: 'CTR-0194', name: 'Framework Waiver', category: 'Draft', amount: 55356 },
];

describe('ContractTable filtering', () => {
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
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0182');
  });
});
