import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0243', name: 'Lease Waiver', category: 'Signed', amount: 105250 },
  { id: 'CTR-0244', name: 'Pilot Order', category: 'Review', amount: 537472 },
  { id: 'CTR-0245', name: 'Pilot Addendum', category: 'Signed', amount: 679874 },
  { id: 'CTR-0246', name: 'Pilot Schedule', category: 'Draft', amount: 390318 },
  { id: 'CTR-0247', name: 'Supply Waiver', category: 'Review', amount: 582484 },
  { id: 'CTR-0248', name: 'License Schedule', category: 'Signed', amount: 378101 },
  { id: 'CTR-0249', name: 'Escrow Mandate', category: 'Expired', amount: 30166 },
  { id: 'CTR-0250', name: 'License Notice', category: 'Draft', amount: 581112 },
  { id: 'CTR-0251', name: 'Service Annex', category: 'Renewal', amount: 958325 },
  { id: 'CTR-0252', name: 'Service Mandate', category: 'Review', amount: 610766 },
  { id: 'CTR-0253', name: 'Reseller Annex', category: 'Draft', amount: 599769 },
  { id: 'CTR-0254', name: 'Framework Waiver', category: 'Signed', amount: 633854 },
  { id: 'CTR-0255', name: 'Hosting Agreement', category: 'Draft', amount: 997010 },
  { id: 'CTR-0256', name: 'Escrow Addendum', category: 'Expired', amount: 443173 },
  { id: 'CTR-0257', name: 'License Accord', category: 'Draft', amount: 511135 },
];

describe('ContractTable empty results', () => {
  it('filters, sorts and pages through 15 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0253');
    await user.clear(filter);
    await user.type(filter, 'Hosti');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0243');
  });
});
