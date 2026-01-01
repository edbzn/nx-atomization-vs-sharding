import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0371', name: 'Referral Promo', category: 'Display', amount: 450186 },
  { id: 'CMP-0372', name: 'Summer Survey', category: 'Search', amount: 187464 },
  { id: 'CMP-0373', name: 'Loyalty Bundle', category: 'Search', amount: 739879 },
  { id: 'CMP-0374', name: 'Clearance Digest', category: 'Email', amount: 663940 },
  { id: 'CMP-0375', name: 'Loyalty Bundle', category: 'Social', amount: 894774 },
  { id: 'CMP-0376', name: 'Spring Survey', category: 'Search', amount: 798464 },
  { id: 'CMP-0377', name: 'Referral Bundle', category: 'Search', amount: 321253 },
  { id: 'CMP-0378', name: 'Summer Bundle', category: 'Display', amount: 105843 },
  { id: 'CMP-0379', name: 'Spring Survey', category: 'Email', amount: 955130 },
  { id: 'CMP-0380', name: 'Launch Giveaway', category: 'Social', amount: 480683 },
  { id: 'CMP-0381', name: 'Spring Contest', category: 'Display', amount: 447838 },
  { id: 'CMP-0382', name: 'Spring Digest', category: 'Event', amount: 993593 },
  { id: 'CMP-0383', name: 'Launch Teaser', category: 'Social', amount: 904012 },
  { id: 'CMP-0384', name: 'Summer Giveaway', category: 'Social', amount: 710243 },
  { id: 'CMP-0385', name: 'Retargeting Webinar', category: 'Search', amount: 944274 },
  { id: 'CMP-0386', name: 'Autumn Webinar', category: 'Search', amount: 205772 },
  { id: 'CMP-0387', name: 'Holiday Survey', category: 'Search', amount: 424635 },
  { id: 'CMP-0388', name: 'Clearance Survey', category: 'Display', amount: 101445 },
];

describe('CampaignTable sorting', () => {
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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0371');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0371');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0381');
    await user.click(screen.getByRole('button', { name: /^Amount/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0388');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0384');
  });

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
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0371');
    await user.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0386');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-18 of 18');
    expect(screen.queryAllByTestId('row')).toHaveLength(8);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0385');
  });
});
