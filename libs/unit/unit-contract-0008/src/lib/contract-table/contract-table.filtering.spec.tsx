import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0190', name: 'Supply Charter', category: 'Review', amount: 916881 },
  { id: 'CTR-0191', name: 'Service Notice', category: 'Review', amount: 276162 },
  { id: 'CTR-0192', name: 'Framework Annex', category: 'Draft', amount: 862270 },
  { id: 'CTR-0193', name: 'License Order', category: 'Renewal', amount: 959125 },
  { id: 'CTR-0194', name: 'Reseller Notice', category: 'Signed', amount: 175618 },
  { id: 'CTR-0195', name: 'Framework Order', category: 'Expired', amount: 304405 },
  { id: 'CTR-0196', name: 'Master Order', category: 'Expired', amount: 348520 },
  { id: 'CTR-0197', name: 'Framework Order', category: 'Expired', amount: 321415 },
  { id: 'CTR-0198', name: 'Master Agreement', category: 'Expired', amount: 359080 },
  { id: 'CTR-0199', name: 'Escrow Addendum', category: 'Renewal', amount: 686527 },
  { id: 'CTR-0200', name: 'Pilot Notice', category: 'Signed', amount: 734743 },
  { id: 'CTR-0201', name: 'Hosting Accord', category: 'Draft', amount: 680793 },
  { id: 'CTR-0202', name: 'Master Schedule', category: 'Renewal', amount: 381972 },
  { id: 'CTR-0203', name: 'Hosting Notice', category: 'Draft', amount: 706197 },
  { id: 'CTR-0204', name: 'Master Addendum', category: 'Signed', amount: 792888 },
  { id: 'CTR-0205', name: 'Pilot Mandate', category: 'Expired', amount: 778190 },
  { id: 'CTR-0206', name: 'Pilot Mandate', category: 'Draft', amount: 309937 },
  { id: 'CTR-0207', name: 'Pilot Agreement', category: 'Review', amount: 986738 },
  { id: 'CTR-0208', name: 'Reseller Notice', category: 'Draft', amount: 900703 },
  { id: 'CTR-0209', name: 'Framework Notice', category: 'Review', amount: 693498 },
];

describe('ContractTable filtering', () => {
  it('filters, sorts and pages through 20 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0190');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-20 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0200');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0190');
    await user.clear(filter);
    await user.type(filter, 'man');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    await user.type(filter, 'CTR-0191');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0190');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-20 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0200');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0190');
    await user.clear(filter);
    await user.type(filter, 'ctr-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'order');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0190');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0190');
  });

  it('filters, sorts and pages through 20 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'waiver');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0190');
  });
});
