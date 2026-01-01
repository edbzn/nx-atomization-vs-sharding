import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0118', name: 'Pilot Notice', category: 'Draft', amount: 960667 },
  { id: 'CTR-0119', name: 'Reseller Charter', category: 'Renewal', amount: 953653 },
  { id: 'CTR-0120', name: 'Supply Notice', category: 'Review', amount: 227194 },
  { id: 'CTR-0121', name: 'Supply Order', category: 'Expired', amount: 28022 },
  { id: 'CTR-0122', name: 'Framework Agreement', category: 'Review', amount: 701989 },
  { id: 'CTR-0123', name: 'Service Waiver', category: 'Renewal', amount: 524298 },
  { id: 'CTR-0124', name: 'Reseller Mandate', category: 'Signed', amount: 739094 },
  { id: 'CTR-0125', name: 'Pilot Order', category: 'Review', amount: 666694 },
  { id: 'CTR-0126', name: 'License Charter', category: 'Draft', amount: 813280 },
  { id: 'CTR-0127', name: 'Framework Waiver', category: 'Renewal', amount: 511256 },
  { id: 'CTR-0128', name: 'Escrow Agreement', category: 'Draft', amount: 417723 },
  { id: 'CTR-0129', name: 'Hosting Schedule', category: 'Renewal', amount: 938943 },
  { id: 'CTR-0130', name: 'Lease Notice', category: 'Renewal', amount: 431640 },
  { id: 'CTR-0131', name: 'Supply Addendum', category: 'Renewal', amount: 508869 },
  { id: 'CTR-0132', name: 'Reseller Notice', category: 'Review', amount: 836167 },
  { id: 'CTR-0133', name: 'Supply Order', category: 'Draft', amount: 455405 },
  { id: 'CTR-0134', name: 'Hosting Order', category: 'Draft', amount: 749198 },
  { id: 'CTR-0135', name: 'Hosting Schedule', category: 'Renewal', amount: 168803 },
];

describe('ContractTable filtering 2', () => {
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0118');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0128');
    await user.clear(filter);
    await user.type(filter, 'review');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0128');
  });

  it('filters, sorts and pages through 18 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0128');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0118');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0118');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0121');
    await user.clear(filter);
    await user.type(filter, 'accor');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0121');
  });

  it('filters, sorts and pages through 16 contracts', async () => {
    const rows = ROWS.slice(0, 16);
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'signed');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0124');
  });
});
