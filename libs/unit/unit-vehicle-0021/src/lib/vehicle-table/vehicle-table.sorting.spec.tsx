import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0331', name: 'Diesel Runner', category: 'Sedan', amount: 645540 },
  { id: 'VHC-0332', name: 'Rental Scout', category: 'Van', amount: 815389 },
  { id: 'VHC-0333', name: 'Cargo Mover', category: 'Van', amount: 512041 },
  { id: 'VHC-0334', name: 'Spare Carrier', category: 'Sedan', amount: 161441 },
  { id: 'VHC-0335', name: 'Leased Hauler', category: 'Truck', amount: 338046 },
  { id: 'VHC-0336', name: 'Hybrid Scout', category: 'Scooter', amount: 433765 },
  { id: 'VHC-0337', name: 'Spare Hauler', category: 'Truck', amount: 875953 },
  { id: 'VHC-0338', name: 'Hybrid Courier', category: 'Truck', amount: 205254 },
  { id: 'VHC-0339', name: 'Cargo Rover', category: 'Scooter', amount: 75801 },
  { id: 'VHC-0340', name: 'Spare Rover', category: 'Truck', amount: 631724 },
  { id: 'VHC-0341', name: 'Diesel Hauler', category: 'Bike', amount: 357357 },
  { id: 'VHC-0342', name: 'Cargo Hauler', category: 'Scooter', amount: 616437 },
  { id: 'VHC-0343', name: 'Cargo Courier', category: 'Scooter', amount: 2852 },
  { id: 'VHC-0344', name: 'Spare Unit', category: 'Scooter', amount: 643544 },
];

describe('VehicleTable sorting', () => {
  it('filters, sorts and pages through 14 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'Com');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'VHC-0331');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0331');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0343');
    await user.clear(filter);
    await user.type(filter, 'truck');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0343');
    await user.clear(filter);
    await user.type(filter, 'Car');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0343');
  });

  it('filters, sorts and pages through 14 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0331');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0331');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0341');
  });
});
