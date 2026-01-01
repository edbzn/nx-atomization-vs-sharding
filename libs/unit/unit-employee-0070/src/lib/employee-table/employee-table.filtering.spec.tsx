import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0050', name: 'Hanna Hermans', category: 'Finance', amount: 294608 },
  { id: 'EMP-0051', name: 'Hanna Segers', category: 'Support', amount: 253330 },
  { id: 'EMP-0052', name: 'Hanna Michiels', category: 'Finance', amount: 187550 },
  { id: 'EMP-0053', name: 'Femke Leroy', category: 'Sales', amount: 5381 },
  { id: 'EMP-0054', name: 'Femke Leroy', category: 'Engineering', amount: 669543 },
  { id: 'EMP-0055', name: 'Jade Aerts', category: 'Finance', amount: 625459 },
  { id: 'EMP-0056', name: 'Ben Aerts', category: 'Sales', amount: 688331 },
  { id: 'EMP-0057', name: 'Ada Hermans', category: 'Finance', amount: 674820 },
  { id: 'EMP-0058', name: 'Ben Hermans', category: 'Sales', amount: 161394 },
  { id: 'EMP-0059', name: 'Ada Leroy', category: 'Engineering', amount: 710392 },
  { id: 'EMP-0060', name: 'Gert Aerts', category: 'Engineering', amount: 657866 },
  { id: 'EMP-0061', name: 'Hanna Michiels', category: 'Sales', amount: 694372 },
  { id: 'EMP-0062', name: 'Ada Michiels', category: 'Sales', amount: 990628 },
  { id: 'EMP-0063', name: 'Cleo Smet', category: 'Finance', amount: 427911 },
  { id: 'EMP-0064', name: 'Ivo Martin', category: 'Sales', amount: 662055 },
  { id: 'EMP-0065', name: 'Cleo Martin', category: 'Legal', amount: 811478 },
];

describe('EmployeeTable filtering', () => {
  it('filters, sorts and pages through 16 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0050');
    await user.clear(filter);
    await user.type(filter, 'emp-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'emp-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });
});
