// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { AssetTable as unitAsset0030Table } from '@bench/unit-asset-0030';

export const INTEGRATIONS = {
  'unit-asset-0030': unitAsset0030Table,
} as const;
