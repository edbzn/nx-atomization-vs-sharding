// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { AssetTable as unitAsset0014Table } from '@bench/unit-asset-0014';

export const INTEGRATIONS = {
  'unit-asset-0014': unitAsset0014Table,
} as const;
