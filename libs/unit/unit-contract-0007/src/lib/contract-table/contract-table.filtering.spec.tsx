import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0335', name: 'Reseller Notice', category: 'Draft', amount: 543300 },
  { id: 'CTR-0336', name: 'Escrow Schedule', category: 'Review', amount: 775270 },
  { id: 'CTR-0337', name: 'Pilot Annex', category: 'Draft', amount: 796563 },
  { id: 'CTR-0338', name: 'Service Waiver', category: 'Draft', amount: 710734 },
  { id: 'CTR-0339', name: 'Hosting Schedule', category: 'Expired', amount: 938478 },
  { id: 'CTR-0340', name: 'Master Mandate', category: 'Signed', amount: 624073 },
  { id: 'CTR-0341', name: 'Lease Accord', category: 'Draft', amount: 953265 },
  { id: 'CTR-0342', name: 'Reseller Accord', category: 'Expired', amount: 270224 },
  { id: 'CTR-0343', name: 'License Waiver', category: 'Renewal', amount: 290102 },
  { id: 'CTR-0344', name: 'Service Order', category: 'Review', amount: 964209 },
  { id: 'CTR-0345', name: 'Service Accord', category: 'Expired', amount: 448527 },
  { id: 'CTR-0346', name: 'Pilot Annex', category: 'Review', amount: 103863 },
  { id: 'CTR-0347', name: 'Pilot Schedule', category: 'Renewal', amount: 118718 },
];

describe('ContractTable filtering', () => {
  it('filters, sorts and pages through 13 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0335');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0346');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-13 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0339');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0346');
  });
});
