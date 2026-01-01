import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0179', name: 'Hosting Mandate', category: 'Review', amount: 724683 },
  { id: 'CTR-0180', name: 'Hosting Order', category: 'Draft', amount: 896337 },
  { id: 'CTR-0181', name: 'Pilot Accord', category: 'Signed', amount: 336468 },
  { id: 'CTR-0182', name: 'License Charter', category: 'Expired', amount: 626070 },
  { id: 'CTR-0183', name: 'Service Mandate', category: 'Signed', amount: 261035 },
  { id: 'CTR-0184', name: 'Pilot Charter', category: 'Draft', amount: 935429 },
  { id: 'CTR-0185', name: 'Service Charter', category: 'Signed', amount: 782444 },
  { id: 'CTR-0186', name: 'Framework Agreement', category: 'Expired', amount: 984268 },
  { id: 'CTR-0187', name: 'Framework Schedule', category: 'Review', amount: 880479 },
  { id: 'CTR-0188', name: 'Escrow Schedule', category: 'Renewal', amount: 194658 },
  { id: 'CTR-0189', name: 'Master Accord', category: 'Expired', amount: 693245 },
  { id: 'CTR-0190', name: 'Hosting Notice', category: 'Renewal', amount: 525107 },
  { id: 'CTR-0191', name: 'Pilot Mandate', category: 'Review', amount: 53644 },
  { id: 'CTR-0192', name: 'Pilot Order', category: 'Signed', amount: 381500 },
  { id: 'CTR-0193', name: 'Lease Charter', category: 'Renewal', amount: 202788 },
  { id: 'CTR-0194', name: 'License Schedule', category: 'Review', amount: 847556 },
  { id: 'CTR-0195', name: 'Supply Waiver', category: 'Draft', amount: 293423 },
];

describe('ContractTable sorting', () => {
  it('filters, sorts and pages through 16 contracts', async () => {
    const rows = ROWS.slice(0, 16);
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'chart');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.clear(filter);
    await user.type(filter, 'renewal');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
  });
});
