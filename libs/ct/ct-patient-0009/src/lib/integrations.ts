// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { InvoiceTable as ctInvoice0002Table } from '@bench/ct-invoice-0002';

export const INTEGRATIONS = {
  'ct-invoice-0002': ctInvoice0002Table,
} as const;
