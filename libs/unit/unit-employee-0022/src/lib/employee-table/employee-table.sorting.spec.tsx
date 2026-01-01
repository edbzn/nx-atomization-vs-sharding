import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0236', name: 'Hanna Leroy', category: 'Support', amount: 312310 },
  { id: 'EMP-0237', name: 'Hanna Leroy', category: 'Support', amount: 164880 },
  { id: 'EMP-0238', name: 'Hanna Smet', category: 'Support', amount: 563972 },
  { id: 'EMP-0239', name: 'Femke Martin', category: 'Legal', amount: 346563 },
  { id: 'EMP-0240', name: 'Hanna Smet', category: 'Engineering', amount: 795145 },
  { id: 'EMP-0241', name: 'Eva Smet', category: 'Support', amount: 83141 },
  { id: 'EMP-0242', name: 'Femke Smet', category: 'Engineering', amount: 959407 },
  { id: 'EMP-0243', name: 'Ben Michiels', category: 'Engineering', amount: 136759 },
  { id: 'EMP-0244', name: 'Ada Hermans', category: 'Sales', amount: 29755 },
  { id: 'EMP-0245', name: 'Ada Michiels', category: 'Legal', amount: 210986 },
  { id: 'EMP-0246', name: 'Femke Martin', category: 'Sales', amount: 81859 },
  { id: 'EMP-0247', name: 'Cleo Segers', category: 'Finance', amount: 354854 },
  { id: 'EMP-0248', name: 'Hanna Segers', category: 'Support', amount: 474103 },
  { id: 'EMP-0249', name: 'Jade Martin', category: 'Support', amount: 53752 },
  { id: 'EMP-0250', name: 'Jade Hermans', category: 'Support', amount: 885446 },
  { id: 'EMP-0251', name: 'Ivo Hermans', category: 'Engineering', amount: 862677 },
  { id: 'EMP-0252', name: 'Cleo Pauwels', category: 'Finance', amount: 151842 },
  { id: 'EMP-0253', name: 'Jade Martin', category: 'Engineering', amount: 609431 },
  { id: 'EMP-0254', name: 'Femke Smet', category: 'Legal', amount: 265161 },
  { id: 'EMP-0255', name: 'Gert Michiels', category: 'Support', amount: 308838 },
];

describe('EmployeeTable sorting', () => {
  it('filters, sorts and pages through 20 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'mic');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0245');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0244');
  });
});
