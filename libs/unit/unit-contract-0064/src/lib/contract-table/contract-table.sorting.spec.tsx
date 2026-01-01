import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0182', name: 'Escrow Mandate', category: 'Renewal', amount: 804942 },
  { id: 'CTR-0183', name: 'Service Schedule', category: 'Signed', amount: 41622 },
  { id: 'CTR-0184', name: 'Lease Schedule', category: 'Draft', amount: 489150 },
  { id: 'CTR-0185', name: 'Service Agreement', category: 'Expired', amount: 561645 },
  { id: 'CTR-0186', name: 'Supply Charter', category: 'Expired', amount: 620508 },
  { id: 'CTR-0187', name: 'Pilot Waiver', category: 'Signed', amount: 339869 },
  { id: 'CTR-0188', name: 'Supply Annex', category: 'Renewal', amount: 607666 },
  { id: 'CTR-0189', name: 'Escrow Schedule', category: 'Review', amount: 772041 },
  { id: 'CTR-0190', name: 'Framework Order', category: 'Draft', amount: 326432 },
  { id: 'CTR-0191', name: 'License Addendum', category: 'Signed', amount: 473284 },
  { id: 'CTR-0192', name: 'Framework Order', category: 'Expired', amount: 458299 },
  { id: 'CTR-0193', name: 'Escrow Order', category: 'Signed', amount: 615012 },
  { id: 'CTR-0194', name: 'Hosting Annex', category: 'Renewal', amount: 270212 },
];

describe('ContractTable sorting', () => {
  it('filters, sorts and pages through 13 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'CTR-0184');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0182');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0182');
  });
});
