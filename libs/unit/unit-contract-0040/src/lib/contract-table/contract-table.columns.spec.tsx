import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0206', name: 'Framework Agreement', category: 'Signed', amount: 594697 },
  { id: 'CTR-0207', name: 'Master Accord', category: 'Review', amount: 479280 },
  { id: 'CTR-0208', name: 'Pilot Notice', category: 'Draft', amount: 531927 },
  { id: 'CTR-0209', name: 'Escrow Mandate', category: 'Expired', amount: 64950 },
  { id: 'CTR-0210', name: 'Master Agreement', category: 'Signed', amount: 648046 },
  { id: 'CTR-0211', name: 'Pilot Schedule', category: 'Renewal', amount: 964021 },
  { id: 'CTR-0212', name: 'Reseller Annex', category: 'Expired', amount: 2433 },
  { id: 'CTR-0213', name: 'Service Charter', category: 'Expired', amount: 106414 },
  { id: 'CTR-0214', name: 'Reseller Notice', category: 'Signed', amount: 703203 },
  { id: 'CTR-0215', name: 'Lease Accord', category: 'Renewal', amount: 262384 },
  { id: 'CTR-0216', name: 'Hosting Order', category: 'Review', amount: 792627 },
  { id: 'CTR-0217', name: 'License Addendum', category: 'Expired', amount: 992744 },
  { id: 'CTR-0218', name: 'License Charter', category: 'Review', amount: 17805 },
  { id: 'CTR-0219', name: 'Reseller Notice', category: 'Signed', amount: 803919 },
  { id: 'CTR-0220', name: 'Master Order', category: 'Renewal', amount: 867382 },
  { id: 'CTR-0221', name: 'Framework Waiver', category: 'Expired', amount: 622017 },
  { id: 'CTR-0222', name: 'Pilot Schedule', category: 'Expired', amount: 409566 },
  { id: 'CTR-0223', name: 'License Waiver', category: 'Expired', amount: 247920 },
  { id: 'CTR-0224', name: 'Supply Annex', category: 'Signed', amount: 240855 },
];

describe('ContractTable columns', () => {
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0206');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0206');
    await user.clear(filter);
    await user.type(filter, 'draft');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0206');
    await user.clear(filter);
    await user.type(filter, 'Licen');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0206');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0216');
  });

  it('filters, sorts and pages through 19 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0206');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0212');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0212');
  });

  it('filters, sorts and pages through 19 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0206');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0212');
    await user.clear(filter);
    await user.type(filter, 'Suppl');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0212');
  });
});
