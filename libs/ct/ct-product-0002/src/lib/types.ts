export interface ProductRow {
  id: string;
  name: string;
  category: string;
  /** Amount in cents. */
  amount: number;
}

export const PRODUCT_CATEGORIES = ['Lighting', 'Kitchen', 'Garden', 'Office', 'Outdoor'] as const;
