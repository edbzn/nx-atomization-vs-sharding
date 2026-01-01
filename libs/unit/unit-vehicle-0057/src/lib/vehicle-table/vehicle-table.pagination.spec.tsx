import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0020', name: 'Electric Hauler', category: 'Sedan', amount: 17021 },
  { id: 'VHC-0021', name: 'Cargo Runner', category: 'Bike', amount: 784051 },
  { id: 'VHC-0022', name: 'Electric Hauler', category: 'Scooter', amount: 462368 },
  { id: 'VHC-0023', name: 'Rental Hauler', category: 'Sedan', amount: 490255 },
  { id: 'VHC-0024', name: 'Rental Mover', category: 'Van', amount: 879322 },
  { id: 'VHC-0025', name: 'Cargo Carrier', category: 'Scooter', amount: 2916 },
  { id: 'VHC-0026', name: 'Pool Rover', category: 'Sedan', amount: 48912 },
  { id: 'VHC-0027', name: 'Compact Tender', category: 'Bike', amount: 134494 },
  { id: 'VHC-0028', name: 'Electric Runner', category: 'Scooter', amount: 159569 },
  { id: 'VHC-0029', name: 'Hybrid Mover', category: 'Truck', amount: 931828 },
  { id: 'VHC-0030', name: 'Cargo Tender', category: 'Truck', amount: 784268 },
  { id: 'VHC-0031', name: 'Rental Mover', category: 'Sedan', amount: 881438 },
  { id: 'VHC-0032', name: 'Leased Tender', category: 'Sedan', amount: 707555 },
  { id: 'VHC-0033', name: 'Rental Tender', category: 'Truck', amount: 489833 },
  { id: 'VHC-0034', name: 'Electric Hauler', category: 'Scooter', amount: 15048 },
  { id: 'VHC-0035', name: 'Pool Hauler', category: 'Scooter', amount: 242429 },
];

describe('VehicleTable pagination', () => {
  it('filters, sorts and pages through 16 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-16 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0030');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0025');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0025');
  });

  it('filters, sorts and pages through 16 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'Lea');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'Rent');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0020');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-16 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0030');
  });
});
