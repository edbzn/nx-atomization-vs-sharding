import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0103', name: 'Electric Runner', category: 'Truck', amount: 476846 },
  { id: 'VHC-0104', name: 'Compact Unit', category: 'Sedan', amount: 952261 },
  { id: 'VHC-0105', name: 'Electric Runner', category: 'Van', amount: 306992 },
  { id: 'VHC-0106', name: 'Field Scout', category: 'Van', amount: 175454 },
  { id: 'VHC-0107', name: 'Field Tender', category: 'Sedan', amount: 802566 },
  { id: 'VHC-0108', name: 'Field Courier', category: 'Van', amount: 533145 },
  { id: 'VHC-0109', name: 'Compact Tender', category: 'Scooter', amount: 724352 },
  { id: 'VHC-0110', name: 'Cargo Runner', category: 'Van', amount: 22093 },
  { id: 'VHC-0111', name: 'Electric Tender', category: 'Bike', amount: 696544 },
  { id: 'VHC-0112', name: 'Field Carrier', category: 'Scooter', amount: 513522 },
  { id: 'VHC-0113', name: 'Diesel Courier', category: 'Bike', amount: 428843 },
  { id: 'VHC-0114', name: 'Electric Runner', category: 'Scooter', amount: 83626 },
  { id: 'VHC-0115', name: 'Field Unit', category: 'Bike', amount: 888535 },
  { id: 'VHC-0116', name: 'Electric Scout', category: 'Scooter', amount: 425649 },
  { id: 'VHC-0117', name: 'Cargo Tender', category: 'Truck', amount: 201264 },
  { id: 'VHC-0118', name: 'Compact Scout', category: 'Truck', amount: 185105 },
  { id: 'VHC-0119', name: 'Pool Tender', category: 'Van', amount: 132052 },
  { id: 'VHC-0120', name: 'Electric Mover', category: 'Scooter', amount: 725752 },
];

describe('VehicleTable large dataset', () => {
  it('filters, sorts and pages through 15 vehicles', async () => {
    const rows = ROWS.slice(0, 15);
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0103');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0113');
  });

  it('filters, sorts and pages through 18 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0110');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0103');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0103');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0103');
  });
});
