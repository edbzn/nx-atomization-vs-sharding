import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0120', name: 'Hosting Accord', category: 'Signed', amount: 975858 },
  { id: 'CTR-0121', name: 'Pilot Addendum', category: 'Signed', amount: 219202 },
  { id: 'CTR-0122', name: 'Supply Accord', category: 'Renewal', amount: 641417 },
  { id: 'CTR-0123', name: 'Supply Agreement', category: 'Review', amount: 71770 },
  { id: 'CTR-0124', name: 'Hosting Agreement', category: 'Signed', amount: 840828 },
  { id: 'CTR-0125', name: 'Supply Order', category: 'Expired', amount: 335350 },
  { id: 'CTR-0126', name: 'Framework Notice', category: 'Draft', amount: 198517 },
  { id: 'CTR-0127', name: 'Lease Accord', category: 'Draft', amount: 803254 },
  { id: 'CTR-0128', name: 'Framework Waiver', category: 'Expired', amount: 80484 },
  { id: 'CTR-0129', name: 'License Mandate', category: 'Draft', amount: 959004 },
  { id: 'CTR-0130', name: 'Hosting Mandate', category: 'Expired', amount: 918322 },
  { id: 'CTR-0131', name: 'Pilot Annex', category: 'Renewal', amount: 219107 },
];

describe('ContractTable pagination', () => {
  it('filters, sorts and pages through 12 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0123');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0120');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0126');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0120');
  });
});
