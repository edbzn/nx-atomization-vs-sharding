import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0056', name: 'Leased Carrier', category: 'Scooter', amount: 655704 },
  { id: 'VHC-0057', name: 'Compact Unit', category: 'Van', amount: 147400 },
  { id: 'VHC-0058', name: 'Rental Scout', category: 'Van', amount: 991431 },
  { id: 'VHC-0059', name: 'Spare Courier', category: 'Van', amount: 785622 },
  { id: 'VHC-0060', name: 'Field Rover', category: 'Scooter', amount: 929068 },
  { id: 'VHC-0061', name: 'Hybrid Scout', category: 'Scooter', amount: 9136 },
  { id: 'VHC-0062', name: 'Rental Shuttle', category: 'Bike', amount: 556846 },
  { id: 'VHC-0063', name: 'Compact Rover', category: 'Bike', amount: 835807 },
  { id: 'VHC-0064', name: 'Rental Runner', category: 'Sedan', amount: 547981 },
  { id: 'VHC-0065', name: 'Spare Carrier', category: 'Bike', amount: 152111 },
  { id: 'VHC-0066', name: 'Compact Shuttle', category: 'Scooter', amount: 965909 },
  { id: 'VHC-0067', name: 'Spare Runner', category: 'Scooter', amount: 839614 },
  { id: 'VHC-0068', name: 'Pool Hauler', category: 'Truck', amount: 168974 },
];

describe('VehicleTable filtering', () => {
  it('filters, sorts and pages through 13 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-13 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0066');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0056');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0068');
    await user.clear(filter);
    await user.type(filter, 'van');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0057');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0061');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-13 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0060');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0063');
  });

  it('filters, sorts and pages through 13 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'vhc-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'carrie');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
  });
});
