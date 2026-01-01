// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { AssetTable as unitAsset0017Table } from '@bench/unit-asset-0017';
import { CampaignTable as unitCampaign0004Table } from '@bench/unit-campaign-0004';

export const INTEGRATIONS = {
  'unit-asset-0017': unitAsset0017Table,
  'unit-campaign-0004': unitCampaign0004Table,
} as const;
