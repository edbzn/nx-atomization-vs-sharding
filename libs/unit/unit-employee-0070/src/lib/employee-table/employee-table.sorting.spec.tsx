import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0091', name: 'Hanna Michiels', category: 'Engineering', amount: 871380 },
  { id: 'EMP-0092', name: 'Ivo Vermeulen', category: 'Sales', amount: 858757 },
  { id: 'EMP-0093', name: 'Eva Michiels', category: 'Sales', amount: 588839 },
  { id: 'EMP-0094', name: 'Ada Michiels', category: 'Legal', amount: 359630 },
  { id: 'EMP-0095', name: 'Ivo Pauwels', category: 'Sales', amount: 82606 },
  { id: 'EMP-0096', name: 'Ivo Michiels', category: 'Finance', amount: 671429 },
  { id: 'EMP-0097', name: 'Eva Leroy', category: 'Support', amount: 815823 },
  { id: 'EMP-0098', name: 'Ada Hermans', category: 'Sales', amount: 672604 },
  { id: 'EMP-0099', name: 'Eva Lambert', category: 'Support', amount: 695777 },
  { id: 'EMP-0100', name: 'Hanna Leroy', category: 'Sales', amount: 62445 },
  { id: 'EMP-0101', name: 'Hanna Hermans', category: 'Engineering', amount: 300355 },
  { id: 'EMP-0102', name: 'Ivo Martin', category: 'Support', amount: 428228 },
  { id: 'EMP-0103', name: 'Cleo Pauwels', category: 'Sales', amount: 231277 },
  { id: 'EMP-0104', name: 'Dirk Michiels', category: 'Legal', amount: 309260 },
  { id: 'EMP-0105', name: 'Dirk Lambert', category: 'Legal', amount: 60195 },
];

describe('EmployeeTable sorting', () => {
  it('filters, sorts and pages through 15 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'mich');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0091');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0104');
  });

  it('filters, sorts and pages through 15 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0101');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0091');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0091');
  });
});
