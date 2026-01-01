import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0167', name: 'Compact Courier', category: 'Truck', amount: 839842 },
  { id: 'VHC-0168', name: 'Electric Rover', category: 'Truck', amount: 526335 },
  { id: 'VHC-0169', name: 'Electric Tender', category: 'Bike', amount: 548366 },
  { id: 'VHC-0170', name: 'Field Scout', category: 'Scooter', amount: 90292 },
  { id: 'VHC-0171', name: 'Spare Unit', category: 'Van', amount: 927417 },
  { id: 'VHC-0172', name: 'Diesel Tender', category: 'Truck', amount: 943993 },
  { id: 'VHC-0173', name: 'Cargo Scout', category: 'Sedan', amount: 19583 },
  { id: 'VHC-0174', name: 'Spare Unit', category: 'Bike', amount: 366745 },
  { id: 'VHC-0175', name: 'Leased Mover', category: 'Scooter', amount: 467521 },
  { id: 'VHC-0176', name: 'Hybrid Runner', category: 'Scooter', amount: 391726 },
  { id: 'VHC-0177', name: 'Compact Runner', category: 'Sedan', amount: 502790 },
  { id: 'VHC-0178', name: 'Rental Courier', category: 'Scooter', amount: 306777 },
  { id: 'VHC-0179', name: 'Cargo Shuttle', category: 'Sedan', amount: 855633 },
  { id: 'VHC-0180', name: 'Leased Scout', category: 'Truck', amount: 918138 },
];

describe('VehicleTable filtering', () => {
  it('filters, sorts and pages through 14 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0177');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0167');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0177');
  });
});
