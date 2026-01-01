import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleTable } from './VehicleTable';
import type { VehicleRow } from '../types';

const ROWS: VehicleRow[] = [
  { id: 'VHC-0050', name: 'Leased Carrier', category: 'Sedan', amount: 714219 },
  { id: 'VHC-0051', name: 'Field Rover', category: 'Sedan', amount: 576786 },
  { id: 'VHC-0052', name: 'Compact Mover', category: 'Scooter', amount: 314597 },
  { id: 'VHC-0053', name: 'Compact Tender', category: 'Van', amount: 536829 },
  { id: 'VHC-0054', name: 'Cargo Unit', category: 'Van', amount: 187429 },
  { id: 'VHC-0055', name: 'Cargo Runner', category: 'Sedan', amount: 735098 },
  { id: 'VHC-0056', name: 'Electric Courier', category: 'Van', amount: 881936 },
  { id: 'VHC-0057', name: 'Spare Mover', category: 'Van', amount: 964680 },
  { id: 'VHC-0058', name: 'Spare Shuttle', category: 'Sedan', amount: 744617 },
  { id: 'VHC-0059', name: 'Pool Runner', category: 'Sedan', amount: 974364 },
  { id: 'VHC-0060', name: 'Field Courier', category: 'Sedan', amount: 346683 },
  { id: 'VHC-0061', name: 'Leased Mover', category: 'Sedan', amount: 676370 },
  { id: 'VHC-0062', name: 'Spare Carrier', category: 'Sedan', amount: 867824 },
  { id: 'VHC-0063', name: 'Electric Unit', category: 'Truck', amount: 35012 },
  { id: 'VHC-0064', name: 'Electric Rover', category: 'Scooter', amount: 895077 },
];

describe('VehicleTable filtering 2', () => {
  it('filters, sorts and pages through 15 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0050');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0050');
    await user.clear(filter);
    await user.type(filter, 'scooter');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.clear(filter);
    await user.type(filter, 'VHC-0051');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
  });

  it('filters, sorts and pages through 15 vehicles', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<VehicleTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 15');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'van');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-4 of 4');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('VHC-0053');
  });
});
