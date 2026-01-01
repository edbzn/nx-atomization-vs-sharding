import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0104', name: 'Pool Rover', category: 'Scooter', amount: 781242 },
  { id: 'VHC-0105', name: 'Hybrid Runner', category: 'Scooter', amount: 941990 },
  { id: 'VHC-0106', name: 'Leased Unit', category: 'Sedan', amount: 149668 },
  { id: 'VHC-0107', name: 'Leased Rover', category: 'Van', amount: 258416 },
  { id: 'VHC-0108', name: 'Hybrid Unit', category: 'Van', amount: 475489 },
  { id: 'VHC-0109', name: 'Rental Shuttle', category: 'Bike', amount: 786016 },
  { id: 'VHC-0110', name: 'Diesel Courier', category: 'Sedan', amount: 902261 },
  { id: 'VHC-0111', name: 'Field Carrier', category: 'Truck', amount: 366058 },
  { id: 'VHC-0112', name: 'Leased Scout', category: 'Bike', amount: 163758 },
  { id: 'VHC-0113', name: 'Electric Unit', category: 'Scooter', amount: 700955 },
  { id: 'VHC-0114', name: 'Electric Carrier', category: 'Van', amount: 278583 },
  { id: 'VHC-0115', name: 'Field Shuttle', category: 'Bike', amount: 403508 },
  { id: 'VHC-0116', name: 'Pool Unit', category: 'Van', amount: 428720 },
  { id: 'VHC-0117', name: 'Diesel Hauler', category: 'Sedan', amount: 511623 },
  { id: 'VHC-0118', name: 'Pool Rover', category: 'Truck', amount: 145235 },
  { id: 'VHC-0119', name: 'Leased Carrier', category: 'Van', amount: 543960 },
  { id: 'VHC-0120', name: 'Field Scout', category: 'Truck', amount: 946236 },
];

describe('VehicleTable columns', () => {
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0114');
    await user.clear(filter);
    await user.type(filter, 'carr');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    await user.type(filter, 'courie');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0104');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0114');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0104');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0104');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0114');
  });

  it('filters, sorts and pages through 17 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0104');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0104');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0110');
  });
});
