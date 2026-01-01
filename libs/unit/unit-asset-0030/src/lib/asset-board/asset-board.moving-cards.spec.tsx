import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetBoard } from './AssetBoard';

describe('AssetBoard moving cards', () => {
  it('moves 5 cards across the board', async () => {
    const user = userEvent.setup();
    render(<AssetBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Archive bravo river{Enter}');
    await user.type(newCard, 'Fix golf zinc{Enter}');
    await user.type(newCard, 'Price india reef{Enter}');
    expect(cardsIn('todo')).toHaveLength(3);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
    await user.type(newCard, 'Label bravo zephyr{Enter}');
    await user.type(newCard, 'Audit hotel jade{Enter}');
    await user.click(screen.getByRole('button', { name: 'Delete Archive bravo river' }));
    expect(cardsIn('todo')).toHaveLength(4);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 4 done');
    await user.type(newCard, 'Plan alpha lagoon{Enter}');
    expect(cardsIn('todo')).toHaveLength(5);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 5 done');
  });
});
