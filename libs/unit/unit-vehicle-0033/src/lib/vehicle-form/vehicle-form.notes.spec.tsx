import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { VehicleForm } from './VehicleForm';

describe('VehicleForm notes', () => {
  it('validates and saves a vehicle (7 interactions)', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<VehicleForm onSubmit={onSubmit} />);
    await user.clear(screen.getByRole('textbox', { name: 'Notes' }));
    await user.type(screen.getByRole('textbox', { name: 'Notes' }), 'mesa delta pebble velvet apex delta indigo cobalt harbor ember frost tide mesa orbit frost juniper fern birch fern fern vale sable orbit jade delta jade summit onyx zinc reef nectar nectar nectar quart');
    expect(screen.getByRole('textbox', { name: 'Notes' })).not.toHaveAttribute('aria-invalid');
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ruben Martens');
    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute('aria-invalid');
    await user.clear(screen.getByRole('textbox', { name: 'Email' }));
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'wout.van.damme71@example.com');
    expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute('aria-invalid');
    await user.clear(screen.getByRole('textbox', { name: 'Amount' }));
    await user.type(screen.getByRole('textbox', { name: 'Amount' }), '79623');
    expect(screen.getByRole('textbox', { name: 'Amount' })).not.toHaveAttribute('aria-invalid');
    await user.clear(screen.getByRole('textbox', { name: 'Notes' }));
    await user.type(screen.getByRole('textbox', { name: 'Notes' }), 'zephyr cedar maple flint topaz amber pine falcon orbit onyx');
    expect(screen.getByRole('textbox', { name: 'Notes' })).not.toHaveAttribute('aria-invalid');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Sedan');
    expect(screen.getByRole('combobox', { name: 'Category' })).not.toHaveAttribute('aria-invalid');
    await user.click(screen.getByRole('button', { name: 'Save vehicle' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenLastCalledWith({"name":"Ruben Martens","email":"wout.van.damme71@example.com","category":"Sedan","amount":79623,"notes":"zephyr cedar maple flint topaz amber pine falcon orbit onyx"});
    expect(screen.queryByTestId('error-summary')).not.toBeInTheDocument();
  });
});
