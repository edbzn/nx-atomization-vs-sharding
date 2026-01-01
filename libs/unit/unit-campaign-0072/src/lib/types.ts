export interface CampaignRow {
  id: string;
  name: string;
  category: string;
  /** Amount in cents. */
  amount: number;
}

export const CAMPAIGN_CATEGORIES = ['Email', 'Social', 'Search', 'Display', 'Event'] as const;
