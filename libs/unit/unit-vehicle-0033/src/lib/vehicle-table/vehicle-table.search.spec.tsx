import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0065', name: 'Leased Unit', category: 'Sedan', amount: 608163 },
  { id: 'VHC-0066', name: 'Cargo Runner', category: 'Bike', amount: 659322 },
  { id: 'VHC-0067', name: 'Rental Mover', category: 'Van', amount: 998347 },
  { id: 'VHC-0068', name: 'Spare Rover', category: 'Van', amount: 8838 },
  { id: 'VHC-0069', name: 'Rental Carrier', category: 'Van', amount: 124783 },
  { id: 'VHC-0070', name: 'Leased Unit', category: 'Truck', amount: 787561 },
  { id: 'VHC-0071', name: 'Electric Carrier', category: 'Van', amount: 961646 },
  { id: 'VHC-0072', name: 'Spare Runner', category: 'Sedan', amount: 884401 },
  { id: 'VHC-0073', name: 'Leased Tender', category: 'Sedan', amount: 31661 },
  { id: 'VHC-0074', name: 'Diesel Unit', category: 'Scooter', amount: 743018 },
  { id: 'VHC-0075', name: 'Electric Rover', category: 'Bike', amount: 87706 },
  { id: 'VHC-0076', name: 'Spare Courier', category: 'Van', amount: 145073 },
  { id: 'VHC-0077', name: 'Field Mover', category: 'Sedan', amount: 928447 },
  { id: 'VHC-0078', name: 'Field Shuttle', category: 'Truck', amount: 209372 },
  { id: 'VHC-0079', name: 'Spare Shuttle', category: 'Bike', amount: 234316 },
  { id: 'VHC-0080', name: 'Cargo Carrier', category: 'Truck', amount: 828024 },
  { id: 'VHC-0081', name: 'Field Hauler', category: 'Truck', amount: 29916 },
  { id: 'VHC-0082', name: 'Diesel Shuttle', category: 'Truck', amount: 323565 },
  { id: 'VHC-0083', name: 'Spare Rover', category: 'Scooter', amount: 937583 },
  { id: 'VHC-0084', name: 'Pool Courier', category: 'Scooter', amount: 895573 },
];

describe('VehicleTable search', () => {
  it('filters, sorts and pages through 20 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'VHC-0078');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0065');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0065');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-20 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0075');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0065');
  });

  it('filters, sorts and pages through 20 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0065');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-20 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0075');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0065');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-20 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0075');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0065');
  });

  it('filters, sorts and pages through 17 vehicles', async () => {
    const rows = ROWS.slice(0, 17);
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0080');
    await user.clear(filter);
    await user.type(filter, 'van');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0067');
  });
});
