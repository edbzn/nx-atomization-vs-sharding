import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0128', name: 'Leased Hauler', category: 'Truck', amount: 673412 },
  { id: 'VHC-0129', name: 'Cargo Runner', category: 'Sedan', amount: 491904 },
  { id: 'VHC-0130', name: 'Field Runner', category: 'Truck', amount: 237574 },
  { id: 'VHC-0131', name: 'Compact Mover', category: 'Truck', amount: 835047 },
  { id: 'VHC-0132', name: 'Rental Shuttle', category: 'Scooter', amount: 49314 },
  { id: 'VHC-0133', name: 'Electric Mover', category: 'Truck', amount: 669870 },
  { id: 'VHC-0134', name: 'Diesel Runner', category: 'Scooter', amount: 975299 },
  { id: 'VHC-0135', name: 'Leased Tender', category: 'Truck', amount: 151111 },
  { id: 'VHC-0136', name: 'Spare Runner', category: 'Scooter', amount: 504497 },
  { id: 'VHC-0137', name: 'Pool Scout', category: 'Sedan', amount: 161759 },
  { id: 'VHC-0138', name: 'Cargo Scout', category: 'Bike', amount: 2072 },
  { id: 'VHC-0139', name: 'Hybrid Shuttle', category: 'Scooter', amount: 467347 },
  { id: 'VHC-0140', name: 'Rental Carrier', category: 'Scooter', amount: 821631 },
  { id: 'VHC-0141', name: 'Rental Tender', category: 'Bike', amount: 842665 },
  { id: 'VHC-0142', name: 'Pool Shuttle', category: 'Truck', amount: 281277 },
  { id: 'VHC-0143', name: 'Compact Tender', category: 'Sedan', amount: 785956 },
  { id: 'VHC-0144', name: 'Spare Rover', category: 'Van', amount: 276513 },
];

describe('VehicleTable columns', () => {
  it('filters, sorts and pages through 17 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'scout');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0128');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0138');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0128');
    await user.clear(filter);
    await user.type(filter, 'vhc-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'van');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'Lea');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0128');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0128');
    await user.clear(filter);
    await user.type(filter, 'sedan');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
  });

  it('filters, sorts and pages through 17 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0138');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0128');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0128');
  });
});
