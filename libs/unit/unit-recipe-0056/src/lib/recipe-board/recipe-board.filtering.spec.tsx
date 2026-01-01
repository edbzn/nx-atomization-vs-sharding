import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RecipeBoard } from './RecipeBoard';

describe('RecipeBoard filtering', () => {
  it('moves 5 cards across the board', async () => {
    const user = userEvent.setup();
    render(<RecipeBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Fix stew jade{Enter}');
    await user.type(newCard, 'Label soup alpha{Enter}');
    await user.type(newCard, 'Label gratin garnet{Enter}');
    expect(cardsIn('todo')).toHaveLength(3);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
    await user.type(newCard, 'Ship salad reef{Enter}');
    await user.click(screen.getByRole('button', { name: 'Delete Ship salad reef' }));
    expect(cardsIn('todo')).toHaveLength(3);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
    await user.type(newCard, 'Plan curry pine{Enter}');
    expect(cardsIn('todo')).toHaveLength(4);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 4 done');
    await user.type(newCard, 'Draft stew hazel{Enter}');
    expect(cardsIn('todo')).toHaveLength(5);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 5 done');
  });

  it('moves 1 cards across the board', async () => {
    const user = userEvent.setup();
    render(<RecipeBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Audit tart iris{Enter}');
    await user.type(newCard, 'Price salad blaze{Enter}');
    await user.click(screen.getByRole('button', { name: 'Delete Audit tart iris' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 1 done');
    await user.type(newCard, 'Plan curry sable{Enter}');
    await user.click(screen.getByRole('button', { name: 'Delete Plan curry sable' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 1 done');
  });

  it('moves 1 cards across the board', async () => {
    const user = userEvent.setup();
    render(<RecipeBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Test noodles nectar{Enter}');
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 1 done');
  });
});
