import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0195', name: 'Hosting Schedule', category: 'Signed', amount: 168999 },
  { id: 'CTR-0196', name: 'Supply Notice', category: 'Renewal', amount: 715704 },
  { id: 'CTR-0197', name: 'Framework Order', category: 'Draft', amount: 116374 },
  { id: 'CTR-0198', name: 'Escrow Waiver', category: 'Expired', amount: 20055 },
  { id: 'CTR-0199', name: 'Lease Agreement', category: 'Review', amount: 995550 },
  { id: 'CTR-0200', name: 'Lease Notice', category: 'Draft', amount: 978738 },
  { id: 'CTR-0201', name: 'Reseller Waiver', category: 'Review', amount: 36097 },
  { id: 'CTR-0202', name: 'Hosting Order', category: 'Draft', amount: 976291 },
  { id: 'CTR-0203', name: 'Escrow Notice', category: 'Signed', amount: 39379 },
  { id: 'CTR-0204', name: 'Service Charter', category: 'Review', amount: 938622 },
  { id: 'CTR-0205', name: 'Service Order', category: 'Expired', amount: 931154 },
  { id: 'CTR-0206', name: 'Master Order', category: 'Renewal', amount: 472099 },
  { id: 'CTR-0207', name: 'Hosting Order', category: 'Draft', amount: 510924 },
  { id: 'CTR-0208', name: 'Hosting Schedule', category: 'Review', amount: 839485 },
  { id: 'CTR-0209', name: 'Framework Addendum', category: 'Signed', amount: 874269 },
  { id: 'CTR-0210', name: 'Framework Addendum', category: 'Draft', amount: 694757 },
  { id: 'CTR-0211', name: 'Service Notice', category: 'Expired', amount: 957617 },
  { id: 'CTR-0212', name: 'Hosting Order', category: 'Renewal', amount: 154313 },
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
    await user.type(filter, 'ctr-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0195');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0205');
  });
});
