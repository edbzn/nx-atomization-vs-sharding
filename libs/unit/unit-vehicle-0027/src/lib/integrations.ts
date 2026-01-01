// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { ContractTable as unitContract0023Table } from '@bench/unit-contract-0023';
import { ProductTable as ctProduct0021Table } from '@bench/ct-product-0021';

export const INTEGRATIONS = {
  'unit-contract-0023': unitContract0023Table,
  'ct-product-0021': ctProduct0021Table,
} as const;
