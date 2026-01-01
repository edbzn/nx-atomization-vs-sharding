import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0242', name: 'Jade Lambert', category: 'Sales', amount: 863304 },
  { id: 'EMP-0243', name: 'Femke Hermans', category: 'Support', amount: 978551 },
  { id: 'EMP-0244', name: 'Ivo Martin', category: 'Support', amount: 400596 },
  { id: 'EMP-0245', name: 'Ada Aerts', category: 'Finance', amount: 477359 },
  { id: 'EMP-0246', name: 'Eva Vermeulen', category: 'Legal', amount: 10880 },
  { id: 'EMP-0247', name: 'Eva Smet', category: 'Support', amount: 668985 },
  { id: 'EMP-0248', name: 'Ada Martin', category: 'Legal', amount: 535880 },
  { id: 'EMP-0249', name: 'Dirk Leroy', category: 'Support', amount: 823275 },
  { id: 'EMP-0250', name: 'Ben Smet', category: 'Legal', amount: 864174 },
  { id: 'EMP-0251', name: 'Femke Vermeulen', category: 'Finance', amount: 126150 },
  { id: 'EMP-0252', name: 'Hanna Segers', category: 'Support', amount: 493521 },
  { id: 'EMP-0253', name: 'Eva Martin', category: 'Finance', amount: 359255 },
  { id: 'EMP-0254', name: 'Ivo Hermans', category: 'Sales', amount: 869449 },
  { id: 'EMP-0255', name: 'Hanna Martin', category: 'Engineering', amount: 886024 },
  { id: 'EMP-0256', name: 'Ben Vermeulen', category: 'Sales', amount: 717055 },
];

describe('EmployeeTable search', () => {
  it('filters, sorts and pages through 15 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0252');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0242');
    await user.clear(filter);
    await user.type(filter, 'Dirk');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0242');
  });
});
