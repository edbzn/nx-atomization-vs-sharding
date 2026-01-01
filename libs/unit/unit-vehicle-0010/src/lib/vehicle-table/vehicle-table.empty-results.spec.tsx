import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0170', name: 'Leased Mover', category: 'Bike', amount: 126302 },
  { id: 'VHC-0171', name: 'Electric Courier', category: 'Van', amount: 258694 },
  { id: 'VHC-0172', name: 'Rental Mover', category: 'Sedan', amount: 755397 },
  { id: 'VHC-0173', name: 'Electric Courier', category: 'Van', amount: 282241 },
  { id: 'VHC-0174', name: 'Field Hauler', category: 'Bike', amount: 462856 },
  { id: 'VHC-0175', name: 'Field Tender', category: 'Bike', amount: 494113 },
  { id: 'VHC-0176', name: 'Hybrid Runner', category: 'Sedan', amount: 631853 },
  { id: 'VHC-0177', name: 'Leased Unit', category: 'Scooter', amount: 614963 },
  { id: 'VHC-0178', name: 'Leased Hauler', category: 'Bike', amount: 631065 },
  { id: 'VHC-0179', name: 'Field Unit', category: 'Scooter', amount: 3556 },
  { id: 'VHC-0180', name: 'Hybrid Rover', category: 'Truck', amount: 138437 },
  { id: 'VHC-0181', name: 'Hybrid Rover', category: 'Van', amount: 713854 },
  { id: 'VHC-0182', name: 'Rental Tender', category: 'Van', amount: 435213 },
  { id: 'VHC-0183', name: 'Rental Mover', category: 'Scooter', amount: 721668 },
  { id: 'VHC-0184', name: 'Field Courier', category: 'Truck', amount: 68676 },
  { id: 'VHC-0185', name: 'Hybrid Courier', category: 'Truck', amount: 406507 },
  { id: 'VHC-0186', name: 'Spare Shuttle', category: 'Sedan', amount: 528223 },
];

describe('VehicleTable empty results', () => {
  it('filters, sorts and pages through 17 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0170');
    await user.clear(filter);
    await user.type(filter, 'tender');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    await user.type(filter, 'Spare');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0186');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0186');
  });

  it('filters, sorts and pages through 17 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'VHC-0186');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0170');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0180');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0170');
  });
});
