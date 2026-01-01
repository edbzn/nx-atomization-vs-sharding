import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0245', name: 'Jade Leroy', category: 'Support', amount: 391493 },
  { id: 'EMP-0246', name: 'Ada Michiels', category: 'Sales', amount: 324366 },
  { id: 'EMP-0247', name: 'Femke Martin', category: 'Engineering', amount: 421162 },
  { id: 'EMP-0248', name: 'Femke Pauwels', category: 'Engineering', amount: 475048 },
  { id: 'EMP-0249', name: 'Gert Pauwels', category: 'Legal', amount: 177708 },
  { id: 'EMP-0250', name: 'Ivo Segers', category: 'Sales', amount: 186024 },
  { id: 'EMP-0251', name: 'Jade Hermans', category: 'Support', amount: 48951 },
  { id: 'EMP-0252', name: 'Gert Michiels', category: 'Legal', amount: 478739 },
  { id: 'EMP-0253', name: 'Cleo Leroy', category: 'Engineering', amount: 543647 },
  { id: 'EMP-0254', name: 'Eva Lambert', category: 'Legal', amount: 649288 },
  { id: 'EMP-0255', name: 'Ben Pauwels', category: 'Sales', amount: 179916 },
  { id: 'EMP-0256', name: 'Hanna Hermans', category: 'Support', amount: 4255 },
  { id: 'EMP-0257', name: 'Ivo Michiels', category: 'Engineering', amount: 245701 },
  { id: 'EMP-0258', name: 'Dirk Lambert', category: 'Support', amount: 280007 },
  { id: 'EMP-0259', name: 'Femke Pauwels', category: 'Legal', amount: 37889 },
  { id: 'EMP-0260', name: 'Ben Pauwels', category: 'Legal', amount: 863854 },
  { id: 'EMP-0261', name: 'Femke Vermeulen', category: 'Support', amount: 869598 },
  { id: 'EMP-0262', name: 'Ivo Pauwels', category: 'Sales', amount: 152571 },
  { id: 'EMP-0263', name: 'Ben Lambert', category: 'Finance', amount: 532175 },
];

describe('EmployeeTable filtering', () => {
  it('filters, sorts and pages through 19 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'pauw');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-6 of 6');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-6 of 6');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0255');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0246');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0261');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0261');
    await user.clear(filter);
    await user.type(filter, 'EMP-0257');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });

  it('filters, sorts and pages through 19 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0245');
    await user.clear(filter);
    await user.type(filter, 'smet');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0245');
  });
});
