import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0066', name: 'Compact Hauler', category: 'Scooter', amount: 363541 },
  { id: 'VHC-0067', name: 'Diesel Hauler', category: 'Scooter', amount: 935814 },
  { id: 'VHC-0068', name: 'Cargo Mover', category: 'Scooter', amount: 200058 },
  { id: 'VHC-0069', name: 'Compact Hauler', category: 'Van', amount: 166279 },
  { id: 'VHC-0070', name: 'Field Hauler', category: 'Van', amount: 543837 },
  { id: 'VHC-0071', name: 'Diesel Carrier', category: 'Bike', amount: 49713 },
  { id: 'VHC-0072', name: 'Pool Tender', category: 'Truck', amount: 968811 },
  { id: 'VHC-0073', name: 'Compact Unit', category: 'Van', amount: 716062 },
  { id: 'VHC-0074', name: 'Pool Unit', category: 'Truck', amount: 835026 },
  { id: 'VHC-0075', name: 'Compact Hauler', category: 'Van', amount: 506762 },
  { id: 'VHC-0076', name: 'Cargo Hauler', category: 'Scooter', amount: 203781 },
  { id: 'VHC-0077', name: 'Diesel Carrier', category: 'Truck', amount: 527098 },
  { id: 'VHC-0078', name: 'Rental Runner', category: 'Sedan', amount: 88255 },
  { id: 'VHC-0079', name: 'Spare Scout', category: 'Bike', amount: 816373 },
  { id: 'VHC-0080', name: 'Pool Courier', category: 'Van', amount: 364183 },
  { id: 'VHC-0081', name: 'Diesel Tender', category: 'Van', amount: 175334 },
  { id: 'VHC-0082', name: 'Pool Courier', category: 'Van', amount: 693642 },
  { id: 'VHC-0083', name: 'Rental Carrier', category: 'Scooter', amount: 363090 },
  { id: 'VHC-0084', name: 'Rental Unit', category: 'Van', amount: 694798 },
];

describe('VehicleTable large dataset', () => {
  it('filters, sorts and pages through 19 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0076');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0066');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0076');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0066');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0076');
    await user.clear(filter);
    await user.type(filter, 'vhc-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0066');
    await user.clear(filter);
    await user.type(filter, 'vhc-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0066');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0071');
    await user.clear(filter);
    await user.type(filter, 'Renta');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
  });

  it('filters, sorts and pages through 16 vehicles', async () => {
    const rows = ROWS.slice(0, 16);
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-16 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0076');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0066');
  });

  it('filters, sorts and pages through 15 vehicles', async () => {
    const rows = ROWS.slice(0, 15);
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'Fiel');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0066');
  });
});
