import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { EmployeeRow } from '../types';

const ROWS: EmployeeRow[] = [
  { id: 'EMP-0319', name: 'Jade Segers', category: 'Legal', amount: 854823 },
  { id: 'EMP-0320', name: 'Hanna Leroy', category: 'Legal', amount: 177844 },
  { id: 'EMP-0321', name: 'Eva Segers', category: 'Legal', amount: 93835 },
  { id: 'EMP-0322', name: 'Ivo Smet', category: 'Support', amount: 53494 },
  { id: 'EMP-0323', name: 'Ben Vermeulen', category: 'Engineering', amount: 390636 },
  { id: 'EMP-0324', name: 'Jade Smet', category: 'Engineering', amount: 713202 },
  { id: 'EMP-0325', name: 'Ivo Vermeulen', category: 'Legal', amount: 518424 },
  { id: 'EMP-0326', name: 'Dirk Leroy', category: 'Legal', amount: 73013 },
  { id: 'EMP-0327', name: 'Ivo Smet', category: 'Sales', amount: 488608 },
  { id: 'EMP-0328', name: 'Cleo Smet', category: 'Legal', amount: 88220 },
  { id: 'EMP-0329', name: 'Ivo Vermeulen', category: 'Legal', amount: 53594 },
  { id: 'EMP-0330', name: 'Femke Lambert', category: 'Finance', amount: 94464 },
  { id: 'EMP-0331', name: 'Femke Leroy', category: 'Finance', amount: 148418 },
  { id: 'EMP-0332', name: 'Eva Smet', category: 'Finance', amount: 402023 },
  { id: 'EMP-0333', name: 'Hanna Smet', category: 'Sales', amount: 826643 },
  { id: 'EMP-0334', name: 'Jade Smet', category: 'Finance', amount: 762426 },
  { id: 'EMP-0335', name: 'Cleo Segers', category: 'Finance', amount: 638324 },
  { id: 'EMP-0336', name: 'Femke Smet', category: 'Engineering', amount: 989588 },
  { id: 'EMP-0337', name: 'Ada Leroy', category: 'Legal', amount: 78095 },
];

describe('EmployeeTable search', () => {
  it('filters, sorts and pages through 19 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0319');
    await user.clear(filter);
    await user.type(filter, 'EMP-0336');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0336');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0322');
  });

  it('filters, sorts and pages through 19 employees', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<EmployeeTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'finance');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0319');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0322');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0332');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0322');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0322');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0322');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0332');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0336');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('EMP-0337');
  });
});
