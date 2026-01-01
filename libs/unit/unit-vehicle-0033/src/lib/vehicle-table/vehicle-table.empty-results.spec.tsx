import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0246', name: 'Spare Mover', category: 'Truck', amount: 714212 },
  { id: 'VHC-0247', name: 'Rental Mover', category: 'Van', amount: 6538 },
  { id: 'VHC-0248', name: 'Cargo Unit', category: 'Scooter', amount: 588931 },
  { id: 'VHC-0249', name: 'Rental Unit', category: 'Bike', amount: 101511 },
  { id: 'VHC-0250', name: 'Field Mover', category: 'Scooter', amount: 911476 },
  { id: 'VHC-0251', name: 'Hybrid Scout', category: 'Scooter', amount: 677866 },
  { id: 'VHC-0252', name: 'Electric Scout', category: 'Scooter', amount: 138640 },
  { id: 'VHC-0253', name: 'Field Hauler', category: 'Van', amount: 446421 },
  { id: 'VHC-0254', name: 'Field Runner', category: 'Sedan', amount: 866268 },
  { id: 'VHC-0255', name: 'Hybrid Scout', category: 'Sedan', amount: 15468 },
  { id: 'VHC-0256', name: 'Pool Mover', category: 'Van', amount: 529311 },
  { id: 'VHC-0257', name: 'Hybrid Mover', category: 'Scooter', amount: 526364 },
  { id: 'VHC-0258', name: 'Cargo Courier', category: 'Sedan', amount: 367386 },
  { id: 'VHC-0259', name: 'Field Carrier', category: 'Bike', amount: 505059 },
  { id: 'VHC-0260', name: 'Hybrid Scout', category: 'Truck', amount: 509576 },
  { id: 'VHC-0261', name: 'Electric Courier', category: 'Sedan', amount: 883704 },
  { id: 'VHC-0262', name: 'Compact Carrier', category: 'Sedan', amount: 66477 },
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0246');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0258');
    await user.clear(filter);
    await user.type(filter, 'Renta');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    await user.type(filter, 'VHC-0252');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });

  it('filters, sorts and pages through 17 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'Spa');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0246');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0246');
  });

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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0246');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0256');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0246');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0256');
  });
});
