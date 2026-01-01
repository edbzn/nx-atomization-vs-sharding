// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { AssetTable as unitAsset0003Table } from '@bench/unit-asset-0003';
import { InvoiceTable as ctInvoice0002Table } from '@bench/ct-invoice-0002';

export const INTEGRATIONS = {
  'unit-asset-0003': unitAsset0003Table,
  'ct-invoice-0002': ctInvoice0002Table,
} as const;
