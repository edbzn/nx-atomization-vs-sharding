import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0378', name: 'Ada Vermeulen', category: 'Engineering', amount: 918375 },
  { id: 'EMP-0379', name: 'Dirk Leroy', category: 'Legal', amount: 583282 },
  { id: 'EMP-0380', name: 'Cleo Smet', category: 'Finance', amount: 753087 },
  { id: 'EMP-0381', name: 'Ivo Martin', category: 'Engineering', amount: 629433 },
  { id: 'EMP-0382', name: 'Cleo Leroy', category: 'Legal', amount: 308123 },
  { id: 'EMP-0383', name: 'Ivo Aerts', category: 'Engineering', amount: 360332 },
  { id: 'EMP-0384', name: 'Femke Lambert', category: 'Finance', amount: 598763 },
  { id: 'EMP-0385', name: 'Ivo Aerts', category: 'Finance', amount: 889875 },
  { id: 'EMP-0386', name: 'Cleo Vermeulen', category: 'Legal', amount: 622721 },
  { id: 'EMP-0387', name: 'Gert Vermeulen', category: 'Finance', amount: 44824 },
  { id: 'EMP-0388', name: 'Ben Lambert', category: 'Finance', amount: 274282 },
  { id: 'EMP-0389', name: 'Jade Lambert', category: 'Finance', amount: 112677 },
  { id: 'EMP-0390', name: 'Ada Vermeulen', category: 'Finance', amount: 85845 },
  { id: 'EMP-0391', name: 'Ada Vermeulen', category: 'Finance', amount: 974819 },
  { id: 'EMP-0392', name: 'Eva Segers', category: 'Engineering', amount: 722102 },
  { id: 'EMP-0393', name: 'Femke Martin', category: 'Support', amount: 436338 },
  { id: 'EMP-0394', name: 'Ada Pauwels', category: 'Sales', amount: 485739 },
  { id: 'EMP-0395', name: 'Ivo Segers', category: 'Finance', amount: 97537 },
];

describe('EmployeeTable pagination', () => {
  it('filters, sorts and pages through 18 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0387');
    await user.clear(filter);
    await user.type(filter, 'EMP-0378');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'emp-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'aerts');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0387');
    await user.clear(filter);
    await user.type(filter, 'EMP-0387');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });
});
