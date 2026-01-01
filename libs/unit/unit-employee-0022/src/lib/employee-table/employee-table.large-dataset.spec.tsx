import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0381', name: 'Jade Michiels', category: 'Engineering', amount: 337634 },
  { id: 'EMP-0382', name: 'Gert Lambert', category: 'Sales', amount: 508235 },
  { id: 'EMP-0383', name: 'Cleo Vermeulen', category: 'Engineering', amount: 409256 },
  { id: 'EMP-0384', name: 'Eva Smet', category: 'Finance', amount: 813604 },
  { id: 'EMP-0385', name: 'Ada Hermans', category: 'Finance', amount: 724911 },
  { id: 'EMP-0386', name: 'Hanna Hermans', category: 'Support', amount: 490082 },
  { id: 'EMP-0387', name: 'Ada Vermeulen', category: 'Support', amount: 976401 },
  { id: 'EMP-0388', name: 'Ben Leroy', category: 'Engineering', amount: 660562 },
  { id: 'EMP-0389', name: 'Cleo Leroy', category: 'Engineering', amount: 464089 },
  { id: 'EMP-0390', name: 'Hanna Leroy', category: 'Finance', amount: 724704 },
  { id: 'EMP-0391', name: 'Cleo Martin', category: 'Legal', amount: 855704 },
  { id: 'EMP-0392', name: 'Femke Michiels', category: 'Legal', amount: 333365 },
  { id: 'EMP-0393', name: 'Cleo Lambert', category: 'Sales', amount: 540601 },
  { id: 'EMP-0394', name: 'Dirk Martin', category: 'Engineering', amount: 745887 },
  { id: 'EMP-0395', name: 'Dirk Michiels', category: 'Sales', amount: 704400 },
  { id: 'EMP-0396', name: 'Ivo Leroy', category: 'Support', amount: 302446 },
];

describe('EmployeeTable large dataset', () => {
  it('filters, sorts and pages through 16 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0396');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0381');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0381');
    await user.clear(filter);
    await user.type(filter, 'mic');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
  });
});
