import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractBoard } from './ContractBoard';

describe('ContractBoard moving cards', () => {
  it('moves 2 cards across the board', async () => {
    const user = userEvent.setup();
    render(<ContractBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Fix annex umber{Enter}');
    await user.type(newCard, 'FIX ANNEX UMBER{Enter}');
    expect(screen.getByTestId('board-message').textContent).toBe('"FIX ANNEX UMBER" already exists');
    await user.type(newCard, 'Label notice nova{Enter}');
    expect(cardsIn('todo')).toHaveLength(2);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
    await user.click(screen.getByRole('button', { name: 'Start Label notice nova' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
    await user.clear(filter);
    await user.type(filter, 'nova');
    expect(cardsIn('todo')).toHaveLength(0);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
  });
});
