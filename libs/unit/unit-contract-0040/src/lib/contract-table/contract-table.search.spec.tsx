import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0051', name: 'License Addendum', category: 'Signed', amount: 403249 },
  { id: 'CTR-0052', name: 'Hosting Waiver', category: 'Review', amount: 239440 },
  { id: 'CTR-0053', name: 'Escrow Order', category: 'Renewal', amount: 584964 },
  { id: 'CTR-0054', name: 'Master Schedule', category: 'Draft', amount: 150647 },
  { id: 'CTR-0055', name: 'Framework Mandate', category: 'Draft', amount: 609871 },
  { id: 'CTR-0056', name: 'Reseller Accord', category: 'Draft', amount: 755732 },
  { id: 'CTR-0057', name: 'License Notice', category: 'Renewal', amount: 473130 },
  { id: 'CTR-0058', name: 'Framework Schedule', category: 'Signed', amount: 388565 },
  { id: 'CTR-0059', name: 'Framework Waiver', category: 'Renewal', amount: 449776 },
  { id: 'CTR-0060', name: 'Lease Charter', category: 'Signed', amount: 799793 },
  { id: 'CTR-0061', name: 'Lease Mandate', category: 'Expired', amount: 879879 },
  { id: 'CTR-0062', name: 'License Accord', category: 'Signed', amount: 783272 },
  { id: 'CTR-0063', name: 'Hosting Agreement', category: 'Renewal', amount: 933063 },
  { id: 'CTR-0064', name: 'Hosting Notice', category: 'Draft', amount: 478843 },
  { id: 'CTR-0065', name: 'Supply Mandate', category: 'Signed', amount: 53372 },
  { id: 'CTR-0066', name: 'Supply Annex', category: 'Review', amount: 40775 },
  { id: 'CTR-0067', name: 'Reseller Charter', category: 'Review', amount: 748405 },
  { id: 'CTR-0068', name: 'Service Notice', category: 'Review', amount: 204608 },
  { id: 'CTR-0069', name: 'Framework Schedule', category: 'Renewal', amount: 230431 },
];

describe('ContractTable search', () => {
  it('filters, sorts and pages through 19 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0053');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0062');
    await user.clear(filter);
    await user.type(filter, 'draft');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0053');
  });
});
