export interface ContractRow {
  id: string;
  name: string;
  category: string;
  /** Amount in cents. */
  amount: number;
}

export const CONTRACT_CATEGORIES = ['Signed', 'Review', 'Expired', 'Renewal', 'Draft'] as const;
