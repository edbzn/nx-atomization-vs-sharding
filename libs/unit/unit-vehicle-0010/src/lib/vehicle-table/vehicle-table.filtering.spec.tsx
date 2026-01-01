import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0020', name: 'Compact Mover', category: 'Van', amount: 564619 },
  { id: 'VHC-0021', name: 'Hybrid Unit', category: 'Sedan', amount: 578257 },
  { id: 'VHC-0022', name: 'Compact Hauler', category: 'Sedan', amount: 962326 },
  { id: 'VHC-0023', name: 'Compact Shuttle', category: 'Scooter', amount: 900686 },
  { id: 'VHC-0024', name: 'Field Tender', category: 'Van', amount: 351868 },
  { id: 'VHC-0025', name: 'Spare Scout', category: 'Sedan', amount: 64519 },
  { id: 'VHC-0026', name: 'Compact Runner', category: 'Van', amount: 748940 },
  { id: 'VHC-0027', name: 'Field Unit', category: 'Van', amount: 887658 },
  { id: 'VHC-0028', name: 'Cargo Scout', category: 'Van', amount: 509660 },
  { id: 'VHC-0029', name: 'Cargo Runner', category: 'Van', amount: 241907 },
  { id: 'VHC-0030', name: 'Pool Hauler', category: 'Sedan', amount: 77209 },
  { id: 'VHC-0031', name: 'Pool Scout', category: 'Bike', amount: 356380 },
  { id: 'VHC-0032', name: 'Hybrid Courier', category: 'Scooter', amount: 431321 },
  { id: 'VHC-0033', name: 'Compact Shuttle', category: 'Truck', amount: 849692 },
  { id: 'VHC-0034', name: 'Field Mover', category: 'Truck', amount: 590148 },
  { id: 'VHC-0035', name: 'Pool Courier', category: 'Truck', amount: 271525 },
  { id: 'VHC-0036', name: 'Spare Unit', category: 'Van', amount: 777039 },
  { id: 'VHC-0037', name: 'Diesel Shuttle', category: 'Van', amount: 7751 },
  { id: 'VHC-0038', name: 'Compact Scout', category: 'Truck', amount: 470058 },
  { id: 'VHC-0039', name: 'Electric Runner', category: 'Truck', amount: 649575 },
];

describe('VehicleTable filtering', () => {
  it('filters, sorts and pages through 20 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0020');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-20 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0030');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0020');
    await user.clear(filter);
    await user.type(filter, 'truck');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-5 of 5');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    await user.clear(filter);
    await user.type(filter, 'cou');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-6 of 6');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    await user.clear(filter);
    await user.type(filter, 'cour');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0020');
    await user.clear(filter);
    await user.type(filter, 'vhc-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'Hybri');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0020');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0029');
  });

  it('filters, sorts and pages through 19 vehicles', async () => {
    const rows = ROWS.slice(0, 19);
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'unit');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0020');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0030');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-19 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(9);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0030');
  });

  it('filters, sorts and pages through 20 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'vhc-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0020');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-20 of 20');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0030');
  });
});
