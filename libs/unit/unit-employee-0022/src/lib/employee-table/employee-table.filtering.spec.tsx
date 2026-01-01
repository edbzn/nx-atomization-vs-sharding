import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0170', name: 'Cleo Martin', category: 'Legal', amount: 459382 },
  { id: 'EMP-0171', name: 'Femke Lambert', category: 'Support', amount: 901087 },
  { id: 'EMP-0172', name: 'Hanna Lambert', category: 'Support', amount: 98446 },
  { id: 'EMP-0173', name: 'Dirk Hermans', category: 'Engineering', amount: 677114 },
  { id: 'EMP-0174', name: 'Ada Martin', category: 'Engineering', amount: 227166 },
  { id: 'EMP-0175', name: 'Hanna Lambert', category: 'Finance', amount: 580889 },
  { id: 'EMP-0176', name: 'Eva Lambert', category: 'Legal', amount: 968142 },
  { id: 'EMP-0177', name: 'Femke Lambert', category: 'Support', amount: 964046 },
  { id: 'EMP-0178', name: 'Gert Smet', category: 'Engineering', amount: 827216 },
  { id: 'EMP-0179', name: 'Ada Michiels', category: 'Engineering', amount: 1888 },
  { id: 'EMP-0180', name: 'Dirk Lambert', category: 'Sales', amount: 219759 },
  { id: 'EMP-0181', name: 'Ada Pauwels', category: 'Finance', amount: 752008 },
  { id: 'EMP-0182', name: 'Femke Segers', category: 'Sales', amount: 768394 },
  { id: 'EMP-0183', name: 'Dirk Segers', category: 'Sales', amount: 966207 },
  { id: 'EMP-0184', name: 'Jade Aerts', category: 'Finance', amount: 224962 },
  { id: 'EMP-0185', name: 'Eva Martin', category: 'Engineering', amount: 826998 },
  { id: 'EMP-0186', name: 'Cleo Michiels', category: 'Legal', amount: 942293 },
  { id: 'EMP-0187', name: 'Eva Segers', category: 'Engineering', amount: 588003 },
];

describe('EmployeeTable filtering', () => {
  it('filters, sorts and pages through 18 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0170');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0170');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0170');
    await user.clear(filter);
    await user.type(filter, 'emp-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'Ben');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0179');
    await user.clear(filter);
    await user.type(filter, 'Eva');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0179');
  });
});
