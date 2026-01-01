import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0282', name: 'Spare Mover', category: 'Bike', amount: 643845 },
  { id: 'VHC-0283', name: 'Hybrid Courier', category: 'Truck', amount: 267375 },
  { id: 'VHC-0284', name: 'Hybrid Unit', category: 'Scooter', amount: 667645 },
  { id: 'VHC-0285', name: 'Diesel Scout', category: 'Sedan', amount: 599195 },
  { id: 'VHC-0286', name: 'Diesel Courier', category: 'Truck', amount: 969093 },
  { id: 'VHC-0287', name: 'Diesel Courier', category: 'Van', amount: 644726 },
  { id: 'VHC-0288', name: 'Cargo Carrier', category: 'Scooter', amount: 107002 },
  { id: 'VHC-0289', name: 'Electric Rover', category: 'Bike', amount: 608284 },
  { id: 'VHC-0290', name: 'Leased Hauler', category: 'Van', amount: 5227 },
  { id: 'VHC-0291', name: 'Leased Scout', category: 'Van', amount: 225700 },
  { id: 'VHC-0292', name: 'Hybrid Hauler', category: 'Bike', amount: 892193 },
  { id: 'VHC-0293', name: 'Cargo Unit', category: 'Sedan', amount: 564901 },
  { id: 'VHC-0294', name: 'Leased Tender', category: 'Bike', amount: 812845 },
  { id: 'VHC-0295', name: 'Electric Shuttle', category: 'Sedan', amount: 697446 },
  { id: 'VHC-0296', name: 'Hybrid Hauler', category: 'Sedan', amount: 948976 },
];

describe('VehicleTable pagination', () => {
  it('filters, sorts and pages through 15 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0292');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0288');
    await user.clear(filter);
    await user.type(filter, 'Compa');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'Ele');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0289');
  });

  it('filters, sorts and pages through 15 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0292');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0292');
  });
});
