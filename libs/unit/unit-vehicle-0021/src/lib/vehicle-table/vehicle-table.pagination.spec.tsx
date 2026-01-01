import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0292', name: 'Leased Scout', category: 'Sedan', amount: 55512 },
  { id: 'VHC-0293', name: 'Diesel Shuttle', category: 'Sedan', amount: 765066 },
  { id: 'VHC-0294', name: 'Electric Scout', category: 'Bike', amount: 476617 },
  { id: 'VHC-0295', name: 'Field Rover', category: 'Scooter', amount: 589341 },
  { id: 'VHC-0296', name: 'Hybrid Runner', category: 'Sedan', amount: 37006 },
  { id: 'VHC-0297', name: 'Field Rover', category: 'Truck', amount: 414914 },
  { id: 'VHC-0298', name: 'Rental Mover', category: 'Van', amount: 856318 },
  { id: 'VHC-0299', name: 'Spare Courier', category: 'Scooter', amount: 820603 },
  { id: 'VHC-0300', name: 'Cargo Runner', category: 'Truck', amount: 901445 },
  { id: 'VHC-0301', name: 'Field Carrier', category: 'Truck', amount: 262667 },
  { id: 'VHC-0302', name: 'Diesel Rover', category: 'Scooter', amount: 664255 },
  { id: 'VHC-0303', name: 'Electric Shuttle', category: 'Van', amount: 409023 },
  { id: 'VHC-0304', name: 'Rental Unit', category: 'Sedan', amount: 792573 },
  { id: 'VHC-0305', name: 'Electric Hauler', category: 'Bike', amount: 209842 },
];

describe('VehicleTable pagination', () => {
  it('filters, sorts and pages through 14 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'Fiel');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0292');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0302');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0292');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0292');
  });
});
