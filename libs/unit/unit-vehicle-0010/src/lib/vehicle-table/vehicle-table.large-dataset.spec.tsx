import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0176', name: 'Compact Carrier', category: 'Bike', amount: 953035 },
  { id: 'VHC-0177', name: 'Compact Unit', category: 'Truck', amount: 609956 },
  { id: 'VHC-0178', name: 'Hybrid Tender', category: 'Bike', amount: 787421 },
  { id: 'VHC-0179', name: 'Cargo Scout', category: 'Scooter', amount: 542598 },
  { id: 'VHC-0180', name: 'Hybrid Mover', category: 'Sedan', amount: 811206 },
  { id: 'VHC-0181', name: 'Leased Tender', category: 'Van', amount: 647199 },
  { id: 'VHC-0182', name: 'Rental Shuttle', category: 'Sedan', amount: 324546 },
  { id: 'VHC-0183', name: 'Diesel Runner', category: 'Sedan', amount: 834636 },
  { id: 'VHC-0184', name: 'Hybrid Courier', category: 'Scooter', amount: 937860 },
  { id: 'VHC-0185', name: 'Field Unit', category: 'Sedan', amount: 642364 },
  { id: 'VHC-0186', name: 'Cargo Scout', category: 'Bike', amount: 79220 },
  { id: 'VHC-0187', name: 'Compact Rover', category: 'Bike', amount: 244759 },
  { id: 'VHC-0188', name: 'Compact Carrier', category: 'Truck', amount: 191976 },
];

describe('VehicleTable large dataset', () => {
  it('filters, sorts and pages through 13 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-13 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0186');
    await user.clear(filter);
    await user.type(filter, 'scooter');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0179');
  });
});
