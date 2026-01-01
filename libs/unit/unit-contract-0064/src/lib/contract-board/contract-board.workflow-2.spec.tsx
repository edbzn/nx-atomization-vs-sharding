import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContractBoard } from './ContractBoard';

describe('ContractBoard workflow 2', () => {
  it('moves 3 cards across the board', async () => {
    const user = userEvent.setup();
    render(<ContractBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Ship notice blaze{Enter}');
    await user.type(newCard, 'Draft accord pine{Enter}');
    await user.click(screen.getByRole('button', { name: 'Start Ship notice blaze' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
    await user.click(screen.getByRole('button', { name: 'Finish Ship notice blaze' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(1);
    expect(screen.getByTestId('board-summary').textContent).toBe('1 of 2 done');
    await user.type(newCard, 'Fix waiver pebble{Enter}');
    await user.clear(filter);
    await user.type(filter, 'blaz');
    expect(cardsIn('todo')).toHaveLength(0);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(1);
    expect(screen.getByTestId('board-summary').textContent).toBe('1 of 3 done');
    await user.click(screen.getByRole('button', { name: 'Reopen Ship notice blaze' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
    await user.click(screen.getByRole('button', { name: 'Start Ship notice blaze' }));
    expect(cardsIn('todo')).toHaveLength(0);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
  });

  it('moves 1 cards across the board', async () => {
    const user = userEvent.setup();
    render(<ContractBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Price annex river{Enter}');
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 1 done');
  });

  it('moves 1 cards across the board', async () => {
    const user = userEvent.setup();
    render(<ContractBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Review accord flint{Enter}');
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 1 done');
  });
});
