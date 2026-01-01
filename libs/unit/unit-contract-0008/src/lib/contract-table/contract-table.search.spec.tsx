import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0379', name: 'Master Notice', category: 'Draft', amount: 327726 },
  { id: 'CTR-0380', name: 'Master Addendum', category: 'Draft', amount: 361740 },
  { id: 'CTR-0381', name: 'Hosting Addendum', category: 'Draft', amount: 952451 },
  { id: 'CTR-0382', name: 'Master Accord', category: 'Expired', amount: 584190 },
  { id: 'CTR-0383', name: 'Reseller Waiver', category: 'Renewal', amount: 611056 },
  { id: 'CTR-0384', name: 'Pilot Agreement', category: 'Expired', amount: 710354 },
  { id: 'CTR-0385', name: 'Supply Annex', category: 'Signed', amount: 606287 },
  { id: 'CTR-0386', name: 'Lease Mandate', category: 'Review', amount: 712580 },
  { id: 'CTR-0387', name: 'Framework Waiver', category: 'Signed', amount: 301521 },
  { id: 'CTR-0388', name: 'Pilot Schedule', category: 'Review', amount: 105462 },
  { id: 'CTR-0389', name: 'Reseller Addendum', category: 'Draft', amount: 884977 },
  { id: 'CTR-0390', name: 'Framework Annex', category: 'Expired', amount: 910628 },
  { id: 'CTR-0391', name: 'Service Agreement', category: 'Expired', amount: 734265 },
  { id: 'CTR-0392', name: 'Pilot Addendum', category: 'Draft', amount: 845291 },
  { id: 'CTR-0393', name: 'Master Order', category: 'Signed', amount: 221948 },
  { id: 'CTR-0394', name: 'Escrow Addendum', category: 'Draft', amount: 47451 },
  { id: 'CTR-0395', name: 'Reseller Agreement', category: 'Signed', amount: 294010 },
  { id: 'CTR-0396', name: 'License Schedule', category: 'Review', amount: 878087 },
  { id: 'CTR-0397', name: 'Escrow Order', category: 'Signed', amount: 40350 },
];

describe('ContractTable search', () => {
  it('filters, sorts and pages through 19 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'ctr-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0379');
    await user.clear(filter);
    await user.type(filter, 'CTR-0379');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0379');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0379');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0379');
  });

  it('filters, sorts and pages through 19 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0379');
    await user.clear(filter);
    await user.type(filter, 'signed');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0379');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0389');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0379');
  });

  it('filters, sorts and pages through 15 contracts', async () => {
    const rows = ROWS.slice(0, 15);
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'waive');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
  });
});
