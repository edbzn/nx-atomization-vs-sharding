import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0079', name: 'Field Unit', category: 'Scooter', amount: 477634 },
  { id: 'VHC-0080', name: 'Hybrid Runner', category: 'Sedan', amount: 997504 },
  { id: 'VHC-0081', name: 'Rental Tender', category: 'Sedan', amount: 540562 },
  { id: 'VHC-0082', name: 'Spare Carrier', category: 'Sedan', amount: 35303 },
  { id: 'VHC-0083', name: 'Hybrid Courier', category: 'Sedan', amount: 379419 },
  { id: 'VHC-0084', name: 'Spare Rover', category: 'Scooter', amount: 919756 },
  { id: 'VHC-0085', name: 'Hybrid Runner', category: 'Sedan', amount: 431869 },
  { id: 'VHC-0086', name: 'Hybrid Tender', category: 'Truck', amount: 144153 },
  { id: 'VHC-0087', name: 'Diesel Rover', category: 'Sedan', amount: 998521 },
  { id: 'VHC-0088', name: 'Leased Unit', category: 'Sedan', amount: 40014 },
  { id: 'VHC-0089', name: 'Rental Unit', category: 'Truck', amount: 190327 },
  { id: 'VHC-0090', name: 'Rental Runner', category: 'Truck', amount: 98809 },
  { id: 'VHC-0091', name: 'Spare Carrier', category: 'Bike', amount: 830491 },
  { id: 'VHC-0092', name: 'Field Shuttle', category: 'Truck', amount: 580487 },
];

describe('VehicleTable sorting', () => {
  it('filters, sorts and pages through 14 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0089');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0087');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0089');
  });

  it('filters, sorts and pages through 14 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0082');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0091');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0087');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0089');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0084');
    await user.clear(filter);
    await user.type(filter, 'Carg');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });
});
