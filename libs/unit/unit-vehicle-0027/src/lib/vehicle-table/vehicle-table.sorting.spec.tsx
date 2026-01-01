import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0024', name: 'Spare Shuttle', category: 'Van', amount: 424715 },
  { id: 'VHC-0025', name: 'Diesel Runner', category: 'Scooter', amount: 41956 },
  { id: 'VHC-0026', name: 'Hybrid Carrier', category: 'Van', amount: 493425 },
  { id: 'VHC-0027', name: 'Compact Unit', category: 'Bike', amount: 802329 },
  { id: 'VHC-0028', name: 'Leased Runner', category: 'Scooter', amount: 277343 },
  { id: 'VHC-0029', name: 'Leased Tender', category: 'Bike', amount: 253987 },
  { id: 'VHC-0030', name: 'Leased Mover', category: 'Scooter', amount: 177590 },
  { id: 'VHC-0031', name: 'Leased Unit', category: 'Scooter', amount: 829599 },
  { id: 'VHC-0032', name: 'Electric Unit', category: 'Truck', amount: 933883 },
  { id: 'VHC-0033', name: 'Diesel Courier', category: 'Van', amount: 512657 },
  { id: 'VHC-0034', name: 'Leased Unit', category: 'Van', amount: 98136 },
  { id: 'VHC-0035', name: 'Pool Hauler', category: 'Sedan', amount: 105305 },
  { id: 'VHC-0036', name: 'Electric Carrier', category: 'Sedan', amount: 374680 },
  { id: 'VHC-0037', name: 'Field Shuttle', category: 'Sedan', amount: 299495 },
  { id: 'VHC-0038', name: 'Rental Tender', category: 'Truck', amount: 472805 },
  { id: 'VHC-0039', name: 'Pool Rover', category: 'Sedan', amount: 644949 },
  { id: 'VHC-0040', name: 'Cargo Tender', category: 'Bike', amount: 915174 },
  { id: 'VHC-0041', name: 'Leased Mover', category: 'Sedan', amount: 835464 },
  { id: 'VHC-0042', name: 'Cargo Rover', category: 'Scooter', amount: 39617 },
  { id: 'VHC-0043', name: 'Leased Unit', category: 'Bike', amount: 805676 },
];

describe('VehicleTable sorting', () => {
  it('filters, sorts and pages through 17 vehicles', async () => {
    const rows = ROWS.slice(0, 17);
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'vhc-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0024');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0024');
  });

  it('filters, sorts and pages through 18 vehicles', async () => {
    const rows = ROWS.slice(0, 18);
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0034');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0024');
    await user.clear(filter);
    await user.type(filter, 'VHC-0025');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });
});
