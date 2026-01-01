import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0267', name: 'Reseller Mandate', category: 'Signed', amount: 245892 },
  { id: 'CTR-0268', name: 'Pilot Mandate', category: 'Draft', amount: 773781 },
  { id: 'CTR-0269', name: 'Service Order', category: 'Draft', amount: 578801 },
  { id: 'CTR-0270', name: 'Lease Addendum', category: 'Signed', amount: 887748 },
  { id: 'CTR-0271', name: 'Supply Mandate', category: 'Renewal', amount: 823351 },
  { id: 'CTR-0272', name: 'Escrow Notice', category: 'Draft', amount: 956798 },
  { id: 'CTR-0273', name: 'License Waiver', category: 'Expired', amount: 671327 },
  { id: 'CTR-0274', name: 'Framework Accord', category: 'Expired', amount: 180073 },
  { id: 'CTR-0275', name: 'Escrow Accord', category: 'Draft', amount: 705820 },
  { id: 'CTR-0276', name: 'Escrow Schedule', category: 'Draft', amount: 356010 },
  { id: 'CTR-0277', name: 'Master Mandate', category: 'Renewal', amount: 100529 },
  { id: 'CTR-0278', name: 'License Charter', category: 'Signed', amount: 595280 },
  { id: 'CTR-0279', name: 'Master Accord', category: 'Expired', amount: 192298 },
  { id: 'CTR-0280', name: 'Reseller Accord', category: 'Draft', amount: 493092 },
  { id: 'CTR-0281', name: 'Service Charter', category: 'Draft', amount: 154525 },
  { id: 'CTR-0282', name: 'Supply Agreement', category: 'Draft', amount: 392543 },
  { id: 'CTR-0283', name: 'Pilot Accord', category: 'Draft', amount: 147285 },
];

describe('ContractTable sorting', () => {
  it('filters, sorts and pages through 17 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0277');
    await user.clear(filter);
    await user.type(filter, 'agr');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0267');
  });
});
