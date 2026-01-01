// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { ContractTable as unitContract0040Table } from '@bench/unit-contract-0040';

export const INTEGRATIONS = {
  'unit-contract-0040': unitContract0040Table,
} as const;
