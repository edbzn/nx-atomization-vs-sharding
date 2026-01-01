import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0007', name: 'Master Mandate', category: 'Renewal', amount: 117745 },
  { id: 'CTR-0008', name: 'Escrow Order', category: 'Review', amount: 841793 },
  { id: 'CTR-0009', name: 'License Waiver', category: 'Expired', amount: 944405 },
  { id: 'CTR-0010', name: 'Master Mandate', category: 'Draft', amount: 195302 },
  { id: 'CTR-0011', name: 'Escrow Notice', category: 'Renewal', amount: 315375 },
  { id: 'CTR-0012', name: 'License Notice', category: 'Expired', amount: 917789 },
  { id: 'CTR-0013', name: 'License Agreement', category: 'Signed', amount: 45733 },
  { id: 'CTR-0014', name: 'Service Annex', category: 'Signed', amount: 237944 },
  { id: 'CTR-0015', name: 'License Mandate', category: 'Renewal', amount: 835728 },
  { id: 'CTR-0016', name: 'Pilot Order', category: 'Expired', amount: 893050 },
  { id: 'CTR-0017', name: 'License Accord', category: 'Expired', amount: 736068 },
  { id: 'CTR-0018', name: 'Escrow Order', category: 'Review', amount: 832428 },
  { id: 'CTR-0019', name: 'Lease Annex', category: 'Draft', amount: 808023 },
  { id: 'CTR-0020', name: 'Framework Waiver', category: 'Signed', amount: 48062 },
  { id: 'CTR-0021', name: 'Pilot Mandate', category: 'Expired', amount: 757492 },
  { id: 'CTR-0022', name: 'Escrow Notice', category: 'Draft', amount: 902452 },
  { id: 'CTR-0023', name: 'Reseller Schedule', category: 'Draft', amount: 40288 },
  { id: 'CTR-0024', name: 'Service Notice', category: 'Review', amount: 402903 },
  { id: 'CTR-0025', name: 'Service Order', category: 'Expired', amount: 124463 },
  { id: 'CTR-0026', name: 'Pilot Notice', category: 'Expired', amount: 883422 },
];

describe('ContractTable navigation', () => {
  it('filters, sorts and pages through 20 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0023');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0023');
    await user.clear(filter);
    await user.type(filter, 'Lea');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'ctr-000');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0007');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0007');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0023');
    await user.clear(filter);
    await user.type(filter, 'review');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    await user.type(filter, 'signed');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0013');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0020');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0013');
  });
});
