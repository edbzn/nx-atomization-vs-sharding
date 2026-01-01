import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { VehicleForm } from './VehicleForm';

describe('VehicleForm amount', () => {
  it('validates and saves a vehicle (6 interactions)', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<VehicleForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: 'Save vehicle' }));
    expect(onSubmit).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId('error-summary').textContent).toBe('4 errors');
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Category is required')).toBeInTheDocument();
    expect(screen.getByText('Amount is required')).toBeInTheDocument();
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Noor Claessens');
    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute('aria-invalid');
    await user.clear(screen.getByRole('textbox', { name: 'Email' }));
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'sara.coppens21@example.com');
    expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute('aria-invalid');
    await user.clear(screen.getByRole('textbox', { name: 'Amount' }));
    await user.type(screen.getByRole('textbox', { name: 'Amount' }), '61467');
    expect(screen.getByRole('textbox', { name: 'Amount' })).not.toHaveAttribute('aria-invalid');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Truck');
    expect(screen.getByRole('combobox', { name: 'Category' })).not.toHaveAttribute('aria-invalid');
    await user.click(screen.getByRole('button', { name: 'Save vehicle' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenLastCalledWith({"name":"Noor Claessens","email":"sara.coppens21@example.com","category":"Truck","amount":61467,"notes":""});
    expect(screen.queryByTestId('error-summary')).not.toBeInTheDocument();
  });
});
