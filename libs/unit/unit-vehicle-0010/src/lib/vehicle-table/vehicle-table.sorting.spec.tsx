import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0347', name: 'Spare Courier', category: 'Sedan', amount: 887907 },
  { id: 'VHC-0348', name: 'Compact Mover', category: 'Bike', amount: 269473 },
  { id: 'VHC-0349', name: 'Electric Runner', category: 'Truck', amount: 380722 },
  { id: 'VHC-0350', name: 'Field Carrier', category: 'Sedan', amount: 441584 },
  { id: 'VHC-0351', name: 'Cargo Carrier', category: 'Bike', amount: 880935 },
  { id: 'VHC-0352', name: 'Compact Carrier', category: 'Bike', amount: 59323 },
  { id: 'VHC-0353', name: 'Cargo Runner', category: 'Van', amount: 660917 },
  { id: 'VHC-0354', name: 'Cargo Runner', category: 'Scooter', amount: 364995 },
  { id: 'VHC-0355', name: 'Hybrid Tender', category: 'Sedan', amount: 996862 },
  { id: 'VHC-0356', name: 'Field Mover', category: 'Van', amount: 985708 },
  { id: 'VHC-0357', name: 'Electric Courier', category: 'Bike', amount: 854299 },
  { id: 'VHC-0358', name: 'Pool Hauler', category: 'Van', amount: 522838 },
  { id: 'VHC-0359', name: 'Compact Unit', category: 'Truck', amount: 299519 },
  { id: 'VHC-0360', name: 'Diesel Scout', category: 'Truck', amount: 154607 },
  { id: 'VHC-0361', name: 'Pool Mover', category: 'Van', amount: 770498 },
];

describe('VehicleTable sorting', () => {
  it('filters, sorts and pages through 15 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'hau');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    await user.type(filter, 'VHC-0352');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0347');
    await user.clear(filter);
    await user.type(filter, 'vhc-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0347');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0352');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0347');
    await user.clear(filter);
    await user.type(filter, 'vhc-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'vhc-000');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
    await user.clear(filter);
    await user.type(filter, 'vhc-001');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });
});
