import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0393', name: 'Femke Aerts', category: 'Legal', amount: 853113 },
  { id: 'EMP-0394', name: 'Hanna Vermeulen', category: 'Finance', amount: 55218 },
  { id: 'EMP-0395', name: 'Gert Lambert', category: 'Support', amount: 653439 },
  { id: 'EMP-0396', name: 'Ben Leroy', category: 'Support', amount: 850344 },
  { id: 'EMP-0397', name: 'Dirk Segers', category: 'Sales', amount: 57465 },
  { id: 'EMP-0398', name: 'Femke Segers', category: 'Finance', amount: 973792 },
  { id: 'EMP-0399', name: 'Gert Michiels', category: 'Support', amount: 191347 },
  { id: 'EMP-0400', name: 'Ada Michiels', category: 'Support', amount: 457650 },
  { id: 'EMP-0401', name: 'Gert Leroy', category: 'Engineering', amount: 601056 },
  { id: 'EMP-0402', name: 'Ada Vermeulen', category: 'Support', amount: 146724 },
  { id: 'EMP-0403', name: 'Ada Michiels', category: 'Finance', amount: 459222 },
  { id: 'EMP-0404', name: 'Eva Smet', category: 'Legal', amount: 596517 },
  { id: 'EMP-0405', name: 'Ivo Hermans', category: 'Sales', amount: 136569 },
  { id: 'EMP-0406', name: 'Hanna Martin', category: 'Legal', amount: 935057 },
  { id: 'EMP-0407', name: 'Dirk Pauwels', category: 'Legal', amount: 616460 },
];

describe('EmployeeTable search', () => {
  it('filters, sorts and pages through 15 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'EMP-0402');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0402');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0402');
  });
});
