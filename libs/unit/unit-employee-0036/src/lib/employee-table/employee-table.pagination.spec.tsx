import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0324', name: 'Cleo Segers', category: 'Sales', amount: 244120 },
  { id: 'EMP-0325', name: 'Cleo Michiels', category: 'Engineering', amount: 142754 },
  { id: 'EMP-0326', name: 'Ivo Pauwels', category: 'Legal', amount: 1048 },
  { id: 'EMP-0327', name: 'Cleo Vermeulen', category: 'Finance', amount: 18679 },
  { id: 'EMP-0328', name: 'Cleo Vermeulen', category: 'Engineering', amount: 76693 },
  { id: 'EMP-0329', name: 'Cleo Pauwels', category: 'Engineering', amount: 316656 },
  { id: 'EMP-0330', name: 'Ben Hermans', category: 'Legal', amount: 641314 },
  { id: 'EMP-0331', name: 'Ivo Segers', category: 'Support', amount: 998657 },
  { id: 'EMP-0332', name: 'Jade Pauwels', category: 'Support', amount: 134815 },
  { id: 'EMP-0333', name: 'Ivo Smet', category: 'Finance', amount: 913259 },
  { id: 'EMP-0334', name: 'Gert Pauwels', category: 'Support', amount: 618476 },
  { id: 'EMP-0335', name: 'Ben Vermeulen', category: 'Engineering', amount: 311555 },
  { id: 'EMP-0336', name: 'Cleo Lambert', category: 'Finance', amount: 394756 },
  { id: 'EMP-0337', name: 'Ben Aerts', category: 'Legal', amount: 206719 },
  { id: 'EMP-0338', name: 'Dirk Martin', category: 'Finance', amount: 443151 },
  { id: 'EMP-0339', name: 'Jade Segers', category: 'Sales', amount: 569544 },
];

describe('EmployeeTable pagination', () => {
  it('filters, sorts and pages through 16 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0337');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-16 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0334');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0324');
  });
});
