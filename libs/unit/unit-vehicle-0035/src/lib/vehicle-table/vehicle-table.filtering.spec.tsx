import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0031', name: 'Pool Runner', category: 'Bike', amount: 236466 },
  { id: 'VHC-0032', name: 'Hybrid Shuttle', category: 'Bike', amount: 541670 },
  { id: 'VHC-0033', name: 'Cargo Rover', category: 'Scooter', amount: 67174 },
  { id: 'VHC-0034', name: 'Rental Scout', category: 'Truck', amount: 931613 },
  { id: 'VHC-0035', name: 'Rental Hauler', category: 'Sedan', amount: 622305 },
  { id: 'VHC-0036', name: 'Field Runner', category: 'Truck', amount: 596589 },
  { id: 'VHC-0037', name: 'Electric Mover', category: 'Bike', amount: 694780 },
  { id: 'VHC-0038', name: 'Cargo Shuttle', category: 'Sedan', amount: 85785 },
  { id: 'VHC-0039', name: 'Hybrid Carrier', category: 'Sedan', amount: 50915 },
  { id: 'VHC-0040', name: 'Cargo Scout', category: 'Sedan', amount: 491366 },
  { id: 'VHC-0041', name: 'Electric Runner', category: 'Bike', amount: 857318 },
  { id: 'VHC-0042', name: 'Leased Runner', category: 'Bike', amount: 372553 },
  { id: 'VHC-0043', name: 'Diesel Mover', category: 'Bike', amount: 662334 },
  { id: 'VHC-0044', name: 'Pool Unit', category: 'Truck', amount: 992066 },
  { id: 'VHC-0045', name: 'Leased Rover', category: 'Sedan', amount: 466824 },
  { id: 'VHC-0046', name: 'Field Carrier', category: 'Sedan', amount: 243676 },
  { id: 'VHC-0047', name: 'Leased Scout', category: 'Scooter', amount: 771128 },
  { id: 'VHC-0048', name: 'Field Hauler', category: 'Van', amount: 660878 },
  { id: 'VHC-0049', name: 'Rental Runner', category: 'Scooter', amount: 209444 },
];

describe('VehicleTable filtering', () => {
  it('filters, sorts and pages through 19 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0033');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0032');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0033');
  });
});
