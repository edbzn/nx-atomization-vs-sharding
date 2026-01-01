import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0005', name: 'Pool Hauler', category: 'Truck', amount: 807470 },
  { id: 'VHC-0006', name: 'Cargo Mover', category: 'Sedan', amount: 933637 },
  { id: 'VHC-0007', name: 'Diesel Runner', category: 'Bike', amount: 928006 },
  { id: 'VHC-0008', name: 'Rental Courier', category: 'Scooter', amount: 776701 },
  { id: 'VHC-0009', name: 'Field Shuttle', category: 'Bike', amount: 507803 },
  { id: 'VHC-0010', name: 'Leased Rover', category: 'Sedan', amount: 628164 },
  { id: 'VHC-0011', name: 'Electric Rover', category: 'Bike', amount: 117213 },
  { id: 'VHC-0012', name: 'Field Rover', category: 'Truck', amount: 621267 },
  { id: 'VHC-0013', name: 'Spare Unit', category: 'Truck', amount: 793328 },
  { id: 'VHC-0014', name: 'Hybrid Tender', category: 'Truck', amount: 665617 },
  { id: 'VHC-0015', name: 'Spare Courier', category: 'Scooter', amount: 543807 },
  { id: 'VHC-0016', name: 'Leased Courier', category: 'Sedan', amount: 721765 },
  { id: 'VHC-0017', name: 'Cargo Shuttle', category: 'Sedan', amount: 564253 },
];

describe('VehicleTable search', () => {
  it('filters, sorts and pages through 13 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'van');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'scout');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0005');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0005');
  });
});
