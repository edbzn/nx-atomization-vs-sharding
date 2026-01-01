import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0359', name: 'Ben Lambert', category: 'Legal', amount: 829724 },
  { id: 'EMP-0360', name: 'Eva Lambert', category: 'Engineering', amount: 737297 },
  { id: 'EMP-0361', name: 'Dirk Smet', category: 'Legal', amount: 287544 },
  { id: 'EMP-0362', name: 'Ada Lambert', category: 'Engineering', amount: 377152 },
  { id: 'EMP-0363', name: 'Ben Hermans', category: 'Support', amount: 673047 },
  { id: 'EMP-0364', name: 'Hanna Segers', category: 'Finance', amount: 971047 },
  { id: 'EMP-0365', name: 'Ada Pauwels', category: 'Engineering', amount: 797211 },
  { id: 'EMP-0366', name: 'Gert Michiels', category: 'Finance', amount: 145903 },
  { id: 'EMP-0367', name: 'Cleo Segers', category: 'Finance', amount: 239837 },
  { id: 'EMP-0368', name: 'Hanna Vermeulen', category: 'Engineering', amount: 965488 },
  { id: 'EMP-0369', name: 'Femke Vermeulen', category: 'Engineering', amount: 986885 },
  { id: 'EMP-0370', name: 'Femke Martin', category: 'Engineering', amount: 214109 },
  { id: 'EMP-0371', name: 'Ada Lambert', category: 'Legal', amount: 452756 },
  { id: 'EMP-0372', name: 'Ben Martin', category: 'Sales', amount: 141557 },
];

describe('EmployeeTable large dataset', () => {
  it('filters, sorts and pages through 14 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'EMP-0363');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0359');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0369');
  });
});
