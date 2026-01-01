import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0191', name: 'Field Tender', category: 'Bike', amount: 189432 },
  { id: 'VHC-0192', name: 'Electric Rover', category: 'Scooter', amount: 278436 },
  { id: 'VHC-0193', name: 'Leased Hauler', category: 'Truck', amount: 207706 },
  { id: 'VHC-0194', name: 'Rental Hauler', category: 'Sedan', amount: 283043 },
  { id: 'VHC-0195', name: 'Electric Tender', category: 'Truck', amount: 758076 },
  { id: 'VHC-0196', name: 'Leased Courier', category: 'Sedan', amount: 770322 },
  { id: 'VHC-0197', name: 'Leased Courier', category: 'Truck', amount: 232193 },
  { id: 'VHC-0198', name: 'Rental Scout', category: 'Sedan', amount: 45141 },
  { id: 'VHC-0199', name: 'Rental Unit', category: 'Sedan', amount: 368635 },
  { id: 'VHC-0200', name: 'Hybrid Shuttle', category: 'Scooter', amount: 240389 },
  { id: 'VHC-0201', name: 'Pool Rover', category: 'Van', amount: 448073 },
  { id: 'VHC-0202', name: 'Electric Runner', category: 'Bike', amount: 551305 },
  { id: 'VHC-0203', name: 'Pool Runner', category: 'Scooter', amount: 12750 },
  { id: 'VHC-0204', name: 'Field Hauler', category: 'Bike', amount: 257132 },
  { id: 'VHC-0205', name: 'Spare Scout', category: 'Van', amount: 466173 },
  { id: 'VHC-0206', name: 'Compact Rover', category: 'Bike', amount: 706725 },
  { id: 'VHC-0207', name: 'Electric Runner', category: 'Scooter', amount: 50492 },
  { id: 'VHC-0208', name: 'Field Scout', category: 'Truck', amount: 63320 },
];

describe('VehicleTable filtering', () => {
  it('filters, sorts and pages through 18 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0191');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0191');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0191');
  });

  it('filters, sorts and pages through 15 vehicles', async () => {
    const rows = ROWS.slice(0, 15);
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0191');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-15 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(5);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0201');
  });

  it('filters, sorts and pages through 18 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0201');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0191');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0191');
  });
});
