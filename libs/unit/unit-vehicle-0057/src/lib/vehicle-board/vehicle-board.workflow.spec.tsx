import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VehicleBoard } from './VehicleBoard';

describe('VehicleBoard workflow', () => {
  it('moves 2 cards across the board', async () => {
    const user = userEvent.setup();
    render(<VehicleBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Ship mover vale{Enter}');
    await user.type(newCard, 'Ship carrier kestrel{Enter}');
    await user.click(screen.getByRole('button', { name: 'Start Ship mover vale' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
    await user.clear(filter);
    await user.type(filter, 'carr');
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
  });
});
