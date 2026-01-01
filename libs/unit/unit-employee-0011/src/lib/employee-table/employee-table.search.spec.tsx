import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0085', name: 'Hanna Smet', category: 'Sales', amount: 517266 },
  { id: 'EMP-0086', name: 'Jade Vermeulen', category: 'Sales', amount: 393826 },
  { id: 'EMP-0087', name: 'Femke Segers', category: 'Support', amount: 249981 },
  { id: 'EMP-0088', name: 'Ivo Aerts', category: 'Legal', amount: 368733 },
  { id: 'EMP-0089', name: 'Cleo Martin', category: 'Engineering', amount: 891062 },
  { id: 'EMP-0090', name: 'Eva Pauwels', category: 'Support', amount: 186437 },
  { id: 'EMP-0091', name: 'Gert Vermeulen', category: 'Support', amount: 313017 },
  { id: 'EMP-0092', name: 'Ben Smet', category: 'Legal', amount: 873102 },
  { id: 'EMP-0093', name: 'Gert Pauwels', category: 'Legal', amount: 68103 },
  { id: 'EMP-0094', name: 'Femke Lambert', category: 'Sales', amount: 357650 },
  { id: 'EMP-0095', name: 'Gert Pauwels', category: 'Legal', amount: 496688 },
  { id: 'EMP-0096', name: 'Ben Aerts', category: 'Legal', amount: 778981 },
  { id: 'EMP-0097', name: 'Ben Michiels', category: 'Finance', amount: 167942 },
  { id: 'EMP-0098', name: 'Ada Smet', category: 'Engineering', amount: 529114 },
  { id: 'EMP-0099', name: 'Ivo Martin', category: 'Finance', amount: 648304 },
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
    await user.type(filter, 'legal');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    await user.clear(filter);
    await user.type(filter, 'engineering');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0098');
    await user.clear(filter);
    await user.type(filter, 'Cleo');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0089');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0086');
  });

  it('filters, sorts and pages through 15 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'Jad');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'pauw');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0085');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0085');
    await user.clear(filter);
    await user.type(filter, 'emp-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });
});
