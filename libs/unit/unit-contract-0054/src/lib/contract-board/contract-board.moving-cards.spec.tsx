import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractBoard } from './ContractBoard';

describe('ContractBoard moving cards', () => {
  it('moves 3 cards across the board', async () => {
    const user = userEvent.setup();
    render(<ContractBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Test annex pebble{Enter}');
    await user.type(newCard, 'Price accord delta{Enter}');
    await user.type(newCard, 'Plan agreement flint{Enter}');
    expect(cardsIn('todo')).toHaveLength(3);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
    await user.click(screen.getByRole('button', { name: 'Start Test annex pebble' }));
    expect(cardsIn('todo')).toHaveLength(2);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
    await user.click(screen.getByRole('button', { name: 'Start Price accord delta' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(2);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
  });

  it('moves 1 cards across the board', async () => {
    const user = userEvent.setup();
    render(<ContractBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Archive addendum lark{Enter}');
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 1 done');
  });
});
