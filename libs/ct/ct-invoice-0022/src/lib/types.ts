export interface InvoiceRow {
  id: string;
  name: string;
  category: string;
  /** Amount in cents. */
  amount: number;
}

export const INVOICE_CATEGORIES = ['Draft', 'Sent', 'Paid', 'Overdue', 'Void'] as const;
