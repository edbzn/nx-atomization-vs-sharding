import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0085', name: 'Escrow Notice', category: 'Draft', amount: 650568 },
  { id: 'CTR-0086', name: 'Lease Waiver', category: 'Signed', amount: 711919 },
  { id: 'CTR-0087', name: 'Pilot Waiver', category: 'Signed', amount: 520380 },
  { id: 'CTR-0088', name: 'Service Agreement', category: 'Renewal', amount: 659216 },
  { id: 'CTR-0089', name: 'Master Charter', category: 'Signed', amount: 236454 },
  { id: 'CTR-0090', name: 'Hosting Agreement', category: 'Draft', amount: 480353 },
  { id: 'CTR-0091', name: 'Reseller Notice', category: 'Signed', amount: 647583 },
  { id: 'CTR-0092', name: 'License Charter', category: 'Renewal', amount: 848945 },
  { id: 'CTR-0093', name: 'Service Agreement', category: 'Signed', amount: 309821 },
  { id: 'CTR-0094', name: 'Framework Mandate', category: 'Expired', amount: 457758 },
  { id: 'CTR-0095', name: 'Pilot Accord', category: 'Renewal', amount: 970641 },
  { id: 'CTR-0096', name: 'Pilot Order', category: 'Review', amount: 559488 },
  { id: 'CTR-0097', name: 'Escrow Annex', category: 'Review', amount: 485002 },
  { id: 'CTR-0098', name: 'Escrow Charter', category: 'Review', amount: 793076 },
  { id: 'CTR-0099', name: 'Reseller Waiver', category: 'Signed', amount: 55662 },
  { id: 'CTR-0100', name: 'Escrow Order', category: 'Renewal', amount: 912626 },
  { id: 'CTR-0101', name: 'Reseller Schedule', category: 'Renewal', amount: 380094 },
  { id: 'CTR-0102', name: 'Hosting Order', category: 'Signed', amount: 157128 },
  { id: 'CTR-0103', name: 'Framework Accord', category: 'Renewal', amount: 102694 },
];

describe('ContractTable pagination', () => {
  it('filters, sorts and pages through 19 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0095');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0099');
    await user.clear(filter);
    await user.type(filter, 'Sup');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0099');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0099');
  });

  it('filters, sorts and pages through 19 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'CTR-0085');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0085');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0095');
    await user.clear(filter);
    await user.type(filter, 'Mas');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'ctr-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0085');
  });
});
