import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0330', name: 'Service Order', category: 'Review', amount: 625690 },
  { id: 'CTR-0331', name: 'Framework Schedule', category: 'Renewal', amount: 34021 },
  { id: 'CTR-0332', name: 'Supply Accord', category: 'Review', amount: 839780 },
  { id: 'CTR-0333', name: 'Supply Addendum', category: 'Draft', amount: 51741 },
  { id: 'CTR-0334', name: 'Service Waiver', category: 'Expired', amount: 108207 },
  { id: 'CTR-0335', name: 'Pilot Notice', category: 'Expired', amount: 950406 },
  { id: 'CTR-0336', name: 'Supply Accord', category: 'Expired', amount: 239482 },
  { id: 'CTR-0337', name: 'Pilot Schedule', category: 'Renewal', amount: 300166 },
  { id: 'CTR-0338', name: 'Master Notice', category: 'Review', amount: 999169 },
  { id: 'CTR-0339', name: 'Pilot Charter', category: 'Renewal', amount: 442494 },
  { id: 'CTR-0340', name: 'Pilot Mandate', category: 'Expired', amount: 329489 },
  { id: 'CTR-0341', name: 'License Mandate', category: 'Expired', amount: 151581 },
  { id: 'CTR-0342', name: 'Pilot Addendum', category: 'Draft', amount: 861593 },
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
    await user.type(filter, 'CTR-0341');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0330');
    await user.clear(filter);
    await user.type(filter, 'review');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
  });
});
