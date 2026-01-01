import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0273', name: 'Diesel Mover', category: 'Scooter', amount: 758154 },
  { id: 'VHC-0274', name: 'Cargo Hauler', category: 'Truck', amount: 94965 },
  { id: 'VHC-0275', name: 'Pool Tender', category: 'Scooter', amount: 594180 },
  { id: 'VHC-0276', name: 'Spare Carrier', category: 'Bike', amount: 609130 },
  { id: 'VHC-0277', name: 'Rental Hauler', category: 'Truck', amount: 715255 },
  { id: 'VHC-0278', name: 'Diesel Rover', category: 'Bike', amount: 502972 },
  { id: 'VHC-0279', name: 'Compact Scout', category: 'Truck', amount: 497749 },
  { id: 'VHC-0280', name: 'Diesel Hauler', category: 'Scooter', amount: 556640 },
  { id: 'VHC-0281', name: 'Hybrid Rover', category: 'Van', amount: 878625 },
  { id: 'VHC-0282', name: 'Rental Courier', category: 'Truck', amount: 358771 },
  { id: 'VHC-0283', name: 'Cargo Scout', category: 'Bike', amount: 446325 },
  { id: 'VHC-0284', name: 'Compact Scout', category: 'Sedan', amount: 410662 },
  { id: 'VHC-0285', name: 'Hybrid Scout', category: 'Scooter', amount: 712640 },
  { id: 'VHC-0286', name: 'Compact Hauler', category: 'Truck', amount: 138534 },
  { id: 'VHC-0287', name: 'Compact Runner', category: 'Scooter', amount: 386840 },
];

describe('VehicleTable pagination', () => {
  it('filters, sorts and pages through 15 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0274');
    await user.clear(filter);
    await user.type(filter, 'VHC-0283');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });
});
