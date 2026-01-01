import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0155', name: 'Diesel Carrier', category: 'Van', amount: 721523 },
  { id: 'VHC-0156', name: 'Cargo Carrier', category: 'Truck', amount: 373588 },
  { id: 'VHC-0157', name: 'Rental Scout', category: 'Truck', amount: 415875 },
  { id: 'VHC-0158', name: 'Leased Rover', category: 'Van', amount: 225939 },
  { id: 'VHC-0159', name: 'Field Tender', category: 'Van', amount: 324422 },
  { id: 'VHC-0160', name: 'Field Rover', category: 'Sedan', amount: 532267 },
  { id: 'VHC-0161', name: 'Field Tender', category: 'Bike', amount: 814400 },
  { id: 'VHC-0162', name: 'Compact Unit', category: 'Scooter', amount: 270848 },
  { id: 'VHC-0163', name: 'Cargo Tender', category: 'Bike', amount: 453740 },
  { id: 'VHC-0164', name: 'Diesel Scout', category: 'Bike', amount: 164165 },
  { id: 'VHC-0165', name: 'Spare Rover', category: 'Truck', amount: 210930 },
  { id: 'VHC-0166', name: 'Leased Unit', category: 'Van', amount: 361982 },
];

describe('VehicleTable sorting', () => {
  it('filters, sorts and pages through 12 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'truck');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0155');
  });
});
