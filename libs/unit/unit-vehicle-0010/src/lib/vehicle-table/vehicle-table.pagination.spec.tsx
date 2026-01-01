import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0078', name: 'Leased Scout', category: 'Scooter', amount: 47016 },
  { id: 'VHC-0079', name: 'Cargo Tender', category: 'Van', amount: 982016 },
  { id: 'VHC-0080', name: 'Cargo Courier', category: 'Truck', amount: 243086 },
  { id: 'VHC-0081', name: 'Field Scout', category: 'Truck', amount: 99302 },
  { id: 'VHC-0082', name: 'Electric Scout', category: 'Truck', amount: 202774 },
  { id: 'VHC-0083', name: 'Electric Runner', category: 'Van', amount: 586583 },
  { id: 'VHC-0084', name: 'Cargo Hauler', category: 'Scooter', amount: 509233 },
  { id: 'VHC-0085', name: 'Field Mover', category: 'Bike', amount: 809326 },
  { id: 'VHC-0086', name: 'Field Runner', category: 'Van', amount: 586888 },
  { id: 'VHC-0087', name: 'Diesel Carrier', category: 'Scooter', amount: 878942 },
  { id: 'VHC-0088', name: 'Field Runner', category: 'Sedan', amount: 374502 },
  { id: 'VHC-0089', name: 'Cargo Runner', category: 'Scooter', amount: 130576 },
  { id: 'VHC-0090', name: 'Electric Scout', category: 'Truck', amount: 600269 },
];

describe('VehicleTable pagination', () => {
  it('filters, sorts and pages through 13 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-13 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0088');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0078');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0078');
  });
});
