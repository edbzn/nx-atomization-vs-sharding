import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0215', name: 'Eva Vermeulen', category: 'Support', amount: 827905 },
  { id: 'EMP-0216', name: 'Hanna Pauwels', category: 'Legal', amount: 243177 },
  { id: 'EMP-0217', name: 'Ben Michiels', category: 'Support', amount: 322693 },
  { id: 'EMP-0218', name: 'Jade Leroy', category: 'Finance', amount: 26551 },
  { id: 'EMP-0219', name: 'Ivo Vermeulen', category: 'Legal', amount: 320997 },
  { id: 'EMP-0220', name: 'Ada Lambert', category: 'Finance', amount: 117707 },
  { id: 'EMP-0221', name: 'Gert Vermeulen', category: 'Sales', amount: 579637 },
  { id: 'EMP-0222', name: 'Gert Hermans', category: 'Engineering', amount: 754158 },
  { id: 'EMP-0223', name: 'Ben Aerts', category: 'Engineering', amount: 122053 },
  { id: 'EMP-0224', name: 'Ada Pauwels', category: 'Legal', amount: 749887 },
  { id: 'EMP-0225', name: 'Hanna Segers', category: 'Engineering', amount: 775972 },
  { id: 'EMP-0226', name: 'Femke Lambert', category: 'Support', amount: 256279 },
  { id: 'EMP-0227', name: 'Eva Martin', category: 'Finance', amount: 808604 },
  { id: 'EMP-0228', name: 'Hanna Michiels', category: 'Finance', amount: 373947 },
  { id: 'EMP-0229', name: 'Dirk Smet', category: 'Sales', amount: 688463 },
  { id: 'EMP-0230', name: 'Ben Vermeulen', category: 'Finance', amount: 48595 },
  { id: 'EMP-0231', name: 'Eva Smet', category: 'Sales', amount: 695110 },
  { id: 'EMP-0232', name: 'Eva Pauwels', category: 'Engineering', amount: 684763 },
];

describe('EmployeeTable filtering', () => {
  it('filters, sorts and pages through 18 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0220');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0226');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0220');
  });
});
