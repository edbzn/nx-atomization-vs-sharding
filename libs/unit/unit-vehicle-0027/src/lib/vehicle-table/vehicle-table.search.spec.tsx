import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0322', name: 'Hybrid Carrier', category: 'Sedan', amount: 261597 },
  { id: 'VHC-0323', name: 'Leased Mover', category: 'Bike', amount: 395678 },
  { id: 'VHC-0324', name: 'Spare Mover', category: 'Sedan', amount: 579742 },
  { id: 'VHC-0325', name: 'Hybrid Tender', category: 'Van', amount: 961604 },
  { id: 'VHC-0326', name: 'Diesel Runner', category: 'Scooter', amount: 114782 },
  { id: 'VHC-0327', name: 'Electric Unit', category: 'Van', amount: 78610 },
  { id: 'VHC-0328', name: 'Pool Shuttle', category: 'Scooter', amount: 61095 },
  { id: 'VHC-0329', name: 'Cargo Unit', category: 'Van', amount: 229258 },
  { id: 'VHC-0330', name: 'Compact Rover', category: 'Truck', amount: 736612 },
  { id: 'VHC-0331', name: 'Diesel Unit', category: 'Scooter', amount: 712202 },
  { id: 'VHC-0332', name: 'Rental Unit', category: 'Sedan', amount: 417325 },
  { id: 'VHC-0333', name: 'Hybrid Rover', category: 'Van', amount: 876181 },
  { id: 'VHC-0334', name: 'Spare Unit', category: 'Van', amount: 964496 },
  { id: 'VHC-0335', name: 'Compact Mover', category: 'Sedan', amount: 497478 },
  { id: 'VHC-0336', name: 'Rental Scout', category: 'Bike', amount: 901495 },
  { id: 'VHC-0337', name: 'Spare Mover', category: 'Truck', amount: 561890 },
  { id: 'VHC-0338', name: 'Field Carrier', category: 'Truck', amount: 921019 },
  { id: 'VHC-0339', name: 'Rental Carrier', category: 'Sedan', amount: 157329 },
  { id: 'VHC-0340', name: 'Cargo Shuttle', category: 'Truck', amount: 269855 },
  { id: 'VHC-0341', name: 'Leased Runner', category: 'Van', amount: 802385 },
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0340');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0340');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-20 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0325');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0340');
    await user.clear(filter);
    await user.type(filter, 'Rent');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0332');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0339');
  });

  it('filters, sorts and pages through 20 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0328');
    await user.clear(filter);
    await user.type(filter, 'vhc-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0340');
  });

  it('filters, sorts and pages through 17 vehicles', async () => {
    const rows = ROWS.slice(0, 17);
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-17 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(7);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0332');
    await user.clear(filter);
    await user.type(filter, 'VHC-0336');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0322');
  });
});
