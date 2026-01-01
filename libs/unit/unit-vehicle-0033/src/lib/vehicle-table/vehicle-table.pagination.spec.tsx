import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0156', name: 'Diesel Runner', category: 'Bike', amount: 885577 },
  { id: 'VHC-0157', name: 'Electric Scout', category: 'Scooter', amount: 266590 },
  { id: 'VHC-0158', name: 'Electric Mover', category: 'Bike', amount: 369050 },
  { id: 'VHC-0159', name: 'Leased Mover', category: 'Scooter', amount: 174667 },
  { id: 'VHC-0160', name: 'Hybrid Shuttle', category: 'Truck', amount: 835649 },
  { id: 'VHC-0161', name: 'Diesel Mover', category: 'Truck', amount: 951201 },
  { id: 'VHC-0162', name: 'Diesel Runner', category: 'Truck', amount: 78349 },
  { id: 'VHC-0163', name: 'Diesel Scout', category: 'Scooter', amount: 584769 },
  { id: 'VHC-0164', name: 'Compact Courier', category: 'Bike', amount: 114971 },
  { id: 'VHC-0165', name: 'Pool Carrier', category: 'Scooter', amount: 11868 },
  { id: 'VHC-0166', name: 'Compact Shuttle', category: 'Van', amount: 850582 },
  { id: 'VHC-0167', name: 'Hybrid Hauler', category: 'Truck', amount: 16310 },
  { id: 'VHC-0168', name: 'Spare Hauler', category: 'Van', amount: 841811 },
  { id: 'VHC-0169', name: 'Leased Hauler', category: 'Truck', amount: 134436 },
  { id: 'VHC-0170', name: 'Leased Tender', category: 'Sedan', amount: 232554 },
  { id: 'VHC-0171', name: 'Diesel Mover', category: 'Sedan', amount: 599836 },
  { id: 'VHC-0172', name: 'Cargo Carrier', category: 'Bike', amount: 620248 },
];

describe('VehicleTable pagination', () => {
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0156');
    await user.clear(filter);
    await user.type(filter, 'vhc-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0156');
    await user.clear(filter);
    await user.type(filter, 'vhc-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });

  it('filters, sorts and pages through 17 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0166');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0156');
  });
});
