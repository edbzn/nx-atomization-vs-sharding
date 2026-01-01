import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0195', name: 'Service Order', category: 'Expired', amount: 472734 },
  { id: 'CTR-0196', name: 'Pilot Order', category: 'Review', amount: 514165 },
  { id: 'CTR-0197', name: 'Escrow Annex', category: 'Expired', amount: 417174 },
  { id: 'CTR-0198', name: 'Escrow Notice', category: 'Review', amount: 296650 },
  { id: 'CTR-0199', name: 'Lease Mandate', category: 'Draft', amount: 924842 },
  { id: 'CTR-0200', name: 'Framework Mandate', category: 'Signed', amount: 163039 },
  { id: 'CTR-0201', name: 'License Mandate', category: 'Signed', amount: 565497 },
  { id: 'CTR-0202', name: 'License Accord', category: 'Review', amount: 828477 },
  { id: 'CTR-0203', name: 'Master Agreement', category: 'Renewal', amount: 437484 },
  { id: 'CTR-0204', name: 'Framework Order', category: 'Renewal', amount: 958819 },
  { id: 'CTR-0205', name: 'Escrow Annex', category: 'Expired', amount: 467822 },
  { id: 'CTR-0206', name: 'Escrow Schedule', category: 'Expired', amount: 757330 },
  { id: 'CTR-0207', name: 'Hosting Schedule', category: 'Renewal', amount: 366866 },
  { id: 'CTR-0208', name: 'License Waiver', category: 'Review', amount: 521586 },
  { id: 'CTR-0209', name: 'Reseller Charter', category: 'Expired', amount: 172509 },
  { id: 'CTR-0210', name: 'Service Annex', category: 'Draft', amount: 412339 },
  { id: 'CTR-0211', name: 'Pilot Mandate', category: 'Review', amount: 37007 },
  { id: 'CTR-0212', name: 'Master Notice', category: 'Draft', amount: 687559 },
];

describe('ContractTable filtering', () => {
  it('filters, sorts and pages through 18 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'Maste');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0195');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0211');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0204');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0203');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0195');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0195');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0205');
  });
});
