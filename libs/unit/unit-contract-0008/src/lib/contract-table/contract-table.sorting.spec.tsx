import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0369', name: 'Hosting Schedule', category: 'Draft', amount: 19893 },
  { id: 'CTR-0370', name: 'Supply Mandate', category: 'Draft', amount: 646063 },
  { id: 'CTR-0371', name: 'Service Waiver', category: 'Signed', amount: 984054 },
  { id: 'CTR-0372', name: 'Lease Accord', category: 'Signed', amount: 780583 },
  { id: 'CTR-0373', name: 'Service Annex', category: 'Draft', amount: 525053 },
  { id: 'CTR-0374', name: 'Supply Order', category: 'Signed', amount: 787768 },
  { id: 'CTR-0375', name: 'Reseller Order', category: 'Renewal', amount: 248551 },
  { id: 'CTR-0376', name: 'Pilot Charter', category: 'Expired', amount: 145529 },
  { id: 'CTR-0377', name: 'Service Addendum', category: 'Signed', amount: 757184 },
  { id: 'CTR-0378', name: 'Supply Agreement', category: 'Draft', amount: 840332 },
  { id: 'CTR-0379', name: 'Service Mandate', category: 'Renewal', amount: 133135 },
  { id: 'CTR-0380', name: 'Reseller Accord', category: 'Review', amount: 382105 },
  { id: 'CTR-0381', name: 'Hosting Schedule', category: 'Draft', amount: 409675 },
  { id: 'CTR-0382', name: 'Hosting Mandate', category: 'Signed', amount: 502215 },
  { id: 'CTR-0383', name: 'Service Schedule', category: 'Signed', amount: 898445 },
  { id: 'CTR-0384', name: 'Hosting Agreement', category: 'Expired', amount: 734138 },
  { id: 'CTR-0385', name: 'Master Mandate', category: 'Expired', amount: 84532 },
  { id: 'CTR-0386', name: 'Lease Schedule', category: 'Expired', amount: 852499 },
];

describe('ContractTable sorting', () => {
  it('filters, sorts and pages through 18 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'CTR-0380');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0369');
  });
});
