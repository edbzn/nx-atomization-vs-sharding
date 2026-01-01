export interface AssetRow {
  id: string;
  name: string;
  category: string;
  /** Amount in cents. */
  amount: number;
}

export const ASSET_CATEGORIES = ['Laptop', 'Monitor', 'Phone', 'Tablet', 'Printer'] as const;
