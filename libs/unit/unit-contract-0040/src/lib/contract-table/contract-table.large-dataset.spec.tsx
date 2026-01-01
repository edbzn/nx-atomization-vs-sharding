import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractTable } from './ContractTable';
import type { ContractRow } from '../types';

const ROWS: ContractRow[] = [
  { id: 'CTR-0331', name: 'Pilot Agreement', category: 'Review', amount: 93529 },
  { id: 'CTR-0332', name: 'Escrow Charter', category: 'Signed', amount: 171156 },
  { id: 'CTR-0333', name: 'Master Waiver', category: 'Draft', amount: 940004 },
  { id: 'CTR-0334', name: 'Escrow Mandate', category: 'Expired', amount: 414057 },
  { id: 'CTR-0335', name: 'Service Waiver', category: 'Review', amount: 50543 },
  { id: 'CTR-0336', name: 'License Mandate', category: 'Draft', amount: 845267 },
  { id: 'CTR-0337', name: 'Lease Order', category: 'Review', amount: 726629 },
  { id: 'CTR-0338', name: 'Reseller Mandate', category: 'Renewal', amount: 497853 },
  { id: 'CTR-0339', name: 'License Order', category: 'Review', amount: 982643 },
  { id: 'CTR-0340', name: 'License Order', category: 'Review', amount: 309625 },
  { id: 'CTR-0341', name: 'Framework Charter', category: 'Renewal', amount: 144432 },
  { id: 'CTR-0342', name: 'Lease Mandate', category: 'Signed', amount: 958103 },
  { id: 'CTR-0343', name: 'Service Annex', category: 'Draft', amount: 130055 },
  { id: 'CTR-0344', name: 'Pilot Addendum', category: 'Expired', amount: 323056 },
  { id: 'CTR-0345', name: 'Pilot Schedule', category: 'Review', amount: 391682 },
  { id: 'CTR-0346', name: 'Service Addendum', category: 'Signed', amount: 876437 },
  { id: 'CTR-0347', name: 'Supply Order', category: 'Review', amount: 244202 },
  { id: 'CTR-0348', name: 'Escrow Order', category: 'Signed', amount: 221268 },
];

describe('ContractTable large dataset', () => {
  it('filters, sorts and pages through 18 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0341');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0331');
    await user.clear(filter);
    await user.type(filter, 'Hosti');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0331');
    await user.clear(filter);
    await user.type(filter, 'CTR-0343');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0343');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0335');
    await user.clear(filter);
    await user.type(filter, 'CTR-0334');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0335');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0339');
  });

  it('filters, sorts and pages through 18 contracts', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<ContractTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0332');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0344');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0344');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CTR-0332');
  });
});
