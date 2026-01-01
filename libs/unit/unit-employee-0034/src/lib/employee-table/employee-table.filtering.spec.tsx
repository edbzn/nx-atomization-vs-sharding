import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0198', name: 'Ivo Michiels', category: 'Support', amount: 419890 },
  { id: 'EMP-0199', name: 'Ben Vermeulen', category: 'Finance', amount: 462530 },
  { id: 'EMP-0200', name: 'Jade Smet', category: 'Finance', amount: 317742 },
  { id: 'EMP-0201', name: 'Hanna Pauwels', category: 'Sales', amount: 905952 },
  { id: 'EMP-0202', name: 'Jade Vermeulen', category: 'Legal', amount: 590892 },
  { id: 'EMP-0203', name: 'Ada Michiels', category: 'Support', amount: 592986 },
  { id: 'EMP-0204', name: 'Dirk Smet', category: 'Legal', amount: 469423 },
  { id: 'EMP-0205', name: 'Ivo Lambert', category: 'Sales', amount: 832302 },
  { id: 'EMP-0206', name: 'Femke Segers', category: 'Sales', amount: 988718 },
  { id: 'EMP-0207', name: 'Ada Pauwels', category: 'Sales', amount: 955788 },
  { id: 'EMP-0208', name: 'Femke Hermans', category: 'Engineering', amount: 542244 },
  { id: 'EMP-0209', name: 'Jade Hermans', category: 'Legal', amount: 782308 },
  { id: 'EMP-0210', name: 'Dirk Aerts', category: 'Support', amount: 905895 },
  { id: 'EMP-0211', name: 'Jade Lambert', category: 'Sales', amount: 658139 },
  { id: 'EMP-0212', name: 'Gert Vermeulen', category: 'Engineering', amount: 782962 },
  { id: 'EMP-0213', name: 'Dirk Pauwels', category: 'Sales', amount: 954606 },
  { id: 'EMP-0214', name: 'Cleo Vermeulen', category: 'Legal', amount: 888320 },
  { id: 'EMP-0215', name: 'Femke Michiels', category: 'Sales', amount: 812633 },
  { id: 'EMP-0216', name: 'Cleo Martin', category: 'Support', amount: 924368 },
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
    await user.type(filter, 'sales');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-7 of 7');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-7 of 7');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0201');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0198');
  });
});
