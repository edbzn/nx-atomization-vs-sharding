import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetBoard } from './AssetBoard';

describe('AssetBoard workflow', () => {
  it('moves 3 cards across the board', async () => {
    const user = userEvent.setup();
    render(<AssetBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Audit hotel spruce{Enter}');
    await user.type(newCard, 'AUDIT HOTEL SPRUCE{Enter}');
    expect(screen.getByTestId('board-message').textContent).toBe('"AUDIT HOTEL SPRUCE" already exists');
    await user.type(newCard, 'Review echo lark{Enter}');
    expect(cardsIn('todo')).toHaveLength(2);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
    await user.type(newCard, 'Ship india topaz{Enter}');
    await user.clear(filter);
    await user.type(filter, 'indi');
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
    await user.click(screen.getByRole('button', { name: 'Start Ship india topaz' }));
    expect(cardsIn('todo')).toHaveLength(0);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
    await user.click(screen.getByRole('button', { name: 'Finish Ship india topaz' }));
    expect(cardsIn('todo')).toHaveLength(0);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(1);
    expect(screen.getByTestId('board-summary').textContent).toBe('1 of 3 done');
  });

  it('moves 1 cards across the board', async () => {
    const user = userEvent.setup();
    render(<AssetBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Test alpha iris{Enter}');
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 1 done');
  });
});
