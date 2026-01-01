import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0299', name: 'Holiday Contest', category: 'Search', amount: 111800 },
  { id: 'CMP-0300', name: 'Winter Preview', category: 'Event', amount: 315765 },
  { id: 'CMP-0301', name: 'Winter Survey', category: 'Social', amount: 179354 },
  { id: 'CMP-0302', name: 'Autumn Teaser', category: 'Social', amount: 785855 },
  { id: 'CMP-0303', name: 'Retargeting Promo', category: 'Event', amount: 39761 },
  { id: 'CMP-0304', name: 'Summer Bundle', category: 'Event', amount: 723407 },
  { id: 'CMP-0305', name: 'Holiday Giveaway', category: 'Email', amount: 88035 },
  { id: 'CMP-0306', name: 'Referral Contest', category: 'Social', amount: 302715 },
  { id: 'CMP-0307', name: 'Retargeting Webinar', category: 'Event', amount: 354689 },
  { id: 'CMP-0308', name: 'Autumn Teaser', category: 'Event', amount: 625167 },
  { id: 'CMP-0309', name: 'Holiday Teaser', category: 'Social', amount: 661065 },
  { id: 'CMP-0310', name: 'Clearance Newsletter', category: 'Email', amount: 572845 },
  { id: 'CMP-0311', name: 'Holiday Survey', category: 'Event', amount: 273602 },
  { id: 'CMP-0312', name: 'Holiday Digest', category: 'Email', amount: 410724 },
  { id: 'CMP-0313', name: 'Winter Survey', category: 'Display', amount: 863390 },
  { id: 'CMP-0314', name: 'Holiday Contest', category: 'Email', amount: 814585 },
  { id: 'CMP-0315', name: 'Summer Preview', category: 'Display', amount: 86051 },
  { id: 'CMP-0316', name: 'Referral Digest', category: 'Display', amount: 114128 },
];

describe('CampaignTable columns', () => {
  it('filters, sorts and pages through 18 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0299');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0309');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0309');
    await user.clear(filter);
    await user.type(filter, 'pro');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0303');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0299');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0302');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0302');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0299');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0309');
  });
});
