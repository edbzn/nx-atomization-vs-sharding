import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0298', name: 'Ben Vermeulen', category: 'Finance', amount: 761991 },
  { id: 'EMP-0299', name: 'Dirk Pauwels', category: 'Support', amount: 886953 },
  { id: 'EMP-0300', name: 'Ada Lambert', category: 'Sales', amount: 254489 },
  { id: 'EMP-0301', name: 'Jade Pauwels', category: 'Support', amount: 649326 },
  { id: 'EMP-0302', name: 'Ada Segers', category: 'Support', amount: 827883 },
  { id: 'EMP-0303', name: 'Femke Lambert', category: 'Legal', amount: 719208 },
  { id: 'EMP-0304', name: 'Femke Segers', category: 'Legal', amount: 203285 },
  { id: 'EMP-0305', name: 'Ada Hermans', category: 'Sales', amount: 777058 },
  { id: 'EMP-0306', name: 'Gert Leroy', category: 'Legal', amount: 565971 },
  { id: 'EMP-0307', name: 'Ada Leroy', category: 'Legal', amount: 676918 },
  { id: 'EMP-0308', name: 'Gert Pauwels', category: 'Legal', amount: 800671 },
  { id: 'EMP-0309', name: 'Gert Hermans', category: 'Legal', amount: 241029 },
  { id: 'EMP-0310', name: 'Cleo Segers', category: 'Legal', amount: 25106 },
  { id: 'EMP-0311', name: 'Dirk Leroy', category: 'Support', amount: 346556 },
  { id: 'EMP-0312', name: 'Jade Segers', category: 'Legal', amount: 36163 },
  { id: 'EMP-0313', name: 'Gert Leroy', category: 'Engineering', amount: 271719 },
  { id: 'EMP-0314', name: 'Dirk Segers', category: 'Support', amount: 523109 },
  { id: 'EMP-0315', name: 'Ivo Aerts', category: 'Support', amount: 378370 },
  { id: 'EMP-0316', name: 'Ivo Michiels', category: 'Sales', amount: 42234 },
  { id: 'EMP-0317', name: 'Dirk Aerts', category: 'Finance', amount: 248437 },
];

describe('EmployeeTable columns', () => {
  it('filters, sorts and pages through 20 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-20 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0308');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0298');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0310');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-20 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0314');
  });
});
