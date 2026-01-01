import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0143', name: 'Spring Webinar', category: 'Display', amount: 927164 },
  { id: 'CMP-0144', name: 'Clearance Webinar', category: 'Search', amount: 344989 },
  { id: 'CMP-0145', name: 'Holiday Survey', category: 'Display', amount: 54450 },
  { id: 'CMP-0146', name: 'Holiday Promo', category: 'Email', amount: 454373 },
  { id: 'CMP-0147', name: 'Summer Teaser', category: 'Email', amount: 611546 },
  { id: 'CMP-0148', name: 'Loyalty Teaser', category: 'Email', amount: 880430 },
  { id: 'CMP-0149', name: 'Winter Promo', category: 'Display', amount: 181859 },
  { id: 'CMP-0150', name: 'Launch Digest', category: 'Search', amount: 357568 },
  { id: 'CMP-0151', name: 'Holiday Webinar', category: 'Email', amount: 880090 },
  { id: 'CMP-0152', name: 'Holiday Digest', category: 'Email', amount: 775753 },
  { id: 'CMP-0153', name: 'Clearance Teaser', category: 'Email', amount: 623461 },
  { id: 'CMP-0154', name: 'Retargeting Digest', category: 'Social', amount: 247022 },
  { id: 'CMP-0155', name: 'Retargeting Bundle', category: 'Display', amount: 664851 },
  { id: 'CMP-0156', name: 'Loyalty Promo', category: 'Search', amount: 526411 },
  { id: 'CMP-0157', name: 'Autumn Webinar', category: 'Event', amount: 276461 },
  { id: 'CMP-0158', name: 'Launch Contest', category: 'Event', amount: 324471 },
  { id: 'CMP-0159', name: 'Retargeting Digest', category: 'Email', amount: 804216 },
  { id: 'CMP-0160', name: 'Launch Promo', category: 'Display', amount: 441325 },
  { id: 'CMP-0161', name: 'Winter Promo', category: 'Social', amount: 882811 },
];

describe('CampaignTable search', () => {
  it('filters, sorts and pages through 19 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'tease');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-3 of 3');
    expect(screen.queryAllByTestId('row')).toHaveLength(3);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0153');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0157');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 19');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0149');
  });
});
