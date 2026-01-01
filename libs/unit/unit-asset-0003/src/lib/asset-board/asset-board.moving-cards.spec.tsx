import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AssetBoard } from './AssetBoard';

describe('AssetBoard moving cards', () => {
  it('moves 3 cards across the board', async () => {
    const user = userEvent.setup();
    render(<AssetBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Fix echo sage{Enter}');
    await user.type(newCard, 'Price hotel prism{Enter}');
    await user.click(screen.getByRole('button', { name: 'Start Price hotel prism' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
    await user.click(screen.getByRole('button', { name: 'Start Fix echo sage' }));
    expect(cardsIn('todo')).toHaveLength(0);
    expect(cardsIn('doing')).toHaveLength(2);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
    await user.click(screen.getByRole('button', { name: 'Delete Fix echo sage' }));
    expect(cardsIn('todo')).toHaveLength(0);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 1 done');
    await user.type(newCard, 'Plan charlie juniper{Enter}');
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
    await user.click(screen.getByRole('button', { name: 'Start Plan charlie juniper' }));
    expect(cardsIn('todo')).toHaveLength(0);
    expect(cardsIn('doing')).toHaveLength(2);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
    await user.click(screen.getByRole('button', { name: 'Pause Price hotel prism' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
    await user.type(newCard, 'Price india lagoon{Enter}');
    expect(cardsIn('todo')).toHaveLength(2);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
  });

  it('moves 1 cards across the board', async () => {
    const user = userEvent.setup();
    render(<AssetBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Label india orbit{Enter}');
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 1 done');
  });

  it('moves 1 cards across the board', async () => {
    const user = userEvent.setup();
    render(<AssetBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Ship alpha indigo{Enter}');
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 1 done');
  });
});
