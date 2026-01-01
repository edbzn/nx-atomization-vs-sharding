import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0161', name: 'Ada Smet', category: 'Engineering', amount: 638698 },
  { id: 'EMP-0162', name: 'Ivo Pauwels', category: 'Engineering', amount: 202459 },
  { id: 'EMP-0163', name: 'Gert Martin', category: 'Support', amount: 447609 },
  { id: 'EMP-0164', name: 'Ivo Aerts', category: 'Sales', amount: 818400 },
  { id: 'EMP-0165', name: 'Ivo Vermeulen', category: 'Sales', amount: 839023 },
  { id: 'EMP-0166', name: 'Ada Aerts', category: 'Sales', amount: 144963 },
  { id: 'EMP-0167', name: 'Ivo Lambert', category: 'Finance', amount: 307816 },
  { id: 'EMP-0168', name: 'Hanna Aerts', category: 'Sales', amount: 419837 },
  { id: 'EMP-0169', name: 'Cleo Segers', category: 'Sales', amount: 861497 },
  { id: 'EMP-0170', name: 'Cleo Martin', category: 'Support', amount: 602436 },
  { id: 'EMP-0171', name: 'Ivo Martin', category: 'Sales', amount: 618079 },
  { id: 'EMP-0172', name: 'Femke Smet', category: 'Finance', amount: 815087 },
  { id: 'EMP-0173', name: 'Femke Vermeulen', category: 'Sales', amount: 933121 },
  { id: 'EMP-0174', name: 'Jade Michiels', category: 'Sales', amount: 83144 },
  { id: 'EMP-0175', name: 'Dirk Vermeulen', category: 'Finance', amount: 337012 },
  { id: 'EMP-0176', name: 'Ben Lambert', category: 'Finance', amount: 22244 },
  { id: 'EMP-0177', name: 'Femke Michiels', category: 'Support', amount: 704903 },
  { id: 'EMP-0178', name: 'Jade Lambert', category: 'Support', amount: 804903 },
];

describe('EmployeeTable sorting', () => {
  it('filters, sorts and pages through 18 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0161');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0176');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0173');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0173');
  });
});
