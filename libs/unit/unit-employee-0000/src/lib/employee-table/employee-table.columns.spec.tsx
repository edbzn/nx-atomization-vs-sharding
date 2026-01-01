import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0294', name: 'Ben Leroy', category: 'Finance', amount: 384676 },
  { id: 'EMP-0295', name: 'Jade Vermeulen', category: 'Finance', amount: 368966 },
  { id: 'EMP-0296', name: 'Ada Pauwels', category: 'Sales', amount: 591776 },
  { id: 'EMP-0297', name: 'Ivo Pauwels', category: 'Support', amount: 923138 },
  { id: 'EMP-0298', name: 'Femke Leroy', category: 'Legal', amount: 93882 },
  { id: 'EMP-0299', name: 'Eva Martin', category: 'Support', amount: 178077 },
  { id: 'EMP-0300', name: 'Gert Michiels', category: 'Legal', amount: 113710 },
  { id: 'EMP-0301', name: 'Dirk Leroy', category: 'Sales', amount: 142829 },
  { id: 'EMP-0302', name: 'Eva Vermeulen', category: 'Finance', amount: 942778 },
  { id: 'EMP-0303', name: 'Hanna Michiels', category: 'Finance', amount: 205162 },
  { id: 'EMP-0304', name: 'Ivo Hermans', category: 'Finance', amount: 469131 },
  { id: 'EMP-0305', name: 'Ben Smet', category: 'Finance', amount: 813401 },
  { id: 'EMP-0306', name: 'Gert Hermans', category: 'Finance', amount: 888694 },
  { id: 'EMP-0307', name: 'Ben Aerts', category: 'Engineering', amount: 579340 },
];

describe('EmployeeTable columns', () => {
  it('filters, sorts and pages through 14 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0298');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0302');
    await user.clear(filter);
    await user.type(filter, 'emp-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0302');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0299');
  });
});
