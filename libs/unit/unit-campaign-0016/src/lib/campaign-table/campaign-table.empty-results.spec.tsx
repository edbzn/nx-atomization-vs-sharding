import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CampaignTable } from './CampaignTable';
import type { CampaignRow } from '../types';

const ROWS: CampaignRow[] = [
  { id: 'CMP-0385', name: 'Referral Preview', category: 'Search', amount: 388358 },
  { id: 'CMP-0386', name: 'Autumn Webinar', category: 'Email', amount: 805255 },
  { id: 'CMP-0387', name: 'Holiday Teaser', category: 'Event', amount: 486864 },
  { id: 'CMP-0388', name: 'Summer Webinar', category: 'Email', amount: 784036 },
  { id: 'CMP-0389', name: 'Loyalty Bundle', category: 'Email', amount: 371906 },
  { id: 'CMP-0390', name: 'Clearance Preview', category: 'Event', amount: 975748 },
  { id: 'CMP-0391', name: 'Retargeting Digest', category: 'Social', amount: 802741 },
  { id: 'CMP-0392', name: 'Winter Bundle', category: 'Email', amount: 980140 },
  { id: 'CMP-0393', name: 'Loyalty Digest', category: 'Email', amount: 388162 },
  { id: 'CMP-0394', name: 'Clearance Digest', category: 'Search', amount: 152511 },
  { id: 'CMP-0395', name: 'Clearance Giveaway', category: 'Social', amount: 555096 },
  { id: 'CMP-0396', name: 'Loyalty Promo', category: 'Email', amount: 339121 },
  { id: 'CMP-0397', name: 'Spring Survey', category: 'Display', amount: 857474 },
  { id: 'CMP-0398', name: 'Loyalty Newsletter', category: 'Email', amount: 575134 },
  { id: 'CMP-0399', name: 'Referral Digest', category: 'Display', amount: 430227 },
  { id: 'CMP-0400', name: 'Launch Digest', category: 'Email', amount: 562547 },
];

describe('CampaignTable empty results', () => {
  it('filters, sorts and pages through 16 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0385');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0385');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0385');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-16 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0395');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0385');
    await user.clear(filter);
    await user.type(filter, 'pro');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0385');
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0400');
    await user.clear(filter);
    await user.type(filter, 'Ref');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: /^Reference/ }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-2 of 2');
    expect(screen.queryAllByTestId('row')).toHaveLength(2);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0385');
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0385');
  });

  it('filters, sorts and pages through 16 campaigns', async () => {
    const rows = ROWS;
    const user = userEvent.setup();
    render(<CampaignTable rows={rows} />);
    const filter = screen.getByRole('searchbox', { name: 'Filter' });
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    await user.clear(filter);
    await user.type(filter, 'Summ');
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-1 of 1');
    expect(screen.queryAllByTestId('row')).toHaveLength(1);
    await user.clear(filter);
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 1-10 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(10);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0385');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('table-status').textContent).toBe('Showing 11-16 of 16');
    expect(screen.queryAllByTestId('row')).toHaveLength(6);
    expect(screen.getAllByTestId('row')[0]).toHaveTextContent('CMP-0395');
  });
});
