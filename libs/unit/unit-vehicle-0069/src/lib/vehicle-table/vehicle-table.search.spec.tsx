import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0044', name: 'Cargo Hauler', category: 'Sedan', amount: 354771 },
  { id: 'VHC-0045', name: 'Pool Mover', category: 'Truck', amount: 832999 },
  { id: 'VHC-0046', name: 'Cargo Mover', category: 'Sedan', amount: 137591 },
  { id: 'VHC-0047', name: 'Leased Courier', category: 'Scooter', amount: 637045 },
  { id: 'VHC-0048', name: 'Cargo Hauler', category: 'Bike', amount: 261365 },
  { id: 'VHC-0049', name: 'Electric Runner', category: 'Scooter', amount: 217892 },
  { id: 'VHC-0050', name: 'Compact Scout', category: 'Bike', amount: 148019 },
  { id: 'VHC-0051', name: 'Rental Rover', category: 'Van', amount: 676396 },
  { id: 'VHC-0052', name: 'Electric Carrier', category: 'Bike', amount: 493834 },
  { id: 'VHC-0053', name: 'Compact Scout', category: 'Scooter', amount: 892661 },
  { id: 'VHC-0054', name: 'Field Tender', category: 'Scooter', amount: 519005 },
  { id: 'VHC-0055', name: 'Spare Carrier', category: 'Van', amount: 997910 },
  { id: 'VHC-0056', name: 'Electric Carrier', category: 'Scooter', amount: 399309 },
  { id: 'VHC-0057', name: 'Leased Hauler', category: 'Truck', amount: 312052 },
  { id: 'VHC-0058', name: 'Spare Courier', category: 'Sedan', amount: 179408 },
  { id: 'VHC-0059', name: 'Hybrid Courier', category: 'Truck', amount: 466318 },
  { id: 'VHC-0060', name: 'Hybrid Courier', category: 'Truck', amount: 648824 },
  { id: 'VHC-0061', name: 'Pool Carrier', category: 'Sedan', amount: 504673 },
  { id: 'VHC-0062', name: 'Field Unit', category: 'Truck', amount: 551916 },
  { id: 'VHC-0063', name: 'Rental Scout', category: 'Van', amount: 730833 },
];

describe('VehicleTable search', () => {
  it('filters, sorts and pages through 20 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0044');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0046');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0046');
    await user.clear(filter);
    await user.type(filter, 'VHC-0044');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'scooter');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0046');
  });
});
