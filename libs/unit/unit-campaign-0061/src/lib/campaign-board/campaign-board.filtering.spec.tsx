import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignBoard } from './CampaignBoard';

describe('CampaignBoard filtering', () => {
  it('moves 3 cards across the board', async () => {
    const user = userEvent.setup();
    render(<CampaignBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Review webinar reef{Enter}');
    await user.type(newCard, 'Plan digest sage{Enter}');
    await user.type(newCard, 'Fix contest iris{Enter}');
    expect(cardsIn('todo')).toHaveLength(3);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
    await user.type(newCard, 'FIX CONTEST IRIS{Enter}');
    expect(screen.getByTestId('board-message').textContent).toBe('"FIX CONTEST IRIS" already exists');
    await user.click(screen.getByRole('button', { name: 'Start Fix contest iris' }));
    expect(cardsIn('todo')).toHaveLength(2);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 3 done');
  });
});
