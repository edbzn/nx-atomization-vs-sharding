import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0019', name: 'Spare Rover', category: 'Truck', amount: 168963 },
  { id: 'VHC-0020', name: 'Electric Unit', category: 'Scooter', amount: 46022 },
  { id: 'VHC-0021', name: 'Compact Hauler', category: 'Bike', amount: 584456 },
  { id: 'VHC-0022', name: 'Leased Mover', category: 'Scooter', amount: 802792 },
  { id: 'VHC-0023', name: 'Rental Carrier', category: 'Van', amount: 334805 },
  { id: 'VHC-0024', name: 'Field Shuttle', category: 'Bike', amount: 792552 },
  { id: 'VHC-0025', name: 'Field Mover', category: 'Bike', amount: 881995 },
  { id: 'VHC-0026', name: 'Leased Shuttle', category: 'Sedan', amount: 102612 },
  { id: 'VHC-0027', name: 'Pool Scout', category: 'Scooter', amount: 921801 },
  { id: 'VHC-0028', name: 'Diesel Rover', category: 'Scooter', amount: 377106 },
  { id: 'VHC-0029', name: 'Hybrid Shuttle', category: 'Van', amount: 336689 },
  { id: 'VHC-0030', name: 'Pool Scout', category: 'Scooter', amount: 787679 },
  { id: 'VHC-0031', name: 'Pool Scout', category: 'Truck', amount: 702078 },
];

describe('VehicleTable large dataset', () => {
  it('filters, sorts and pages through 13 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0020');
    await user.clear(filter);
    await user.type(filter, 'hau');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });
});
