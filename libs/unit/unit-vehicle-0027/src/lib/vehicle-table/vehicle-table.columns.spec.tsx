import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0057', name: 'Pool Courier', category: 'Sedan', amount: 772928 },
  { id: 'VHC-0058', name: 'Diesel Tender', category: 'Truck', amount: 939608 },
  { id: 'VHC-0059', name: 'Hybrid Scout', category: 'Sedan', amount: 590909 },
  { id: 'VHC-0060', name: 'Leased Unit', category: 'Sedan', amount: 159024 },
  { id: 'VHC-0061', name: 'Cargo Hauler', category: 'Bike', amount: 63916 },
  { id: 'VHC-0062', name: 'Compact Shuttle', category: 'Truck', amount: 112317 },
  { id: 'VHC-0063', name: 'Spare Carrier', category: 'Bike', amount: 587688 },
  { id: 'VHC-0064', name: 'Electric Courier', category: 'Bike', amount: 772473 },
  { id: 'VHC-0065', name: 'Pool Mover', category: 'Scooter', amount: 606044 },
  { id: 'VHC-0066', name: 'Electric Unit', category: 'Bike', amount: 598945 },
  { id: 'VHC-0067', name: 'Field Unit', category: 'Van', amount: 356798 },
  { id: 'VHC-0068', name: 'Diesel Rover', category: 'Sedan', amount: 895412 },
  { id: 'VHC-0069', name: 'Pool Scout', category: 'Van', amount: 370698 },
  { id: 'VHC-0070', name: 'Hybrid Shuttle', category: 'Sedan', amount: 361016 },
  { id: 'VHC-0071', name: 'Pool Unit', category: 'Scooter', amount: 172562 },
  { id: 'VHC-0072', name: 'Diesel Hauler', category: 'Sedan', amount: 909129 },
  { id: 'VHC-0073', name: 'Electric Scout', category: 'Scooter', amount: 142236 },
  { id: 'VHC-0074', name: 'Cargo Tender', category: 'Sedan', amount: 98034 },
];

describe('VehicleTable columns', () => {
  it('filters, sorts and pages through 18 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'scooter');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0057');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0067');
    await user.clear(filter);
    await user.type(filter, 'carri');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0063');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0063');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0057');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0061');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0057');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0067');
    await user.clear(filter);
    await user.type(filter, 'Diese');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
  });

  it('filters, sorts and pages through 17 vehicles', async () => {
    const rows = ROWS.slice(0, 17);
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0057');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 17');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0061');
  });
});
