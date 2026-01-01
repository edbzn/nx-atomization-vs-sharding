import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractBoard } from './ContractBoard';

describe('ContractBoard moving cards 2', () => {
  it('moves 4 cards across the board', async () => {
    const user = userEvent.setup();
    render(<ContractBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Audit schedule comet{Enter}');
    await user.type(newCard, 'Fix addendum falcon{Enter}');
    await user.type(newCard, 'Test addendum drift{Enter}');
    expect(cardsIn('todo')).toHaveLength(3);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
    await user.click(screen.getByRole('button', { name: 'Start Fix addendum falcon' }));
    expect(cardsIn('todo')).toHaveLength(2);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
    await user.type(newCard, 'Archive order sage{Enter}');
    await user.click(screen.getByRole('button', { name: 'Start Test addendum drift' }));
    expect(cardsIn('todo')).toHaveLength(2);
    expect(cardsIn('doing')).toHaveLength(2);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 4 done');
    await user.click(screen.getByRole('button', { name: 'Start Archive order sage' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(3);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 4 done');
  });

  it('moves 2 cards across the board', async () => {
    const user = userEvent.setup();
    render(<ContractBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Audit schedule jade{Enter}');
    await user.type(newCard, 'Price order velvet{Enter}');
    await user.click(screen.getByRole('button', { name: 'Start Audit schedule jade' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
    await user.clear(filter);
    await user.type(filter, 'Pric');
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
  });

  it('moves 1 cards across the board', async () => {
    const user = userEvent.setup();
    render(<ContractBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Draft schedule onyx{Enter}');
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 1 done');
  });
});
