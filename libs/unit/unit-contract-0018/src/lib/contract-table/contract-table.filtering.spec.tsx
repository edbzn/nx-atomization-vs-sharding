import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0054', name: 'Pilot Addendum', category: 'Draft', amount: 53330 },
  { id: 'CTR-0055', name: 'Framework Waiver', category: 'Review', amount: 362620 },
  { id: 'CTR-0056', name: 'Master Annex', category: 'Draft', amount: 56706 },
  { id: 'CTR-0057', name: 'Framework Notice', category: 'Review', amount: 299663 },
  { id: 'CTR-0058', name: 'Hosting Order', category: 'Expired', amount: 612195 },
  { id: 'CTR-0059', name: 'Supply Order', category: 'Review', amount: 346324 },
  { id: 'CTR-0060', name: 'Hosting Waiver', category: 'Draft', amount: 453232 },
  { id: 'CTR-0061', name: 'Hosting Accord', category: 'Signed', amount: 511821 },
  { id: 'CTR-0062', name: 'Framework Notice', category: 'Expired', amount: 99710 },
  { id: 'CTR-0063', name: 'Hosting Accord', category: 'Review', amount: 993265 },
  { id: 'CTR-0064', name: 'Hosting Agreement', category: 'Signed', amount: 498252 },
  { id: 'CTR-0065', name: 'Framework Addendum', category: 'Renewal', amount: 626309 },
  { id: 'CTR-0066', name: 'Hosting Mandate', category: 'Signed', amount: 60211 },
];

describe('ContractTable filtering', () => {
  it('filters, sorts and pages through 13 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'Pil');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0054');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0054');
    await user.clear(filter);
    await user.type(filter, 'signed');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0061');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0061');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0054');
  });

  it('filters, sorts and pages through 13 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-13 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0064');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-13 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0064');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0054');
  });
});
