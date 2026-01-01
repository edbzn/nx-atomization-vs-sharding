import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0165', name: 'Retargeting Webinar', category: 'Search', amount: 603289 },
  { id: 'CMP-0166', name: 'Holiday Newsletter', category: 'Social', amount: 32901 },
  { id: 'CMP-0167', name: 'Summer Newsletter', category: 'Social', amount: 435417 },
  { id: 'CMP-0168', name: 'Retargeting Digest', category: 'Email', amount: 507404 },
  { id: 'CMP-0169', name: 'Retargeting Giveaway', category: 'Email', amount: 637805 },
  { id: 'CMP-0170', name: 'Spring Webinar', category: 'Display', amount: 73644 },
  { id: 'CMP-0171', name: 'Launch Teaser', category: 'Email', amount: 298320 },
  { id: 'CMP-0172', name: 'Holiday Digest', category: 'Display', amount: 665126 },
  { id: 'CMP-0173', name: 'Winter Digest', category: 'Search', amount: 70924 },
  { id: 'CMP-0174', name: 'Clearance Preview', category: 'Search', amount: 938178 },
  { id: 'CMP-0175', name: 'Loyalty Digest', category: 'Event', amount: 16610 },
  { id: 'CMP-0176', name: 'Spring Bundle', category: 'Event', amount: 797049 },
  { id: 'CMP-0177', name: 'Launch Webinar', category: 'Email', amount: 239233 },
  { id: 'CMP-0178', name: 'Summer Contest', category: 'Social', amount: 666595 },
];

describe('CampaignTable search', () => {
  it('filters, sorts and pages through 14 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0165');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-14 of 14');
    expect(screen.queryAllByTestId('row')).toHaveLength(4);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0175');
    await user.clear(filter);
    await user.type(filter, 'Aut');
    expect(screen.getByTestId('table-status').textContent).toBe('No results');
    expect(screen.queryAllByTestId('row')).toHaveLength(0);
  });
});
