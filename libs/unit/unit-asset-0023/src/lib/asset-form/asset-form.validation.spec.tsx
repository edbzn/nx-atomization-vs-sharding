import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AssetForm } from './AssetForm';

describe('AssetForm validation', () => {
  it('validates and saves a asset (7 interactions)', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<AssetForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: 'Save asset' }));
    expect(onSubmit).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId('error-summary').textContent).toBe('4 errors');
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Category is required')).toBeInTheDocument();
    expect(screen.getByText('Amount is required')).toBeInTheDocument();
    await user.clear(screen.getByRole('textbox', { name: 'Amount' }));
    await user.type(screen.getByRole('textbox', { name: 'Amount' }), '-5');
    expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveAccessibleDescription('Amount must be between 1 and 100000');
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Cas Claessens');
    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute('aria-invalid');
    await user.clear(screen.getByRole('textbox', { name: 'Email' }));
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'cas.de.smet46@example.com');
    expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute('aria-invalid');
    await user.clear(screen.getByRole('textbox', { name: 'Amount' }));
    await user.type(screen.getByRole('textbox', { name: 'Amount' }), '9376');
    expect(screen.getByRole('textbox', { name: 'Amount' })).not.toHaveAttribute('aria-invalid');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Laptop');
    expect(screen.getByRole('combobox', { name: 'Category' })).not.toHaveAttribute('aria-invalid');
    await user.click(screen.getByRole('button', { name: 'Save asset' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenLastCalledWith({"name":"Cas Claessens","email":"cas.de.smet46@example.com","category":"Laptop","amount":9376,"notes":""});
    expect(screen.queryByTestId('error-summary')).not.toBeInTheDocument();
  });
});
