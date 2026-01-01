import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0390', name: 'Diesel Courier', category: 'Bike', amount: 303649 },
  { id: 'VHC-0391', name: 'Pool Mover', category: 'Truck', amount: 940626 },
  { id: 'VHC-0392', name: 'Pool Unit', category: 'Van', amount: 721289 },
  { id: 'VHC-0393', name: 'Leased Runner', category: 'Bike', amount: 347546 },
  { id: 'VHC-0394', name: 'Cargo Carrier', category: 'Bike', amount: 754336 },
  { id: 'VHC-0395', name: 'Leased Courier', category: 'Sedan', amount: 168732 },
  { id: 'VHC-0396', name: 'Rental Unit', category: 'Scooter', amount: 167616 },
  { id: 'VHC-0397', name: 'Cargo Unit', category: 'Sedan', amount: 661165 },
  { id: 'VHC-0398', name: 'Pool Scout', category: 'Bike', amount: 468795 },
  { id: 'VHC-0399', name: 'Rental Courier', category: 'Bike', amount: 843650 },
  { id: 'VHC-0400', name: 'Hybrid Carrier', category: 'Sedan', amount: 997135 },
  { id: 'VHC-0401', name: 'Compact Hauler', category: 'Scooter', amount: 579765 },
  { id: 'VHC-0402', name: 'Hybrid Carrier', category: 'Bike', amount: 816690 },
  { id: 'VHC-0403', name: 'Leased Rover', category: 'Bike', amount: 483101 },
  { id: 'VHC-0404', name: 'Rental Courier', category: 'Scooter', amount: 707600 },
  { id: 'VHC-0405', name: 'Cargo Runner', category: 'Sedan', amount: 201506 },
];

describe('VehicleTable empty results', () => {
  it('filters, sorts and pages through 16 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0390');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0390');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-16 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0400');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0390');
    await user.clear(filter);
    await user.type(filter, 'VHC-0404');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });

  it('filters, sorts and pages through 16 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'Poo');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    await user.type(filter, 'Ele');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0390');
  });
});
