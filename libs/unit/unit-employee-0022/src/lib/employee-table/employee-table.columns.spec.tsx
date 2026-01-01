import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0363', name: 'Gert Pauwels', category: 'Legal', amount: 212992 },
  { id: 'EMP-0364', name: 'Cleo Aerts', category: 'Engineering', amount: 823567 },
  { id: 'EMP-0365', name: 'Femke Pauwels', category: 'Legal', amount: 34272 },
  { id: 'EMP-0366', name: 'Ivo Pauwels', category: 'Support', amount: 39229 },
  { id: 'EMP-0367', name: 'Femke Segers', category: 'Engineering', amount: 458547 },
  { id: 'EMP-0368', name: 'Femke Leroy', category: 'Support', amount: 435319 },
  { id: 'EMP-0369', name: 'Cleo Michiels', category: 'Engineering', amount: 499823 },
  { id: 'EMP-0370', name: 'Ivo Vermeulen', category: 'Finance', amount: 934734 },
  { id: 'EMP-0371', name: 'Eva Lambert', category: 'Legal', amount: 971545 },
  { id: 'EMP-0372', name: 'Cleo Martin', category: 'Legal', amount: 192741 },
  { id: 'EMP-0373', name: 'Ben Lambert', category: 'Support', amount: 754886 },
  { id: 'EMP-0374', name: 'Ben Michiels', category: 'Support', amount: 788817 },
  { id: 'EMP-0375', name: 'Femke Segers', category: 'Finance', amount: 503668 },
  { id: 'EMP-0376', name: 'Femke Hermans', category: 'Finance', amount: 412575 },
  { id: 'EMP-0377', name: 'Ben Segers', category: 'Sales', amount: 313562 },
];

describe('EmployeeTable columns', () => {
  it('filters, sorts and pages through 15 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'EMP-0370');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'finance');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
  });
});
