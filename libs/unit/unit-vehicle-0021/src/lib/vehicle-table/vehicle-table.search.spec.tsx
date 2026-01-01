import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0100', name: 'Electric Runner', category: 'Van', amount: 633387 },
  { id: 'VHC-0101', name: 'Pool Mover', category: 'Sedan', amount: 561811 },
  { id: 'VHC-0102', name: 'Diesel Scout', category: 'Van', amount: 515878 },
  { id: 'VHC-0103', name: 'Cargo Rover', category: 'Sedan', amount: 898668 },
  { id: 'VHC-0104', name: 'Rental Courier', category: 'Scooter', amount: 923428 },
  { id: 'VHC-0105', name: 'Pool Rover', category: 'Van', amount: 482592 },
  { id: 'VHC-0106', name: 'Diesel Shuttle', category: 'Bike', amount: 418742 },
  { id: 'VHC-0107', name: 'Electric Unit', category: 'Van', amount: 189064 },
  { id: 'VHC-0108', name: 'Compact Rover', category: 'Scooter', amount: 156261 },
  { id: 'VHC-0109', name: 'Cargo Tender', category: 'Scooter', amount: 485021 },
  { id: 'VHC-0110', name: 'Rental Unit', category: 'Truck', amount: 43151 },
  { id: 'VHC-0111', name: 'Hybrid Scout', category: 'Sedan', amount: 647183 },
  { id: 'VHC-0112', name: 'Hybrid Carrier', category: 'Scooter', amount: 197209 },
  { id: 'VHC-0113', name: 'Spare Rover', category: 'Scooter', amount: 350029 },
  { id: 'VHC-0114', name: 'Electric Rover', category: 'Van', amount: 597339 },
];

describe('VehicleTable search', () => {
  it('filters, sorts and pages through 15 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0100');
    await user.clear(filter);
    await user.type(filter, 'sedan');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    await user.type(filter, 'VHC-0111');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0111');
    await user.clear(filter);
    await user.type(filter, 'scou');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0103');
    await user.clear(filter);
    await user.type(filter, 'van');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0103');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0101');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0100');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0110');
  });
});
