import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0115', name: 'Pilot Accord', category: 'Review', amount: 691282 },
  { id: 'CTR-0116', name: 'Lease Mandate', category: 'Draft', amount: 618724 },
  { id: 'CTR-0117', name: 'Pilot Accord', category: 'Draft', amount: 186905 },
  { id: 'CTR-0118', name: 'Hosting Mandate', category: 'Draft', amount: 87865 },
  { id: 'CTR-0119', name: 'Supply Mandate', category: 'Review', amount: 882122 },
  { id: 'CTR-0120', name: 'Escrow Schedule', category: 'Draft', amount: 845064 },
  { id: 'CTR-0121', name: 'Escrow Notice', category: 'Renewal', amount: 13160 },
  { id: 'CTR-0122', name: 'Reseller Waiver', category: 'Renewal', amount: 971774 },
  { id: 'CTR-0123', name: 'Framework Agreement', category: 'Signed', amount: 528460 },
  { id: 'CTR-0124', name: 'Reseller Annex', category: 'Expired', amount: 602105 },
  { id: 'CTR-0125', name: 'Hosting Waiver', category: 'Signed', amount: 707837 },
  { id: 'CTR-0126', name: 'Reseller Agreement', category: 'Renewal', amount: 226035 },
  { id: 'CTR-0127', name: 'Master Annex', category: 'Expired', amount: 602072 },
  { id: 'CTR-0128', name: 'Reseller Agreement', category: 'Signed', amount: 835688 },
  { id: 'CTR-0129', name: 'License Charter', category: 'Signed', amount: 868577 },
  { id: 'CTR-0130', name: 'Service Addendum', category: 'Draft', amount: 222785 },
  { id: 'CTR-0131', name: 'Escrow Mandate', category: 'Renewal', amount: 394436 },
  { id: 'CTR-0132', name: 'Master Agreement', category: 'Review', amount: 19203 },
];

describe('ContractTable pagination', () => {
  it('filters, sorts and pages through 18 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0115');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0115');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0131');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0115');
  });
});
