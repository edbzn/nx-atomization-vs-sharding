import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0342', name: 'Clearance Newsletter', category: 'Email', amount: 85927 },
  { id: 'CMP-0343', name: 'Holiday Bundle', category: 'Event', amount: 989898 },
  { id: 'CMP-0344', name: 'Retargeting Promo', category: 'Event', amount: 796058 },
  { id: 'CMP-0345', name: 'Summer Contest', category: 'Display', amount: 79191 },
  { id: 'CMP-0346', name: 'Autumn Giveaway', category: 'Display', amount: 279072 },
  { id: 'CMP-0347', name: 'Winter Preview', category: 'Social', amount: 108387 },
  { id: 'CMP-0348', name: 'Retargeting Contest', category: 'Social', amount: 183649 },
  { id: 'CMP-0349', name: 'Autumn Webinar', category: 'Email', amount: 282841 },
  { id: 'CMP-0350', name: 'Summer Newsletter', category: 'Search', amount: 422936 },
  { id: 'CMP-0351', name: 'Referral Teaser', category: 'Email', amount: 418860 },
  { id: 'CMP-0352', name: 'Winter Teaser', category: 'Social', amount: 990140 },
  { id: 'CMP-0353', name: 'Winter Digest', category: 'Search', amount: 685726 },
  { id: 'CMP-0354', name: 'Holiday Teaser', category: 'Social', amount: 362111 },
];

describe('CampaignTable pagination', () => {
  it('filters, sorts and pages through 13 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-13 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0352');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 13');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0346');
  });
});
