import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0204', name: 'Leased Shuttle', category: 'Scooter', amount: 406640 },
  { id: 'VHC-0205', name: 'Compact Mover', category: 'Sedan', amount: 930833 },
  { id: 'VHC-0206', name: 'Diesel Tender', category: 'Bike', amount: 796294 },
  { id: 'VHC-0207', name: 'Diesel Courier', category: 'Van', amount: 188368 },
  { id: 'VHC-0208', name: 'Hybrid Carrier', category: 'Scooter', amount: 90549 },
  { id: 'VHC-0209', name: 'Field Shuttle', category: 'Bike', amount: 810104 },
  { id: 'VHC-0210', name: 'Compact Rover', category: 'Truck', amount: 290084 },
  { id: 'VHC-0211', name: 'Pool Carrier', category: 'Bike', amount: 689817 },
  { id: 'VHC-0212', name: 'Diesel Tender', category: 'Sedan', amount: 879716 },
  { id: 'VHC-0213', name: 'Pool Rover', category: 'Scooter', amount: 81180 },
  { id: 'VHC-0214', name: 'Pool Tender', category: 'Sedan', amount: 818097 },
  { id: 'VHC-0215', name: 'Electric Runner', category: 'Truck', amount: 878845 },
  { id: 'VHC-0216', name: 'Pool Shuttle', category: 'Bike', amount: 48053 },
];

describe('VehicleTable filtering 2', () => {
  it('filters, sorts and pages through 13 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'bike');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0204');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-13 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0214');
  });

  it('filters, sorts and pages through 13 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0204');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-13 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0214');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0204');
    await user.clear(filter);
    await user.type(filter, 'bike');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
  });
});
