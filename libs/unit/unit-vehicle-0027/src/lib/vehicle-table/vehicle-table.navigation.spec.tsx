import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0200', name: 'Leased Scout', category: 'Bike', amount: 366799 },
  { id: 'VHC-0201', name: 'Rental Tender', category: 'Scooter', amount: 63302 },
  { id: 'VHC-0202', name: 'Spare Runner', category: 'Scooter', amount: 415345 },
  { id: 'VHC-0203', name: 'Pool Mover', category: 'Truck', amount: 566988 },
  { id: 'VHC-0204', name: 'Diesel Runner', category: 'Sedan', amount: 502062 },
  { id: 'VHC-0205', name: 'Rental Runner', category: 'Scooter', amount: 410910 },
  { id: 'VHC-0206', name: 'Compact Scout', category: 'Sedan', amount: 3476 },
  { id: 'VHC-0207', name: 'Pool Hauler', category: 'Scooter', amount: 173489 },
  { id: 'VHC-0208', name: 'Hybrid Courier', category: 'Bike', amount: 497196 },
  { id: 'VHC-0209', name: 'Spare Courier', category: 'Truck', amount: 89790 },
  { id: 'VHC-0210', name: 'Diesel Hauler', category: 'Truck', amount: 790709 },
  { id: 'VHC-0211', name: 'Pool Mover', category: 'Sedan', amount: 939410 },
];

describe('VehicleTable navigation', () => {
  it('filters, sorts and pages through 12 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'Elec');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'Spar');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0209');
    await user.clear(filter);
    await user.type(filter, 'Rent');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0201');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0200');
  });
});
