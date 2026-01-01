// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { InvoiceTable as ctInvoice0041Table } from '@bench/ct-invoice-0041';

export const INTEGRATIONS = {
  'ct-invoice-0041': ctInvoice0041Table,
} as const;
