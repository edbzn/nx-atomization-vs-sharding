import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleBoard } from './VehicleBoard';

describe('VehicleBoard moving cards', () => {
  it('moves 4 cards across the board', async () => {
    const user = userEvent.setup();
    render(<VehicleBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Draft mover oak{Enter}');
    await user.type(newCard, 'Fix courier juniper{Enter}');
    await user.type(newCard, 'Test hauler flint{Enter}');
    expect(cardsIn('todo')).toHaveLength(3);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
    await user.type(newCard, 'FIX COURIER JUNIPER{Enter}');
    expect(screen.getByTestId('board-message').textContent).toBe('"FIX COURIER JUNIPER" already exists');
    await user.click(screen.getByRole('button', { name: 'Start Fix courier juniper' }));
    expect(cardsIn('todo')).toHaveLength(2);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
    await user.click(screen.getByRole('button', { name: 'Start Draft mover oak' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(2);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
    await user.type(newCard, 'Review unit amber{Enter}');
    await user.click(screen.getByRole('button', { name: 'Start Test hauler flint' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(3);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 4 done');
  });

  it('moves 1 cards across the board', async () => {
    const user = userEvent.setup();
    render(<VehicleBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Price scout zinc{Enter}');
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 1 done');
  });
});
