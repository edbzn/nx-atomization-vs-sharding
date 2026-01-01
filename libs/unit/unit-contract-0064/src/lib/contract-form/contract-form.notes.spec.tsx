import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContractForm } from './ContractForm';

describe('ContractForm notes', () => {
  it('validates and saves a contract (6 interactions)', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ContractForm onSubmit={onSubmit} />);
    await user.clear(screen.getByRole('textbox', { name: 'Email' }));
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'missing.at.example.com');
    expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute('aria-invalid');
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Supply Schedule 18');
    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute('aria-invalid');
    await user.clear(screen.getByRole('textbox', { name: 'Email' }));
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'zoe.coppens92@example.com');
    expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute('aria-invalid');
    await user.clear(screen.getByRole('textbox', { name: 'Amount' }));
    await user.type(screen.getByRole('textbox', { name: 'Amount' }), '94801');
    expect(screen.getByRole('textbox', { name: 'Amount' })).not.toHaveAttribute('aria-invalid');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Review');
    expect(screen.getByRole('combobox', { name: 'Category' })).not.toHaveAttribute('aria-invalid');
    await user.click(screen.getByRole('button', { name: 'Save contract' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenLastCalledWith({"name":"Supply Schedule 18","email":"zoe.coppens92@example.com","category":"Review","amount":94801,"notes":""});
    expect(screen.queryByTestId('error-summary')).not.toBeInTheDocument();
  });
});
