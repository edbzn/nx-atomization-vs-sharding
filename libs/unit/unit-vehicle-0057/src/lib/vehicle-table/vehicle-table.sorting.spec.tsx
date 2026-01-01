import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0399', name: 'Compact Rover', category: 'Sedan', amount: 696021 },
  { id: 'VHC-0400', name: 'Electric Carrier', category: 'Truck', amount: 290404 },
  { id: 'VHC-0401', name: 'Spare Courier', category: 'Sedan', amount: 427817 },
  { id: 'VHC-0402', name: 'Spare Tender', category: 'Truck', amount: 134040 },
  { id: 'VHC-0403', name: 'Compact Shuttle', category: 'Truck', amount: 549580 },
  { id: 'VHC-0404', name: 'Compact Runner', category: 'Truck', amount: 822274 },
  { id: 'VHC-0405', name: 'Spare Unit', category: 'Truck', amount: 960812 },
  { id: 'VHC-0406', name: 'Electric Mover', category: 'Bike', amount: 628289 },
  { id: 'VHC-0407', name: 'Spare Shuttle', category: 'Sedan', amount: 728323 },
  { id: 'VHC-0408', name: 'Field Carrier', category: 'Bike', amount: 382877 },
  { id: 'VHC-0409', name: 'Diesel Unit', category: 'Bike', amount: 179267 },
  { id: 'VHC-0410', name: 'Electric Rover', category: 'Scooter', amount: 206531 },
  { id: 'VHC-0411', name: 'Cargo Carrier', category: 'Sedan', amount: 840093 },
  { id: 'VHC-0412', name: 'Rental Rover', category: 'Truck', amount: 512630 },
  { id: 'VHC-0413', name: 'Electric Carrier', category: 'Truck', amount: 38906 },
  { id: 'VHC-0414', name: 'Cargo Tender', category: 'Sedan', amount: 530153 },
  { id: 'VHC-0415', name: 'Compact Carrier', category: 'Bike', amount: 28209 },
  { id: 'VHC-0416', name: 'Spare Runner', category: 'Truck', amount: 564441 },
];

describe('VehicleTable sorting', () => {
  it('filters, sorts and pages through 18 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'tender');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0399');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0399');
    await user.clear(filter);
    await user.type(filter, 'Die');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });
});
