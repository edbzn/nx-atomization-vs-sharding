import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0025', name: 'Jade Smet', category: 'Sales', amount: 545383 },
  { id: 'EMP-0026', name: 'Cleo Pauwels', category: 'Support', amount: 257437 },
  { id: 'EMP-0027', name: 'Dirk Leroy', category: 'Sales', amount: 835673 },
  { id: 'EMP-0028', name: 'Dirk Segers', category: 'Finance', amount: 109895 },
  { id: 'EMP-0029', name: 'Ben Michiels', category: 'Legal', amount: 843288 },
  { id: 'EMP-0030', name: 'Ada Leroy', category: 'Finance', amount: 398073 },
  { id: 'EMP-0031', name: 'Dirk Michiels', category: 'Sales', amount: 380832 },
  { id: 'EMP-0032', name: 'Eva Lambert', category: 'Legal', amount: 151523 },
  { id: 'EMP-0033', name: 'Eva Lambert', category: 'Engineering', amount: 326353 },
  { id: 'EMP-0034', name: 'Hanna Leroy', category: 'Sales', amount: 252642 },
  { id: 'EMP-0035', name: 'Jade Pauwels', category: 'Support', amount: 523916 },
  { id: 'EMP-0036', name: 'Dirk Aerts', category: 'Legal', amount: 255199 },
  { id: 'EMP-0037', name: 'Dirk Lambert', category: 'Engineering', amount: 17070 },
];

describe('EmployeeTable pagination', () => {
  it('filters, sorts and pages through 13 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0030');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0030');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0025');
  });

  it('filters, sorts and pages through 13 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-13 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0035');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0030');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-13 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0034');
  });
});
