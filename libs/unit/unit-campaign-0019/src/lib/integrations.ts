// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { InvoiceTable as ctInvoice0014Table } from '@bench/ct-invoice-0014';

export const INTEGRATIONS = {
  'ct-invoice-0014': ctInvoice0014Table,
} as const;
