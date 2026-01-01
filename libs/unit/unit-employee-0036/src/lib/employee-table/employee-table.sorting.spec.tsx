import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0245', name: 'Femke Pauwels', category: 'Legal', amount: 844236 },
  { id: 'EMP-0246', name: 'Hanna Michiels', category: 'Finance', amount: 974148 },
  { id: 'EMP-0247', name: 'Ben Smet', category: 'Finance', amount: 327192 },
  { id: 'EMP-0248', name: 'Cleo Smet', category: 'Sales', amount: 307138 },
  { id: 'EMP-0249', name: 'Femke Vermeulen', category: 'Engineering', amount: 899734 },
  { id: 'EMP-0250', name: 'Gert Martin', category: 'Sales', amount: 45566 },
  { id: 'EMP-0251', name: 'Femke Pauwels', category: 'Legal', amount: 153144 },
  { id: 'EMP-0252', name: 'Cleo Pauwels', category: 'Legal', amount: 743547 },
  { id: 'EMP-0253', name: 'Gert Michiels', category: 'Support', amount: 963266 },
  { id: 'EMP-0254', name: 'Ivo Leroy', category: 'Finance', amount: 651917 },
  { id: 'EMP-0255', name: 'Jade Vermeulen', category: 'Support', amount: 284374 },
  { id: 'EMP-0256', name: 'Cleo Michiels', category: 'Finance', amount: 160135 },
  { id: 'EMP-0257', name: 'Hanna Segers', category: 'Finance', amount: 206237 },
  { id: 'EMP-0258', name: 'Femke Vermeulen', category: 'Support', amount: 350693 },
  { id: 'EMP-0259', name: 'Eva Segers', category: 'Finance', amount: 68637 },
  { id: 'EMP-0260', name: 'Eva Segers', category: 'Finance', amount: 18291 },
  { id: 'EMP-0261', name: 'Dirk Smet', category: 'Support', amount: 393906 },
  { id: 'EMP-0262', name: 'Jade Segers', category: 'Legal', amount: 791330 },
  { id: 'EMP-0263', name: 'Hanna Pauwels', category: 'Legal', amount: 30517 },
];

describe('EmployeeTable sorting', () => {
  it('filters, sorts and pages through 19 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0255');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0245');
    await user.clear(filter);
    await user.type(filter, 'emp-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'support');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0261');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0253');
  });
});
