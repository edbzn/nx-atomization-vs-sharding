import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0289', name: 'Reseller Addendum', category: 'Renewal', amount: 388048 },
  { id: 'CTR-0290', name: 'Supply Order', category: 'Expired', amount: 724055 },
  { id: 'CTR-0291', name: 'Service Charter', category: 'Review', amount: 761387 },
  { id: 'CTR-0292', name: 'Pilot Waiver', category: 'Draft', amount: 595492 },
  { id: 'CTR-0293', name: 'Pilot Accord', category: 'Review', amount: 387333 },
  { id: 'CTR-0294', name: 'Lease Notice', category: 'Renewal', amount: 385212 },
  { id: 'CTR-0295', name: 'Hosting Addendum', category: 'Renewal', amount: 779702 },
  { id: 'CTR-0296', name: 'Reseller Charter', category: 'Expired', amount: 640336 },
  { id: 'CTR-0297', name: 'Framework Accord', category: 'Expired', amount: 977369 },
  { id: 'CTR-0298', name: 'Supply Schedule', category: 'Draft', amount: 336152 },
  { id: 'CTR-0299', name: 'Reseller Annex', category: 'Review', amount: 978568 },
  { id: 'CTR-0300', name: 'Hosting Addendum', category: 'Draft', amount: 622138 },
  { id: 'CTR-0301', name: 'Escrow Mandate', category: 'Renewal', amount: 626094 },
  { id: 'CTR-0302', name: 'Reseller Agreement', category: 'Expired', amount: 798706 },
  { id: 'CTR-0303', name: 'License Schedule', category: 'Signed', amount: 648093 },
];

describe('ContractTable filtering', () => {
  it('filters, sorts and pages through 15 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0299');
    await user.clear(filter);
    await user.type(filter, 'Licen');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'CTR-0296');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });

  it('filters, sorts and pages through 15 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0289');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0299');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0303');
  });

  it('filters, sorts and pages through 15 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'ctr-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0289');
    await user.clear(filter);
    await user.type(filter, 'CTR-0300');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'renewal');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.clear(filter);
    await user.type(filter, 'sched');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0289');
  });
});
