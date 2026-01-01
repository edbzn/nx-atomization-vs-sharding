import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0206', name: 'Master Mandate', category: 'Expired', amount: 308308 },
  { id: 'CTR-0207', name: 'Hosting Accord', category: 'Expired', amount: 183491 },
  { id: 'CTR-0208', name: 'Master Schedule', category: 'Signed', amount: 561388 },
  { id: 'CTR-0209', name: 'Escrow Order', category: 'Draft', amount: 532476 },
  { id: 'CTR-0210', name: 'Supply Annex', category: 'Draft', amount: 44240 },
  { id: 'CTR-0211', name: 'Pilot Accord', category: 'Expired', amount: 252653 },
  { id: 'CTR-0212', name: 'Hosting Mandate', category: 'Review', amount: 6872 },
  { id: 'CTR-0213', name: 'Reseller Addendum', category: 'Renewal', amount: 547967 },
  { id: 'CTR-0214', name: 'Reseller Addendum', category: 'Expired', amount: 334401 },
  { id: 'CTR-0215', name: 'License Mandate', category: 'Review', amount: 672268 },
  { id: 'CTR-0216', name: 'Escrow Schedule', category: 'Renewal', amount: 662810 },
  { id: 'CTR-0217', name: 'Framework Annex', category: 'Signed', amount: 59382 },
  { id: 'CTR-0218', name: 'Hosting Agreement', category: 'Signed', amount: 29527 },
  { id: 'CTR-0219', name: 'Lease Order', category: 'Review', amount: 702785 },
];

describe('ContractTable large dataset', () => {
  it('filters, sorts and pages through 14 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0206');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0209');
    await user.clear(filter);
    await user.type(filter, 'renewal');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    await user.type(filter, 'ctr-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });
});
