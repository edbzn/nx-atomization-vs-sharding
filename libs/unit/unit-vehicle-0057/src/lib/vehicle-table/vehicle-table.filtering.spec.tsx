import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0284', name: 'Spare Rover', category: 'Truck', amount: 484231 },
  { id: 'VHC-0285', name: 'Diesel Hauler', category: 'Sedan', amount: 292772 },
  { id: 'VHC-0286', name: 'Compact Carrier', category: 'Bike', amount: 191242 },
  { id: 'VHC-0287', name: 'Cargo Shuttle', category: 'Truck', amount: 726542 },
  { id: 'VHC-0288', name: 'Rental Scout', category: 'Bike', amount: 500193 },
  { id: 'VHC-0289', name: 'Spare Carrier', category: 'Van', amount: 515965 },
  { id: 'VHC-0290', name: 'Field Tender', category: 'Sedan', amount: 146986 },
  { id: 'VHC-0291', name: 'Field Mover', category: 'Scooter', amount: 559359 },
  { id: 'VHC-0292', name: 'Leased Rover', category: 'Van', amount: 690522 },
  { id: 'VHC-0293', name: 'Hybrid Scout', category: 'Scooter', amount: 258569 },
  { id: 'VHC-0294', name: 'Rental Shuttle', category: 'Scooter', amount: 856758 },
  { id: 'VHC-0295', name: 'Electric Scout', category: 'Van', amount: 303775 },
  { id: 'VHC-0296', name: 'Cargo Unit', category: 'Scooter', amount: 228105 },
  { id: 'VHC-0297', name: 'Cargo Unit', category: 'Sedan', amount: 487150 },
  { id: 'VHC-0298', name: 'Spare Tender', category: 'Scooter', amount: 156247 },
];

describe('VehicleTable filtering', () => {
  it('filters, sorts and pages through 15 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'Comp');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0286');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0286');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0298');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0298');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0288');
  });
});
