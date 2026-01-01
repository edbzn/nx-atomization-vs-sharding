import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0214', name: 'Cargo Tender', category: 'Bike', amount: 952865 },
  { id: 'VHC-0215', name: 'Rental Carrier', category: 'Bike', amount: 335114 },
  { id: 'VHC-0216', name: 'Pool Shuttle', category: 'Scooter', amount: 42690 },
  { id: 'VHC-0217', name: 'Pool Courier', category: 'Truck', amount: 944129 },
  { id: 'VHC-0218', name: 'Field Carrier', category: 'Sedan', amount: 70578 },
  { id: 'VHC-0219', name: 'Electric Scout', category: 'Bike', amount: 535121 },
  { id: 'VHC-0220', name: 'Compact Carrier', category: 'Van', amount: 825021 },
  { id: 'VHC-0221', name: 'Compact Hauler', category: 'Bike', amount: 352044 },
  { id: 'VHC-0222', name: 'Compact Courier', category: 'Bike', amount: 819750 },
  { id: 'VHC-0223', name: 'Compact Runner', category: 'Sedan', amount: 636398 },
  { id: 'VHC-0224', name: 'Rental Hauler', category: 'Sedan', amount: 865773 },
  { id: 'VHC-0225', name: 'Electric Mover', category: 'Scooter', amount: 856498 },
];

describe('VehicleTable filtering', () => {
  it('filters, sorts and pages through 12 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-12 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0224');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-12 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0224');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0216');
  });

  it('filters, sorts and pages through 12 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0214');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-12 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0224');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0214');
  });
});
