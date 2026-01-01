import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignBoard } from './CampaignBoard';

describe('CampaignBoard workflow', () => {
  it('moves 1 cards across the board', async () => {
    const user = userEvent.setup();
    render(<CampaignBoard />);
    const cardsIn = (status: string) => within(screen.getByTestId(`column-${status}`)).queryAllByTestId('card');
    const newCard = screen.getByRole('textbox', { name: 'New card' });
    const filter = screen.getByRole('searchbox', { name: 'Filter cards' });
    await user.type(newCard, 'Fix preview tundra{Enter}');
    await user.type(newCard, 'Plan promo falcon{Enter}');
    await user.click(screen.getByRole('button', { name: 'Start Fix preview tundra' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(1);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
    await user.type(newCard, 'Label newsletter ridge{Enter}');
    await user.type(newCard, 'LABEL NEWSLETTER RIDGE{Enter}');
    expect(screen.getByTestId('board-message').textContent).toBe('"LABEL NEWSLETTER RIDGE" already exists');
    await user.click(screen.getByRole('button', { name: 'Delete Fix preview tundra' }));
    expect(cardsIn('todo')).toHaveLength(2);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 2 done');
    await user.click(screen.getByRole('button', { name: 'Delete Label newsletter ridge' }));
    expect(cardsIn('todo')).toHaveLength(1);
    expect(cardsIn('doing')).toHaveLength(0);
    expect(cardsIn('done')).toHaveLength(0);
    expect(screen.getByTestId('board-summary').textContent).toBe('0 of 1 done');
  });
});
