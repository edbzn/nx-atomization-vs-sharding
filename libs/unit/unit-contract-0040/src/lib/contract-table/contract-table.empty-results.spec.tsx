import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0340', name: 'License Charter', category: 'Renewal', amount: 219910 },
  { id: 'CTR-0341', name: 'Reseller Charter', category: 'Review', amount: 757613 },
  { id: 'CTR-0342', name: 'Framework Agreement', category: 'Signed', amount: 698000 },
  { id: 'CTR-0343', name: 'Hosting Schedule', category: 'Renewal', amount: 621596 },
  { id: 'CTR-0344', name: 'Master Agreement', category: 'Review', amount: 451156 },
  { id: 'CTR-0345', name: 'Hosting Agreement', category: 'Signed', amount: 503219 },
  { id: 'CTR-0346', name: 'Service Agreement', category: 'Renewal', amount: 253496 },
  { id: 'CTR-0347', name: 'Framework Waiver', category: 'Expired', amount: 326151 },
  { id: 'CTR-0348', name: 'License Charter', category: 'Renewal', amount: 112560 },
  { id: 'CTR-0349', name: 'Reseller Schedule', category: 'Expired', amount: 799693 },
  { id: 'CTR-0350', name: 'Escrow Schedule', category: 'Signed', amount: 400115 },
  { id: 'CTR-0351', name: 'Reseller Addendum', category: 'Expired', amount: 963763 },
  { id: 'CTR-0352', name: 'Lease Accord', category: 'Renewal', amount: 847441 },
  { id: 'CTR-0353', name: 'Hosting Schedule', category: 'Review', amount: 958602 },
  { id: 'CTR-0354', name: 'Hosting Agreement', category: 'Review', amount: 465074 },
];

describe('ContractTable empty results', () => {
  it('filters, sorts and pages through 15 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0348');
    await user.clear(filter);
    await user.type(filter, 'ctr-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'acco');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });
});
