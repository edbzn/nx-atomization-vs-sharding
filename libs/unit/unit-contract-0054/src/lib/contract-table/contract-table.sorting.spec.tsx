import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0128', name: 'Hosting Accord', category: 'Renewal', amount: 792001 },
  { id: 'CTR-0129', name: 'Lease Mandate', category: 'Expired', amount: 845516 },
  { id: 'CTR-0130', name: 'Master Addendum', category: 'Expired', amount: 680395 },
  { id: 'CTR-0131', name: 'Framework Annex', category: 'Draft', amount: 734762 },
  { id: 'CTR-0132', name: 'License Notice', category: 'Signed', amount: 256348 },
  { id: 'CTR-0133', name: 'Reseller Accord', category: 'Renewal', amount: 648603 },
  { id: 'CTR-0134', name: 'Reseller Notice', category: 'Draft', amount: 245982 },
  { id: 'CTR-0135', name: 'Pilot Mandate', category: 'Signed', amount: 511536 },
  { id: 'CTR-0136', name: 'Hosting Schedule', category: 'Signed', amount: 894301 },
  { id: 'CTR-0137', name: 'Supply Accord', category: 'Draft', amount: 694956 },
  { id: 'CTR-0138', name: 'Master Addendum', category: 'Signed', amount: 84212 },
  { id: 'CTR-0139', name: 'Pilot Charter', category: 'Review', amount: 119112 },
  { id: 'CTR-0140', name: 'Escrow Schedule', category: 'Renewal', amount: 692905 },
  { id: 'CTR-0141', name: 'Supply Annex', category: 'Renewal', amount: 714736 },
  { id: 'CTR-0142', name: 'Pilot Agreement', category: 'Signed', amount: 946819 },
];

describe('ContractTable sorting', () => {
  it('filters, sorts and pages through 15 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'CTR-0132');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0132');
    await user.clear(filter);
    await user.type(filter, 'expired');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
  });
});
