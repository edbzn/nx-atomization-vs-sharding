import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0191', name: 'Eva Lambert', category: 'Legal', amount: 378950 },
  { id: 'EMP-0192', name: 'Femke Segers', category: 'Sales', amount: 304083 },
  { id: 'EMP-0193', name: 'Ada Michiels', category: 'Support', amount: 652516 },
  { id: 'EMP-0194', name: 'Ada Lambert', category: 'Legal', amount: 533386 },
  { id: 'EMP-0195', name: 'Hanna Vermeulen', category: 'Engineering', amount: 832313 },
  { id: 'EMP-0196', name: 'Ivo Lambert', category: 'Support', amount: 349725 },
  { id: 'EMP-0197', name: 'Hanna Leroy', category: 'Sales', amount: 395667 },
  { id: 'EMP-0198', name: 'Ben Leroy', category: 'Support', amount: 773671 },
  { id: 'EMP-0199', name: 'Ivo Aerts', category: 'Finance', amount: 690578 },
  { id: 'EMP-0200', name: 'Ada Hermans', category: 'Sales', amount: 475064 },
  { id: 'EMP-0201', name: 'Ben Pauwels', category: 'Engineering', amount: 366875 },
  { id: 'EMP-0202', name: 'Ada Smet', category: 'Engineering', amount: 532429 },
];

describe('EmployeeTable empty results', () => {
  it('filters, sorts and pages through 12 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0191');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0192');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-12 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0198');
  });

  it('filters, sorts and pages through 12 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'Eva');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0191');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0191');
    await user.clear(filter);
    await user.type(filter, 'emp-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });
});
