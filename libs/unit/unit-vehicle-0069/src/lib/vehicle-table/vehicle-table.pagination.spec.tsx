import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0275', name: 'Field Scout', category: 'Van', amount: 149958 },
  { id: 'VHC-0276', name: 'Rental Rover', category: 'Sedan', amount: 426705 },
  { id: 'VHC-0277', name: 'Pool Courier', category: 'Van', amount: 909795 },
  { id: 'VHC-0278', name: 'Compact Tender', category: 'Bike', amount: 38802 },
  { id: 'VHC-0279', name: 'Hybrid Scout', category: 'Truck', amount: 937227 },
  { id: 'VHC-0280', name: 'Spare Mover', category: 'Truck', amount: 463900 },
  { id: 'VHC-0281', name: 'Cargo Scout', category: 'Truck', amount: 370700 },
  { id: 'VHC-0282', name: 'Leased Rover', category: 'Van', amount: 614072 },
  { id: 'VHC-0283', name: 'Rental Carrier', category: 'Scooter', amount: 607454 },
  { id: 'VHC-0284', name: 'Spare Courier', category: 'Truck', amount: 616187 },
  { id: 'VHC-0285', name: 'Spare Carrier', category: 'Sedan', amount: 276997 },
  { id: 'VHC-0286', name: 'Field Mover', category: 'Van', amount: 813710 },
];

describe('VehicleTable pagination', () => {
  it('filters, sorts and pages through 12 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0275');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0281');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0281');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-12 of 12');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0284');
    await user.clear(filter);
    await user.type(filter, 'vhc-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });
});
