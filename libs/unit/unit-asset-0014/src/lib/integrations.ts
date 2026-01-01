// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { InvoiceTable as ctInvoice0004Table } from '@bench/ct-invoice-0004';
import { ProductTable as ctProduct0002Table } from '@bench/ct-product-0002';

export const INTEGRATIONS = {
  'ct-invoice-0004': ctInvoice0004Table,
  'ct-product-0002': ctProduct0002Table,
} as const;
