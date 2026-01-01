import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0368', name: 'Lease Schedule', category: 'Review', amount: 762725 },
  { id: 'CTR-0369', name: 'Pilot Waiver', category: 'Expired', amount: 902718 },
  { id: 'CTR-0370', name: 'License Charter', category: 'Review', amount: 518805 },
  { id: 'CTR-0371', name: 'Lease Accord', category: 'Expired', amount: 872279 },
  { id: 'CTR-0372', name: 'Escrow Order', category: 'Review', amount: 263567 },
  { id: 'CTR-0373', name: 'Framework Charter', category: 'Expired', amount: 921926 },
  { id: 'CTR-0374', name: 'Pilot Annex', category: 'Signed', amount: 798351 },
  { id: 'CTR-0375', name: 'Master Accord', category: 'Renewal', amount: 757910 },
  { id: 'CTR-0376', name: 'Escrow Order', category: 'Expired', amount: 203231 },
  { id: 'CTR-0377', name: 'Reseller Accord', category: 'Signed', amount: 7058 },
  { id: 'CTR-0378', name: 'Lease Waiver', category: 'Expired', amount: 87944 },
  { id: 'CTR-0379', name: 'Lease Agreement', category: 'Signed', amount: 877886 },
  { id: 'CTR-0380', name: 'Escrow Mandate', category: 'Renewal', amount: 571347 },
  { id: 'CTR-0381', name: 'Service Schedule', category: 'Signed', amount: 429887 },
  { id: 'CTR-0382', name: 'Lease Order', category: 'Expired', amount: 572999 },
  { id: 'CTR-0383', name: 'Hosting Agreement', category: 'Draft', amount: 229082 },
  { id: 'CTR-0384', name: 'Lease Notice', category: 'Draft', amount: 628531 },
  { id: 'CTR-0385', name: 'License Order', category: 'Expired', amount: 958779 },
];

describe('ContractTable columns', () => {
  it('filters, sorts and pages through 18 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0377');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0380');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0381');
    await user.clear(filter);
    await user.type(filter, 'Serv');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });
});
