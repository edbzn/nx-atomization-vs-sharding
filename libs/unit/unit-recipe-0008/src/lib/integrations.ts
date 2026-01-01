// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { EmployeeTable as unitEmployee0000Table } from '@bench/unit-employee-0000';
import { AssetTable as unitAsset0003Table } from '@bench/unit-asset-0003';

export const INTEGRATIONS = {
  'unit-employee-0000': unitEmployee0000Table,
  'unit-asset-0003': unitAsset0003Table,
} as const;
