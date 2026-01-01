// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { ProductTable as ctProduct0000Table } from '@bench/ct-product-0000';

export const INTEGRATIONS = {
  'ct-product-0000': ctProduct0000Table,
} as const;
