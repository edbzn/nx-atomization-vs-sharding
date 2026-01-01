import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EmployeeBoard } from './EmployeeBoard';

describe('EmployeeBoard workflow', () => {
  it('moves 2 cards across the board', async () => {
    const user = userEvent.setup();
    render(<EmployeeBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Price smet kestrel{Enter}');
    await user.type(newCard, 'Draft lambert flint{Enter}');
    await user.type(newCard, 'DRAFT LAMBERT FLINT{Enter}');
    expect(screen.getByTestId('board-message').textContent).toBe('"DRAFT LAMBERT FLINT" already exists');
    expect(cardsIn('todo')).toHaveLength(2);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
  });

  it('moves 1 cards across the board', async () => {
    const user = userEvent.setup();
    render(<EmployeeBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Ship leroy oak{Enter}');
    await user.type(newCard, 'Price hermans velvet{Enter}');
    await user.click(screen.getByRole('button', { name: 'Delete Price hermans velvet' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 1 done');
  });
});
