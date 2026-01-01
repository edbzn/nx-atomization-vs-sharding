import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0052', name: 'Leased Scout', category: 'Bike', amount: 69329 },
  { id: 'VHC-0053', name: 'Spare Mover', category: 'Bike', amount: 690622 },
  { id: 'VHC-0054', name: 'Spare Tender', category: 'Bike', amount: 591224 },
  { id: 'VHC-0055', name: 'Compact Shuttle', category: 'Bike', amount: 672961 },
  { id: 'VHC-0056', name: 'Pool Hauler', category: 'Van', amount: 720098 },
  { id: 'VHC-0057', name: 'Rental Tender', category: 'Bike', amount: 959147 },
  { id: 'VHC-0058', name: 'Pool Shuttle', category: 'Van', amount: 868779 },
  { id: 'VHC-0059', name: 'Leased Unit', category: 'Sedan', amount: 522338 },
  { id: 'VHC-0060', name: 'Field Rover', category: 'Sedan', amount: 975489 },
  { id: 'VHC-0061', name: 'Diesel Scout', category: 'Sedan', amount: 470166 },
  { id: 'VHC-0062', name: 'Field Carrier', category: 'Bike', amount: 412153 },
  { id: 'VHC-0063', name: 'Spare Runner', category: 'Bike', amount: 744969 },
  { id: 'VHC-0064', name: 'Spare Tender', category: 'Truck', amount: 971476 },
  { id: 'VHC-0065', name: 'Compact Hauler', category: 'Van', amount: 33214 },
  { id: 'VHC-0066', name: 'Hybrid Rover', category: 'Van', amount: 803271 },
];

describe('VehicleTable columns', () => {
  it('filters, sorts and pages through 15 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0052');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0062');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0052');
  });
});
