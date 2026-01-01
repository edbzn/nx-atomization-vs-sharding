import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContractForm } from './ContractForm';

describe('ContractForm required fields', () => {
  it('validates and saves a contract (6 interactions)', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ContractForm onSubmit={onSubmit} />);
    await user.clear(screen.getByRole('textbox', { name: 'Notes' }));
    await user.type(screen.getByRole('textbox', { name: 'Notes' }), 'maple vale tundra atlas cobalt harbor comet river juniper willow juniper birch');
    expect(screen.getByRole('textbox', { name: 'Notes' })).not.toHaveAttribute('aria-invalid');
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Noor Hendrickx');
    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute('aria-invalid');
    await user.clear(screen.getByRole('textbox', { name: 'Email' }));
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'arne.van.damme95@example.com');
    expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute('aria-invalid');
    await user.clear(screen.getByRole('textbox', { name: 'Amount' }));
    await user.type(screen.getByRole('textbox', { name: 'Amount' }), '33070');
    expect(screen.getByRole('textbox', { name: 'Amount' })).not.toHaveAttribute('aria-invalid');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Review');
    expect(screen.getByRole('combobox', { name: 'Category' })).not.toHaveAttribute('aria-invalid');
    await user.click(screen.getByRole('button', { name: 'Save contract' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenLastCalledWith({"name":"Noor Hendrickx","email":"arne.van.damme95@example.com","category":"Review","amount":33070,"notes":"maple vale tundra atlas cobalt harbor comet river juniper willow juniper birch"});
    expect(screen.queryByTestId('error-summary')).not.toBeInTheDocument();
  });
});
