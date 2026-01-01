// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { ContractTable as unitContract0064Table } from '@bench/unit-contract-0064';

export const INTEGRATIONS = {
  'unit-contract-0064': unitContract0064Table,
} as const;
