// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { CampaignTable as unitCampaign0028Table } from '@bench/unit-campaign-0028';
import { AssetTable as unitAsset0023Table } from '@bench/unit-asset-0023';

export const INTEGRATIONS = {
  'unit-campaign-0028': unitCampaign0028Table,
  'unit-asset-0023': unitAsset0023Table,
} as const;
