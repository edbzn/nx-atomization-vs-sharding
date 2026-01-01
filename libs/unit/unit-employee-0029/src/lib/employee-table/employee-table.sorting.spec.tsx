import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0170', name: 'Ivo Pauwels', category: 'Finance', amount: 966562 },
  { id: 'EMP-0171', name: 'Ben Pauwels', category: 'Legal', amount: 876123 },
  { id: 'EMP-0172', name: 'Ben Hermans', category: 'Finance', amount: 226349 },
  { id: 'EMP-0173', name: 'Ivo Lambert', category: 'Finance', amount: 388607 },
  { id: 'EMP-0174', name: 'Dirk Smet', category: 'Support', amount: 724694 },
  { id: 'EMP-0175', name: 'Eva Aerts', category: 'Engineering', amount: 696334 },
  { id: 'EMP-0176', name: 'Ben Michiels', category: 'Legal', amount: 19676 },
  { id: 'EMP-0177', name: 'Femke Martin', category: 'Engineering', amount: 471108 },
  { id: 'EMP-0178', name: 'Ben Smet', category: 'Support', amount: 186725 },
  { id: 'EMP-0179', name: 'Jade Aerts', category: 'Engineering', amount: 85995 },
  { id: 'EMP-0180', name: 'Dirk Vermeulen', category: 'Support', amount: 856065 },
  { id: 'EMP-0181', name: 'Ben Michiels', category: 'Engineering', amount: 586390 },
  { id: 'EMP-0182', name: 'Ada Lambert', category: 'Legal', amount: 312420 },
  { id: 'EMP-0183', name: 'Dirk Leroy', category: 'Finance', amount: 879540 },
];

describe('EmployeeTable sorting', () => {
  it('filters, sorts and pages through 14 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0180');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0170');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0180');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0182');
  });
});
